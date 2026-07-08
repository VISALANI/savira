const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { generateOTP, sendOTPEmail } = require("../config/email");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || "30d" });

const safeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  isAdmin: user.isAdmin,
  isVerified: user.isVerified,
  avatar: user.avatar,
  addresses: user.addresses,
  wishlist: user.wishlist,
  createdAt: user.createdAt,
});

// ─── REGISTER ────────────────────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check if a VERIFIED account already exists with this email or phone
    const verifiedEmail = await User.findOne({ email, isVerified: true });
    if (verifiedEmail) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const verifiedPhone = await User.findOne({ phone, isVerified: true });
    if (verifiedPhone) {
      return res.status(400).json({ message: "Mobile number is already registered" });
    }

    const otp = generateOTP();

    // If an unverified account exists with this email → update it (allow retry)
    let user = await User.findOne({ email, isVerified: false });

    if (user) {
      // Update the existing unverified account with new details
      user.name = name;
      user.phone = phone;
      user.password = password; // will be hashed by pre-save hook
      user.setOTP(otp, "verify");
      await user.save();
    } else {
      // Check if unverified account exists with same phone (different email)
      const unverifiedPhone = await User.findOne({ phone, isVerified: false });
      if (unverifiedPhone) {
        // Update phone account with new email
        unverifiedPhone.name = name;
        unverifiedPhone.email = email;
        unverifiedPhone.password = password;
        unverifiedPhone.setOTP(otp, "verify");
        await unverifiedPhone.save();
        user = unverifiedPhone;
      } else {
        // Create fresh unverified account
        user = new User({ name, email, phone, password, isVerified: false });
        user.setOTP(otp, "verify");
        await user.save();
      }
    }

    // Send OTP email
    try {
      await sendOTPEmail({ to: email, name, otp, type: "verify" });
    } catch (emailErr) {
      // Roll back if email fails
      if (!user.isVerified) await User.findByIdAndDelete(user._id);
      console.error("Email send failed:", emailErr.message);
      return res.status(500).json({
        message: "Failed to send verification email. Please try again.",
      });
    }

    res.status(201).json({
      message: "OTP sent to your email. Please verify to complete registration.",
      email,
      requiresVerification: true,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── VERIFY EMAIL OTP ─────────────────────────────────────────────────────────
exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email }).select("+otp +otpExpiry +otpType");
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "Email already verified" });

    const result = user.verifyOTP(otp, "verify");
    if (!result.valid) return res.status(400).json({ message: result.message });

    user.isVerified = true;
    user.clearOTP();
    await user.save();

    res.json({
      message: "Email verified successfully! Welcome to SAVIRA.",
      token: generateToken(user._id),
      user: safeUser(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── RESEND OTP ───────────────────────────────────────────────────────────────
exports.resendOTP = async (req, res) => {
  try {
    const { email, type = "verify" } = req.body;
    const user = await User.findOne({ email }).select("+otp +otpExpiry +otpType +lastOtpSentAt");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (type === "verify" && user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // Enforce 2-minute cooldown
    const canResend = user.canResendOTP();
    if (!canResend.allowed) {
      const minutes = Math.ceil(canResend.secondsLeft / 60);
      return res.status(429).json({
        message: `Please wait ${canResend.secondsLeft} seconds before requesting a new OTP`,
        secondsLeft: canResend.secondsLeft,
        retryAfterMinutes: minutes,
      });
    }

    const otp = generateOTP();
    user.setOTP(otp, type);
    await user.save();

    await sendOTPEmail({ to: email, name: user.name, otp, type });
    res.json({ message: "OTP sent successfully. It expires in 1 minute." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const isPhone = /^[6-9]\d{9}$/.test(identifier);
    const query = isPhone ? { phone: identifier } : { email: identifier.toLowerCase() };

    const user = await User.findOne(query).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await user.matchPassword(password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    if (!user.isVerified) {
      // Auto-resend OTP for unverified users
      const otp = generateOTP();
      const fullUser = await User.findById(user._id).select("+otp +otpExpiry +otpType");
      fullUser.setOTP(otp, "verify");
      await fullUser.save();
      try { await sendOTPEmail({ to: user.email, name: user.name, otp, type: "verify" }); } catch {}

      return res.status(403).json({
        message: "Please verify your email. A new OTP has been sent.",
        email: user.email,
        requiresVerification: true,
        code: "UNVERIFIED",
      });
    }

    res.json({ token: generateToken(user._id), user: safeUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email }).select("+otp +otpExpiry +otpType");
    if (!user) return res.json({ message: "If this email exists, an OTP has been sent." });

    const otp = generateOTP();
    user.setOTP(otp, "reset");
    await user.save();

    try { await sendOTPEmail({ to: email, name: user.name, otp, type: "reset" }); } catch {}
    res.json({ message: "Password reset OTP sent to your email." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── RESET PASSWORD ───────────────────────────────────────────────────────────
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const user = await User.findOne({ email }).select("+otp +otpExpiry +otpType +password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const result = user.verifyOTP(otp, "reset");
    if (!result.valid) return res.status(400).json({ message: result.message });

    user.password = password;
    user.clearOTP();
    await user.save();

    res.json({ message: "Password reset successfully. Please login." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET PROFILE ──────────────────────────────────────────────────────────────
exports.getProfile = async (req, res) => {
  res.json({ user: safeUser(req.user) });
};

// ─── UPDATE PROFILE ───────────────────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    const user = await User.findById(req.user._id).select("+password");

    if (name) user.name = name;
    if (phone) {
      if (!/^[6-9]\d{9}$/.test(phone))
        return res.status(400).json({ message: "Enter a valid 10-digit Indian mobile number" });
      const exists = await User.findOne({ phone, _id: { $ne: user._id }, isVerified: true });
      if (exists) return res.status(400).json({ message: "Mobile number already in use" });
      user.phone = phone;
    }
    if (password) {
      if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
      user.password = password;
    }

    await user.save();
    res.json({ user: safeUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── ADDRESS MANAGEMENT ───────────────────────────────────────────────────────
exports.addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (req.body.isDefault) user.addresses.forEach((a) => (a.isDefault = false));
    user.addresses.push(req.body);
    await user.save();
    res.json({ addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.id);
    await user.save();
    res.json({ addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
