export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  category: string;
  fabric: string;
  colors: string[];
  sizes: string[];
  images: string[];
  video?: string;
  stock: number;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  washCare: string;
  estimatedDelivery: string;
  codAvailable: boolean;
  ratings: number;
  numReviews: number;
  tags: string[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  isAdmin: boolean;
  isVerified: boolean;
  isBlocked?: boolean;
  addresses: Address[];
  wishlist: string[];
  createdAt: string;
}

export interface Address {
  _id?: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: "razorpay" | "cod";
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "processing" | "shipped" | "out_for_delivery" | "delivered" | "cancelled";
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  trackingId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
  price: number;
}

export interface Review {
  _id: string;
  user: { name: string; avatar?: string };
  product: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Coupon {
  _id: string;
  code: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  minOrderValue: number;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: string;
}

export interface Category {
  name: string;
  slug: string;
  image: string;
  description: string;
}
