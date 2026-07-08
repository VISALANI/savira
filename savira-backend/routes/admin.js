const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/auth");
const {
  getDashboard, getProducts, getProduct, createProduct, updateProduct, deleteProduct,
  getOrders, updateOrderStatus, getUsers,
} = require("../controllers/adminController");
const Coupon = require("../models/Coupon");

router.use(protect, adminOnly);

router.get("/dashboard", getDashboard);

router.get("/products", getProducts);
router.get("/products/:id", getProduct);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

router.get("/orders", getOrders);
router.put("/orders/:id/status", updateOrderStatus);

router.get("/users", getUsers);

router.get("/coupons", async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ coupons });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post("/coupons", async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ coupon });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete("/coupons/:id", async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: "Coupon deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get("/reviews", async (req, res) => {
  try {
    const Review = require("../models/Review");
    const reviews = await Review.find().populate("user", "name email").populate("product", "name").sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete("/reviews/:id", async (req, res) => {
  try {
    const Review = require("../models/Review");
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    const remaining = await Review.find({ product: review.product });
    const avgRating = remaining.length > 0 ? remaining.reduce((s, r) => s + r.rating, 0) / remaining.length : 0;
    await require("../models/Product").findByIdAndUpdate(review.product, { ratings: avgRating, numReviews: remaining.length });
    res.json({ message: "Review deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put("/users/:id/block", async (req, res) => {
  try {
    const User = require("../models/User");
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: req.body.isBlocked }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: `User ${req.body.isBlocked ? "blocked" : "unblocked"}`, user });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
