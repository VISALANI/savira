const { body, validationResult } = require("express-validator");

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};

const registerRules = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ min: 2, max: 50 }).withMessage("Name must be 2-50 characters"),
  body("email").trim().isEmail().withMessage("Enter a valid email address"),
  body("phone").trim().matches(/^[6-9]\d{9}$/).withMessage("Enter a valid 10-digit Indian mobile number"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("confirmPassword").custom((val, { req }) => {
    if (!val) throw new Error("Please confirm your password");
    if (val !== req.body.password) throw new Error("Passwords do not match");
    return true;
  }),
];

const loginRules = [
  body("identifier").trim().notEmpty().withMessage("Email or mobile number is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const otpRules = [
  body("otp").trim().isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits").isNumeric().withMessage("OTP must be numeric"),
];

const resetPasswordRules = [
  ...otpRules,
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("confirmPassword").custom((val, { req }) => {
    if (val !== req.body.password) throw new Error("Passwords do not match");
    return true;
  }),
];

module.exports = { handleValidation, registerRules, loginRules, otpRules, resetPasswordRules };
