import { Product } from "./types";

// Reliable fashion/ethnic wear images from Unsplash
const IMAGES = [
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=75",
  "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=75",
  "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=75",
  "https://images.unsplash.com/photo-1594938298870-5b22d0a7e8b4?w=600&q=75",
  "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&q=75",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=75",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=75",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=75",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=75",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=75",
  "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=75",
  "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=75",
];

const PRODUCT_DATA = [
  { name: "Floral Embroidered Anarkali Kurti", category: "kurtis", price: 1299, originalPrice: 1799, isNewArrival: true, isBestSeller: false },
  { name: "Cotton Straight Kurti", category: "cotton-kurtis", price: 899, originalPrice: 1199, isNewArrival: true, isBestSeller: false },
  { name: "Festive Silk Kurti", category: "festive-wear", price: 2499, originalPrice: 3299, isNewArrival: true, isBestSeller: false },
  { name: "Office Wear Kurti Set", category: "office-wear", price: 1799, originalPrice: 2299, isNewArrival: false, isBestSeller: true },
  { name: "Co-ord Palazzo Set", category: "coord-sets", price: 1999, originalPrice: 2599, isNewArrival: false, isBestSeller: true },
  { name: "Daily Wear Cotton Kurti", category: "daily-wear", price: 799, originalPrice: 999, isNewArrival: false, isBestSeller: true },
  { name: "Embroidered Chanderi Kurti", category: "kurtis", price: 1599, originalPrice: 1999, isNewArrival: false, isBestSeller: true },
  { name: "Block Print Cotton Kurti", category: "cotton-kurtis", price: 1099, originalPrice: 1399, isNewArrival: false, isBestSeller: false },
  { name: "Silk Festive Co-ord Set", category: "festive-wear", price: 2999, originalPrice: 3999, isNewArrival: true, isBestSeller: true },
  { name: "Rayon Straight Kurti", category: "daily-wear", price: 999, originalPrice: 1299, isNewArrival: false, isBestSeller: false },
  { name: "Georgette Kurti with Dupatta", category: "kurtis", price: 1699, originalPrice: 2199, isNewArrival: true, isBestSeller: false },
  { name: "Linen Office Kurti", category: "office-wear", price: 1199, originalPrice: 1499, isNewArrival: false, isBestSeller: false },
];

export const MOCK_PRODUCTS: Product[] = PRODUCT_DATA.map((p, i) => ({
  _id: `mock-${i}`,
  name: p.name,
  slug: `${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${i}`,
  description: `Beautiful ${p.name} crafted with premium fabric. Perfect for every occasion.`,
  price: p.price,
  originalPrice: p.originalPrice,
  discount: Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100),
  category: p.category,
  fabric: ["Cotton", "Silk", "Rayon", "Georgette", "Linen", "Chanderi"][i % 6],
  colors: ["Sage Green", "Ivory", "Dusty Rose"],
  sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  // Each product gets its own unique image — no shared fallback
  images: [IMAGES[i % IMAGES.length]],
  stock: 40 + i,
  isNewArrival: p.isNewArrival,
  isBestSeller: p.isBestSeller,
  isFeatured: i < 4,
  washCare: "Hand wash in cold water. Do not bleach. Dry in shade.",
  estimatedDelivery: "3-5 business days",
  codAvailable: true,
  ratings: parseFloat((4.2 + (i % 3) * 0.2).toFixed(1)),
  numReviews: 12 + i * 3,
  tags: ["ethnic", "kurti", p.category],
  createdAt: new Date(Date.now() - i * 86400000 * 3).toISOString(),
}));

export const getMockProducts = (filter?: Partial<Product>) =>
  filter ? MOCK_PRODUCTS.filter((p) => Object.entries(filter).every(([k, v]) => (p as any)[k] === v)) : MOCK_PRODUCTS;
