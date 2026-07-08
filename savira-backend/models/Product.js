const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 },
  discount: { type: Number, default: 0 },
  category: {
    type: String,
    required: true,
    enum: ["kurtis", "cotton-kurtis", "festive-wear", "office-wear", "coord-sets", "daily-wear"],
  },
  fabric: { type: String, required: true },
  colors: [String],
  sizes: [String],
  images: [String],
  video: String,
  stock: { type: Number, required: true, default: 0, min: 0 },
  isNewArrival: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  washCare: { type: String, default: "Hand wash in cold water" },
  estimatedDelivery: { type: String, default: "3-5 business days" },
  codAvailable: { type: Boolean, default: true },
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  tags: [String],
}, { timestamps: true });

productSchema.pre("save", function (next) {
  if (this.isModified("name") || !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true }) + "-" + Date.now();
  }
  if (this.originalPrice && this.originalPrice > this.price) {
    this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  next();
});

productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ category: 1, price: 1 });

module.exports = mongoose.model("Product", productSchema);
