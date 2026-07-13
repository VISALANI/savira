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

    // Send OTP email with 15s timeout (Render SMTP block workaround)
    try {
      const emailTimeout = new Promise((_, reject) => setTimeout(() => reject(new Error('SMTP_TIMEOUT')), 15000));
      await Promise.race([sendOTPEmail({ to: email, name, otp, type: 'verify' }), emailTimeout]);
    } catch (emailErr) {
      console.error('Email send failed:', emailErr.message);
      if (emailErr.message === 'SMTP_TIMEOUT') {
        console.log('[OTP FALLBACK] Email: ' + email + ' | OTP: ' + otp);
        return res.status(201).json({ message: 'Account created but OTP email failed. Contact support.', email, requiresVerification: true, emailFailed: true });
      }
      if (!user.isVerified) await User.findByIdAndDelete(user._id);
      return res.status(500).json({ message: 'Email error: ' + emailErr.message });
    }