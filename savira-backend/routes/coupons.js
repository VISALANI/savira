const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const Coupon = require("../models/Coupon");

router.post("/validate", protect, async (req, res) => {
  try {
    const { code, amount } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) return res.status(404).json({ message: "Invalid coupon code" });
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date())
      return res.status(400).json({ message: "Coupon has expired" });
    if (coupon.usedCount >= coupon.maxUses)
      return res.status(400).json({ message: "Coupon usage limit reached" });
    if (amount < coupon.minOrderValue)
      return res.status(400).json({ message: `Minimum order value is ₹${coupon.minOrderValue}` });

    const discountAmount = coupon.discountType === "percentage"
      ? Math.round((amount * coupon.discountValue) / 100)
      : coupon.discountValue;

    res.json({ discountAmount, coupon: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
