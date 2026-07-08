const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { createOrder, verifyPayment, getMyOrders, getOrder } = require("../controllers/orderController");

router.post("/", protect, createOrder);
router.post("/verify-payment", protect, verifyPayment);
router.get("/my-orders", protect, getMyOrders);
router.get("/:id", protect, getOrder);

module.exports = router;
