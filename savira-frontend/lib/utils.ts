export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

export const calculateDiscount = (original: number, current: number): number => {
  return Math.round(((original - current) / original) * 100);
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
};

export const truncate = (text: string, length: number): string => {
  return text.length > length ? text.substring(0, length) + "..." : text;
};

export const CATEGORIES = [
  { name: "Kurtis", slug: "kurtis", image: "/images/cat-kurtis.jpg", description: "Everyday elegance" },
  { name: "Cotton Kurtis", slug: "cotton-kurtis", image: "/images/cat-cotton.jpg", description: "Breathable comfort" },
  { name: "Festive Wear", slug: "festive-wear", image: "/images/cat-festive.jpg", description: "Celebrate in style" },
  { name: "Office Wear", slug: "office-wear", image: "/images/cat-office.jpg", description: "Professional grace" },
  { name: "Co-ord Sets", slug: "coord-sets", image: "/images/cat-coord.jpg", description: "Effortless matching" },
  { name: "Daily Wear", slug: "daily-wear", image: "/images/cat-daily.jpg", description: "Casual comfort" },
];

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

export const ORDER_STATUS_STEPS = [
  { key: "processing", label: "Order Placed", icon: "📦" },
  { key: "shipped", label: "Shipped", icon: "🚚" },
  { key: "out_for_delivery", label: "Out for Delivery", icon: "🛵" },
  { key: "delivered", label: "Delivered", icon: "✅" },
];
