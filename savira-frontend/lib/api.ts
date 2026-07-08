import axios from "axios";
import { MOCK_PRODUCTS } from "./mockData";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 5000, // 5s timeout so UI doesn't hang waiting for offline backend
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const auth = localStorage.getItem("savira-auth");
    if (auth) {
      try {
        const { state } = JSON.parse(auth);
        if (state?.token) config.headers.Authorization = `Bearer ${state.token}`;
      } catch {}
    }
  }
  return config;
});

// Suppress network errors in console when backend is offline
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Only suppress genuine network/connection errors, NOT auth errors
    if (err.code === "ERR_NETWORK" || err.code === "ECONNREFUSED") {
      return Promise.reject(err);
    }
    // Always pass through 401/403/4xx/5xx so callers handle them properly
    return Promise.reject(err);
  }
);

/** Wraps a real API call with a mock fallback when backend is offline */
const withMock = async <T>(apiFn: () => Promise<T>, mockFn: () => T): Promise<T> => {
  if (DEMO_MODE) return mockFn();
  try {
    return await apiFn();
  } catch {
    return mockFn();
  }
};

// Auth
export const authAPI = {
  register: (data: { name: string; email: string; phone: string; password: string; confirmPassword: string }) =>
    api.post("/auth/register", data),
  verifyEmail: (data: { email: string; otp: string }) => api.post("/auth/verify-email", data),
  resendOTP: (data: { email: string; type: string }) => api.post("/auth/resend-otp", data),
  login: (data: { identifier: string; password: string }) => api.post("/auth/login", data),
  forgotPassword: (data: { email: string }) => api.post("/auth/forgot-password", data),
  resetPassword: (data: { email: string; otp: string; password: string; confirmPassword: string }) =>
    api.post("/auth/reset-password", data),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data: object) => api.put("/auth/profile", data),
  addAddress: (data: object) => api.post("/auth/address", data),
  deleteAddress: (id: string) => api.delete(`/auth/address/${id}`),
};

const mockProductsResponse = (products: typeof MOCK_PRODUCTS) =>
  ({ data: { products } } as any);

// Products — all methods fall back to mock data when backend is offline
export const productAPI = {
  getAll: (params?: Record<string, any>) =>
    withMock(
      () => api.get("/products", { params }),
      () => {
        let filtered = [...MOCK_PRODUCTS];
        if (params?.category) filtered = filtered.filter((p) => p.category === params.category);
        if (params?.search) filtered = filtered.filter((p) => p.name.toLowerCase().includes(params.search.toLowerCase()));
        if (params?.minPrice) filtered = filtered.filter((p) => p.price >= Number(params.minPrice));
        if (params?.maxPrice) filtered = filtered.filter((p) => p.price <= Number(params.maxPrice));
        return mockProductsResponse(filtered);
      }
    ),
  getOne: (slug: string) =>
    withMock(
      () => api.get(`/products/${slug}`),
      () => {
        const product = MOCK_PRODUCTS.find((p) => p.slug === slug) || MOCK_PRODUCTS[0];
        return { data: { product } } as any;
      }
    ),
  getFeatured: () =>
    withMock(
      () => api.get("/products/featured"),
      () => mockProductsResponse(MOCK_PRODUCTS.filter((p) => p.isFeatured))
    ),
  getNewArrivals: () =>
    withMock(
      () => api.get("/products/new-arrivals"),
      () => mockProductsResponse(MOCK_PRODUCTS.filter((p) => p.isNewArrival))
    ),
  getBestSellers: () =>
    withMock(
      () => api.get("/products/best-sellers"),
      () => mockProductsResponse(MOCK_PRODUCTS.filter((p) => p.isBestSeller))
    ),
  getFestive: () =>
    withMock(
      () => api.get("/products/festive"),
      () => mockProductsResponse(MOCK_PRODUCTS.filter((p) => p.category === "festive-wear"))
    ),
  search: (query: string) =>
    withMock(
      () => api.get(`/products/search?q=${query}`),
      () => mockProductsResponse(MOCK_PRODUCTS.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())))
    ),
};

// Reviews
export const reviewAPI = {
  getByProduct: (productId: string) => api.get(`/reviews/${productId}`),
  create: (data: object) => api.post("/reviews", data),
};

// Orders
export const orderAPI = {
  create: (data: object) => api.post("/orders", data),
  getMyOrders: () => api.get("/orders/my-orders"),
  getOne: (id: string) => api.get(`/orders/${id}`),
  verifyPayment: (data: object) => api.post("/orders/verify-payment", data),
};

// Coupons
export const couponAPI = {
  validate: (code: string, amount: number) =>
    api.post("/coupons/validate", { code, amount }),
};

// Admin
export const adminAPI = {
  getDashboard: () => api.get("/admin/dashboard"),
  getProducts: (params?: object) => api.get("/admin/products", { params }),
  getProduct: (id: string) => api.get(`/admin/products/${id}`),
  createProduct: (data: object) => api.post("/admin/products", data),
  updateProduct: (id: string, data: object) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/admin/products/${id}`),
  getOrders: (params?: object) => api.get("/admin/orders", { params }),
  updateOrderStatus: (id: string, status: string) =>
    api.put(`/admin/orders/${id}/status`, { status }),
  getUsers: () => api.get("/admin/users"),
  blockUser: (id: string, isBlocked: boolean) => api.put(`/admin/users/${id}/block`, { isBlocked }),
  getCoupons: () => api.get("/admin/coupons"),
  createCoupon: (data: object) => api.post("/admin/coupons", data),
  deleteCoupon: (id: string) => api.delete(`/admin/coupons/${id}`),
  getReviews: () => api.get("/admin/reviews"),
  deleteReview: (id: string) => api.delete(`/admin/reviews/${id}`),
};

export default api;
