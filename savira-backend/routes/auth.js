const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { protect } = require("../middleware/auth");
const {
  handleValidation, registerRules, loginRules, otpRules, resetPasswordRules,
} = require("../middleware/validate");
const {
  register, verifyEmail, resendOTP, login,
  forgotPassword, resetPassword, getProfile, updateProfile, addAddress, deleteAddress,
} = require("../controllers/authController");

// Strict rate limits for auth endpoints
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { message: "Too many attempts, please try again later" } });
const otpLimiter = rateLimit({ windowMs: 5 * 60 * 1000, max: 5, message: { message: "Too many OTP requests, please wait" } });

router.post("/register", authLimiter, registerRules, handleValidation, register);
router.post("/verify-email", otpLimiter, otpRules, handleValidation, verifyEmail);
router.post("/resend-otp", otpLimiter, resendOTP);
router.post("/login", authLimiter, loginRules, handleValidation, login);
router.post("/forgot-password", otpLimiter, forgotPassword);
router.post("/reset-password", otpLimiter, resetPasswordRules, handleValidation, resetPassword);

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/address", protect, addAddress);
router.delete("/address/:id", protect, deleteAddress);

module.exports = router;
