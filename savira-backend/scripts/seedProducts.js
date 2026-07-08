require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");

const IMAGES = [
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
  "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80",
  "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80",
  "https://images.unsplash.com/photo-1594938298870-5b22d0a7e8b4?w=800&q=80",
  "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
];

const products = [
  { name: "Floral Embroidered Anarkali Kurti", category: "kurtis", price: 1299, originalPrice: 1799, fabric: "Cotton", isNewArrival: true, isFeatured: true, stock: 50 },
  { name: "Cotton Straight Kurti", category: "cotton-kurtis", price: 899, originalPrice: 1199, fabric: "Cotton", isNewArrival: true, isFeatured: true, stock: 80 },
  { name: "Festive Silk Kurti", category: "festive-wear", price: 2499, originalPrice: 3299, fabric: "Silk", isNewArrival: true, isFeatured: true, stock: 30 },
  { name: "Office Wear Kurti Set", category: "office-wear", price: 1799, originalPrice: 2299, fabric: "Rayon", isBestSeller: true, isFeatured: true, stock: 45 },
  { name: "Co-ord Palazzo Set", category: "coord-sets", price: 1999, originalPrice: 2599, fabric: "Georgette", isBestSeller: true, stock: 35 },
  { name: "Daily Wear Cotton Kurti", category: "daily-wear", price: 799, originalPrice: 999, fabric: "Cotton", isBestSeller: true, stock: 100 },
  { name: "Embroidered Chanderi Kurti", category: "kurtis", price: 1599, originalPrice: 1999, fabric: "Chanderi", isBestSeller: true, stock: 25 },
  { name: "Block Print Cotton Kurti", category: "cotton-kurtis", price: 1099, originalPrice: 1399, fabric: "Cotton", stock: 60 },
  { name: "Silk Festive Co-ord Set", category: "festive-wear", price: 2999, originalPrice: 3999, fabric: "Silk", isNewArrival: true, isBestSeller: true, stock: 20 },
  { name: "Rayon Straight Kurti", category: "daily-wear", price: 999, originalPrice: 1299, fabric: "Rayon", stock: 70 },
  { name: "Georgette Kurti with Dupatta", category: "kurtis", price: 1699, originalPrice: 2199, fabric: "Georgette", isNewArrival: true, stock: 40 },
  { name: "Linen Office Kurti", category: "office-wear", price: 1199, originalPrice: 1499, fabric: "Linen", stock: 55 },
];

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await Product.deleteMany({});
  console.log("🗑  Cleared existing products");

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    await Product.create({
      ...p,
      description: `Beautiful ${p.name} crafted with premium ${p.fabric} fabric. Perfect for every occasion. Features intricate detailing and a flattering silhouette that celebrates the modern Indian woman.`,
      colors: ["Sage Green", "Ivory", "Dusty Rose"],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      images: [IMAGES[i % IMAGES.length], IMAGES[(i + 1) % IMAGES.length]],
      washCare: "Hand wash in cold water. Do not bleach. Dry in shade. Iron on low heat.",
      estimatedDelivery: "3-5 business days",
      codAvailable: true,
      ratings: parseFloat((4.2 + (i % 3) * 0.2).toFixed(1)),
      numReviews: 12 + i * 3,
      tags: ["ethnic", "kurti", p.category],
    });
    console.log(`✅ Created: ${p.name}`);
  }

  console.log(`\n🌸 Seeded ${products.length} products successfully!`);
  process.exit(0);
}).catch((err) => { console.error(err.message); process.exit(1); });
