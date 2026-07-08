const express = require("express");
const router = express.Router();
const {
  getProducts, getProduct, getFeatured, getNewArrivals,
  getBestSellers, getFestive, searchProducts,
} = require("../controllers/productController");

router.get("/", getProducts);
router.get("/search", searchProducts);
router.get("/featured", getFeatured);
router.get("/new-arrivals", getNewArrivals);
router.get("/best-sellers", getBestSellers);
router.get("/festive", getFestive);
router.get("/:slug", getProduct);

module.exports = router;
