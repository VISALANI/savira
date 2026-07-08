"use client";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCartStore, useAuthStore, useBuyNowStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { orderAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { FiCheck } from "react-icons/fi";

declare global { interface Window { Razorpay: any; } }

interface AddressForm {
  name: string; phone: string; line1: string; line2: string;
  city: string; state: string; pincode: string;
}

const STATES = ["Andhra Pradesh","Assam","Bihar","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"];

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get("mode") === "buynow";
  // Read coupon discount passed from cart page
  const urlDiscount = Number(searchParams.get("discount") || 0);
  const urlCoupon = searchParams.get("coupon") || "";

  const { items: cartItems, subtotal: cartSubtotal, clearCart } = useCartStore();
  const { item: buyNowItem, clear: clearBuyNow } = useBuyNowStore();
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  // Determine which items/subtotal to use
  const items = useMemo(() => {
    if (isBuyNow && buyNowItem) return [buyNowItem];
    return cartItems;
  }, [isBuyNow, buyNowItem, cartItems]);

  const subtotal = useMemo(() =>
    items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    [items]
  );

  // Apply coupon discount from cart (only for cart checkout, not buy now)
  const discount = isBuyNow ? 0 : urlDiscount;
  const couponCode = isBuyNow ? "" : urlCoupon;
  const shipping = (subtotal - discount) >= 999 ? 0 : 99;
  const total = subtotal - discount + shipping;

  const [step, setStep] = useState<"address" | "payment">("address");
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<AddressForm>({
    name: user?.name || "", phone: user?.phone || "",
    line1: "", line2: "", city: "", state: "", pincode: "",
  });

  useEffect(() => {
    if (!isAuthenticated()) { router.push("/login?redirect=/checkout"); return; }
    if (items.length === 0) { router.push(isBuyNow ? "/" : "/cart"); }
  }, []);

  const handleAddressSubmit = (e: React.FormEvent) => { e.preventDefault(); setStep("payment"); };

  const loadRazorpay = () => new Promise<boolean>((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

  const onSuccess = (orderId: string) => {
    if (isBuyNow) clearBuyNow();
    else clearCart();
    router.push(`/order-success?orderId=${orderId}`);
  };

  const handlePlaceOrder = async () => {
    // Debug: verify token exists before placing order
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("savira-auth");
      if (!stored) {
        toast.error("Please login first to place an order");
        router.push("/login?redirect=/checkout");
        return;
      }
      try {
        const { state } = JSON.parse(stored);
        if (!state?.token) {
          toast.error("Session expired. Please login again.");
          router.push("/login?redirect=/checkout");
          return;
        }
      } catch {
        toast.error("Session error. Please login again.");
        router.push("/login?redirect=/checkout");
        return;
      }
    }

    // Validate that all product IDs are real MongoDB ObjectIds
    const hasMockProducts = items.some((i) => i.product._id.startsWith("mock-"));
    if (hasMockProducts) {
      toast.error("These are demo products. Please shop from real products loaded from the database.");
      return;
    }
    setLoading(true);
    try {
      const orderData = {
        items: items.map((i) => ({
          product: i.product._id,
          quantity: i.quantity,
          size: i.size,
          color: i.color,
          price: i.product.price,
        })),
        shippingAddress: { ...address, isDefault: false },
        paymentMethod,
        subtotal,
        discount,
        couponCode: couponCode || undefined,
        shipping,
        total,
      };

      const res = await orderAPI.create(orderData);
      const order = res.data;

      if (paymentMethod === "cod") { onSuccess(order._id); return; }

      const loaded = await loadRazorpay();
      if (!loaded) { toast.error("Payment gateway failed to load"); setLoading(false); return; }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.razorpayOrder?.amount || total * 100,
        currency: "INR",
        name: "SAVIRA ATTIRES",
        description: "Premium Indian Ethnic Wear",
        order_id: order.razorpayOrder?.id,
        handler: async (response: any) => {
          await orderAPI.verifyPayment({
            orderId: order._id,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          onSuccess(order._id);
        },
        prefill: { name: address.name, contact: address.phone, email: user?.email || "" },
        theme: { color: "#4F6F52" },
        modal: { ondismiss: () => setLoading(false) },
      };
      new window.Razorpay(options).open();
    } catch (err: any) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || err.message || "Something went wrong";
      console.error("Order error:", err.response?.data || err.message);

      if (status === 401) {
        toast.error("Please login to place an order");
        router.push(`/login?redirect=/checkout${isBuyNow ? "?mode=buynow" : ""}`);
      } else if (status === 403) {
        toast.error(err.response?.data?.message || "Please verify your email before ordering");
      } else {
        toast.error(msg);
      }
      setLoading(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="font-playfair text-2xl md:text-3xl text-charcoal">
          {isBuyNow ? "Quick Checkout" : "Checkout"}
        </h1>
        {isBuyNow && (
          <span className="font-poppins text-xs bg-sage/10 text-sage px-3 py-1 rounded-full">
            1 item · Buy Now
          </span>
        )}
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-3 mb-8">
        {(["address", "payment"] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-poppins font-medium transition-colors ${step === s || (s === "address" && step === "payment") ? "bg-sage text-white" : "bg-gray-100 text-gray-400"}`}>
              {s === "address" && step === "payment" ? <FiCheck size={14} /> : i + 1}
            </div>
            <span className={`font-poppins text-sm capitalize ${step === s ? "text-charcoal font-medium" : "text-gray-400"}`}>{s}</span>
            {i === 0 && <div className="w-12 h-px bg-gray-200" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === "address" && (
            <form onSubmit={handleAddressSubmit} className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="font-playfair text-lg text-charcoal mb-2">Delivery Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-poppins text-xs text-gray-500 mb-1 block">Full Name *</label>
                  <input required value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} className="input-field" placeholder="Your full name" />
                </div>
                <div>
                  <label className="font-poppins text-xs text-gray-500 mb-1 block">Phone *</label>
                  <input required value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value.replace(/\D/g,"").slice(0,10) })} className="input-field" placeholder="10-digit mobile" />
                </div>
              </div>
              <div>
                <label className="font-poppins text-xs text-gray-500 mb-1 block">Address Line 1 *</label>
                <input required value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} className="input-field" placeholder="House/Flat no., Street" />
              </div>
              <div>
                <label className="font-poppins text-xs text-gray-500 mb-1 block">Address Line 2</label>
                <input value={address.line2} onChange={(e) => setAddress({ ...address, line2: e.target.value })} className="input-field" placeholder="Landmark, Area (optional)" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="font-poppins text-xs text-gray-500 mb-1 block">City *</label>
                  <input required value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="input-field" placeholder="City" />
                </div>
                <div>
                  <label className="font-poppins text-xs text-gray-500 mb-1 block">State *</label>
                  <select required value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className="input-field">
                    <option value="">Select</option>
                    {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-poppins text-xs text-gray-500 mb-1 block">Pincode *</label>
                  <input required value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g,"").slice(0,6) })} className="input-field" placeholder="6-digit" />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full mt-2">Continue to Payment</button>
            </form>
          )}

          {step === "payment" && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-playfair text-lg text-charcoal mb-5">Payment Method</h2>
              <div className="space-y-3">
                <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === "razorpay" ? "border-sage bg-sage/5" : "border-gray-100"}`}>
                  <input type="radio" name="pay" value="razorpay" checked={paymentMethod === "razorpay"} onChange={() => setPaymentMethod("razorpay")} className="accent-sage" />
                  <div>
                    <p className="font-poppins text-sm font-medium text-charcoal">Pay Online</p>
                    <p className="font-poppins text-xs text-gray-400">UPI, Cards, Netbanking, Google Pay, PhonePe</p>
                  </div>
                  <span className="ml-auto font-poppins text-xs text-sage font-medium">Recommended</span>
                </label>
                <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === "cod" ? "border-sage bg-sage/5" : "border-gray-100"}`}>
                  <input type="radio" name="pay" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="accent-sage" />
                  <div>
                    <p className="font-poppins text-sm font-medium text-charcoal">Cash on Delivery</p>
                    <p className="font-poppins text-xs text-gray-400">Pay when your order arrives</p>
                  </div>
                </label>
              </div>

              <div className="mt-5 p-4 bg-ivory rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-poppins text-xs font-medium text-charcoal">Delivering to</p>
                  <button onClick={() => setStep("address")} className="font-poppins text-xs text-sage">Change</button>
                </div>
                <p className="font-poppins text-sm text-gray-600">{address.name} · {address.phone}</p>
                <p className="font-poppins text-xs text-gray-400 mt-0.5">{address.line1}, {address.city}, {address.state} — {address.pincode}</p>
              </div>

              <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary w-full mt-5">
                {loading ? "Processing..." : `Place Order · ${formatPrice(total)}`}
              </button>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-2xl p-5 shadow-sm h-fit sticky top-24">
          <h3 className="font-playfair text-base text-charcoal mb-4">
            Order Summary
            {isBuyNow && <span className="font-poppins text-xs text-sage ml-2">(Buy Now)</span>}
          </h3>
          <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
            {items.map((item, idx) => (
              <div key={`${item.product._id}-${item.size}-${idx}`} className="flex gap-3">
                <div className="w-12 h-14 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                  <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-poppins text-xs text-charcoal line-clamp-1">{item.product.name}</p>
                  <p className="font-poppins text-xs text-gray-400">Size: {item.size} · Qty: {item.quantity}</p>
                  <p className="font-poppins text-xs font-medium text-charcoal mt-0.5">{formatPrice(item.product.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-3 space-y-2 font-poppins text-sm">
            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Coupon {couponCode && `(${couponCode})`}</span>
                <span>−{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-500">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="text-green-600">FREE</span> : formatPrice(shipping)}</span>
            </div>
            {shipping > 0 && <p className="text-xs text-gray-400">Add {formatPrice(999 - (subtotal - discount))} more for free shipping</p>}
            <div className="flex justify-between font-semibold text-charcoal text-base border-t border-gray-100 pt-2">
              <span>Total</span><span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
