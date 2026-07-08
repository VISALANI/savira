"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { FiTrash2, FiShoppingBag, FiTag } from "react-icons/fi";
import { couponAPI } from "@/lib/api";
import { useRequireAuth } from "@/lib/useRequireAuth";
import toast from "react-hot-toast";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();
  const requireAuth = useRequireAuth();
  const router = useRouter();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const shipping = subtotal() >= 999 ? 0 : 99;
  const total = subtotal() - discount + shipping;

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    setCouponLoading(true);
    try {
      const res = await couponAPI.validate(coupon, subtotal());
      setDiscount(res.data.discountAmount);
      setCouponApplied(coupon);
      toast.success(`Coupon applied! You saved ${formatPrice(res.data.discountAmount)}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid coupon code");
    } finally {
      setCouponLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <FiShoppingBag size={48} className="text-gray-200" />
        <h2 className="font-playfair text-2xl text-charcoal">Your cart is empty</h2>
        <p className="font-poppins text-sm text-gray-400">Add some beautiful pieces to your cart</p>
        <Link href="/shop" className="btn-primary mt-2">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-playfair text-2xl md:text-3xl text-charcoal mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={`${item.product._id}-${item.size}-${item.color}`}
              className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm">
              <Link href={`/product/${item.product.slug}`} className="w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
                <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/product/${item.product.slug}`}>
                  <h3 className="font-poppins text-sm font-medium text-charcoal line-clamp-2 hover:text-sage transition-colors">
                    {item.product.name}
                  </h3>
                </Link>
                <div className="flex gap-3 mt-1">
                  <span className="font-poppins text-xs text-gray-400">Size: {item.size}</span>
                  {item.color && <span className="font-poppins text-xs text-gray-400">Color: {item.color}</span>}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button onClick={() => updateQuantity(item.product._id, item.size, item.color, item.quantity - 1)}
                      className="px-2.5 py-1 text-charcoal hover:bg-gray-50 font-poppins text-sm">−</button>
                    <span className="px-3 py-1 font-poppins text-sm border-x border-gray-200">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product._id, item.size, item.color, item.quantity + 1)}
                      className="px-2.5 py-1 text-charcoal hover:bg-gray-50 font-poppins text-sm">+</button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-poppins text-sm font-semibold text-charcoal">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                    <button onClick={() => removeItem(item.product._id, item.size, item.color)}
                      className="text-gray-300 hover:text-red-400 transition-colors">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="font-playfair text-lg text-charcoal mb-5">Order Summary</h2>

            {/* Coupon */}
            <div className="mb-5">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    placeholder="Coupon code"
                    disabled={!!couponApplied}
                    className="input-field pl-9 py-2.5 text-sm"
                  />
                </div>
                <button
                  onClick={applyCoupon}
                  disabled={couponLoading || !!couponApplied}
                  className="btn-outline py-2.5 px-4 text-sm whitespace-nowrap"
                >
                  {couponLoading ? "..." : couponApplied ? "Applied" : "Apply"}
                </button>
              </div>
              {couponApplied && (
                <p className="font-poppins text-xs text-green-600 mt-1.5">
                  ✓ {couponApplied} applied — saved {formatPrice(discount)}
                </p>
              )}
            </div>

            <div className="space-y-3 text-sm font-poppins">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>{formatPrice(subtotal())}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span>
                  <span>−{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-600">FREE</span> : formatPrice(shipping)}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-400">Add {formatPrice(999 - subtotal())} more for free shipping</p>
              )}
              <div className="border-t border-gray-100 pt-3 flex justify-between font-semibold text-charcoal text-base">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={() => requireAuth(() => router.push(`/checkout?discount=${discount}&coupon=${encodeURIComponent(couponApplied)}`))}
              className="btn-primary w-full text-center block mt-6"
            >
              Proceed to Checkout
            </button>
            <Link href="/shop" className="btn-outline w-full text-center block mt-3 text-sm">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
