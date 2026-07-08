const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
  size: { type: String, required: true },
  color: String,
  price: { type: Number, required: true },
});

const addressSchema = new mongoose.Schema({
  name: String, phone: String, line1: String, line2: String,
  city: String, state: String, pincode: String, isDefault: Boolean,
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [orderItemSchema],
  shippingAddress: { type: addressSchema, required: true },
  paymentMethod: { type: String, enum: ["razorpay", "cod"], required: true },
  paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  orderStatus: {
    type: String,
    enum: ["processing", "shipped", "out_for_delivery", "delivered", "cancelled"],
    default: "processing",
  },
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  total: { type: Number, required: true },
  couponCode: String,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  trackingId: String,
  shiprocketOrderId: String,
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
