const Product = require("../models/Product");

exports.getProducts = async (req, res) => {
  try {
    const { category, sort, search, minPrice, maxPrice, sizes, colors, fabrics, page = 1, limit = 20 } = req.query;
    const query = {};

    if (category) query.category = category;
    if (search) query.$text = { $search: search };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (sizes) query.sizes = { $in: sizes.split(",") };
    if (colors) query.colors = { $in: colors.split(",") };
    if (fabrics) query.fabric = { $in: fabrics.split(",") };

    const sortMap = {
      newest: { createdAt: -1 },
      popularity: { numReviews: -1, ratings: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
    };
    const sortObj = sortMap[sort] || { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(query).sort(sortObj).skip(skip).limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFeatured = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(8).sort({ createdAt: -1 });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({ isNewArrival: true }).limit(8).sort({ createdAt: -1 });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBestSellers = async (req, res) => {
  try {
    const products = await Product.find({ isBestSeller: true }).limit(8).sort({ numReviews: -1 });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFestive = async (req, res) => {
  try {
    const products = await Product.find({ category: "festive-wear" }).limit(8).sort({ createdAt: -1 });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ products: [] });
    const products = await Product.find({ $text: { $search: q } }).limit(10);
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
