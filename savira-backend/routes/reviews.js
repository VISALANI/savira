const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const Review = require("../models/Review");
const Product = require("../models/Product");

router.get("/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "name avatar").sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { product, rating, comment } = req.body;
    const existing = await Review.findOne({ product, user: req.user._id });
    if (existing) return res.status(400).json({ message: "You already reviewed this product" });

    const review = await Review.create({ user: req.user._id, product, rating, comment });

    // Update product rating
    const reviews = await Review.find({ product });
    const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(product, { ratings: avgRating, numReviews: reviews.length });

    res.status(201).json({ review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
