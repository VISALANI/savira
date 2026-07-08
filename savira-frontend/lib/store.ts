import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product, User } from "./types";

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity: number, size: string, color: string) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

interface WishlistStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  isWishlisted: (productId: string) => boolean;
  toggleItem: (product: Product) => void;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

interface BuyNowStore {
  item: CartItem | null;
  set: (item: CartItem | null) => void;
  clear: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity, size, color) => {
        const existing = get().items.find(
          (i) => i.product._id === product._id && i.size === size && i.color === color
        );
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.product._id === product._id && i.size === size && i.color === color
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, { product, quantity, size, color }] });
        }
      },
      removeItem: (productId, size, color) => {
        set({
          items: get().items.filter(
            (i) => !(i.product._id === productId && i.size === size && i.color === color)
          ),
        });
      },
      updateQuantity: (productId, size, color, quantity) => {
        if (quantity <= 0) { get().removeItem(productId, size, color); return; }
        set({
          items: get().items.map((i) =>
            i.product._id === productId && i.size === size && i.color === color
              ? { ...i, quantity }
              : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    }),
    { name: "savira-cart" }
  )
);

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        if (!get().isWishlisted(product._id)) set({ items: [...get().items, product] });
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((p) => p._id !== productId) });
      },
      clearWishlist: () => set({ items: [] }),
      isWishlisted: (productId) => get().items.some((p) => p._id === productId),
      toggleItem: (product) => {
        if (get().isWishlisted(product._id)) get().removeItem(product._id);
        else get().addItem(product);
      },
    }),
    { name: "savira-wishlist" }
  )
);

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () => {
        set({ user: null, token: null });
        // Clear cart and wishlist on logout for security
        useCartStore.getState().clearCart();
        useWishlistStore.getState().clearWishlist();
      },
      isAuthenticated: () => !!get().token,
    }),
    { name: "savira-auth" }
  )
);

export const useBuyNowStore = create<BuyNowStore>()((set) => ({
  item: null,
  set: (item) => set({ item }),
  clear: () => set({ item: null }),
}));
