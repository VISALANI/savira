const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const addressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  line1: { type: String, required: true },
  line2: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"], trim: true, minlength: 2, maxlength: 50 },
  email: { type: String, required: [true, "Email is required"], unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, "Invalid email address"] },
  phone: { type: String, required: [true, "Mobile number is required"], unique: true, trim: true, match: [/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"] },
  password: { type: String, required: [true, "Password is required"], minlength: 6, select: false },
  isAdmin: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  otp: { type: String, select: false },
  otpExpiry: { type: Date, select: false },
  otpType: { type: String, enum: ["verify", "reset"], select: false },
  lastOtpSentAt: { type: Date, select: false },
  avatar: String,
  addresses: [addressSchema],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
}, { timestamps: true });

// TTL: auto-delete unverified accounts 60s after otpExpiry
userSchema.index({ otpExpiry: 1 }, { expireAfterSeconds: 60, partialFilterExpression: { isVerified: false } });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = function (entered) {
  return bcrypt.compare(entered, this.password);
};

userSchema.methods.setOTP = function (otp, type) {
  this.otp = otp;
  this.otpExpiry = new Date(Date.now() + 60 * 1000); // 1 minute
  this.otpType = type || "verify";
  this.lastOtpSentAt = new Date();
};

userSchema.methods.verifyOTP = function (otp, type) {
  if (this.otpType !== type) return { valid: false, message: "Invalid OTP type" };
  if (!this.otp || !this.otpExpiry) return { valid: false, message: "No OTP found. Please request a new one." };
  if (new Date() > this.otpExpiry) return { valid: false, message: "OTP has expired. Please request a new one." };
  if (this.otp !== otp) return { valid: false, message: "Incorrect OTP. Please try again." };
  return { valid: true };
};

userSchema.methods.clearOTP = function () {
  this.otp = undefined;
  this.otpExpiry = undefined;
  this.otpType = undefined;
  this.lastOtpSentAt = undefined;
};

userSchema.methods.canResendOTP = function () {
  if (!this.lastOtpSentAt) return { allowed: true };
  const elapsed = Date.now() - new Date(this.lastOtpSentAt).getTime();
  const waitMs = 2 * 60 * 1000; // 2 minutes
  if (elapsed < waitMs) {
    return { allowed: false, secondsLeft: Math.ceil((waitMs - elapsed) / 1000) };
  }
  return { allowed: true };
};

module.exports = mongoose.model("User", userSchema);
