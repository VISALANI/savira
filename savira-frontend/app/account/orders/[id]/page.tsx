"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { orderAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { Order } from "@/lib/types";
import { formatPrice, ORDER_STATUS_STEPS } from "@/lib/utils";
import { PageLoader } from "@/components/ui/LoadingSpinner";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push(`/login?redirect=/account/orders/${id}`);
      return;
    }
    orderAPI.getOne(id)
      .then((res) => setOrder(res.data.order))
      .catch(() => router.push("/account/orders"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLoader />;
  if (!order) return null;

  const currentStep = ORDER_STATUS_STEPS.findIndex((s) => s.key === order.orderStatus);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/account/orders" className="font-poppins text-sm text-gray-400 hover:text-sage">Orders</Link>
        <span className="text-gray-300">/</span>
        <h1 className="font-playfair text-xl text-charcoal">Order #{order._id.slice(-8).toUpperCase()}</h1>
      </div>

      {/* Tracking */}
      {order.orderStatus !== "cancelled" && (
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-5">
          <h2 className="font-playfair text-base text-charcoal mb-5">Order Tracking</h2>
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-100 z-0" />
            <div
              className="absolute top-5 left-0 h-0.5 bg-sage z-0 transition-all duration-500"
              style={{ width: `${(currentStep / (ORDER_STATUS_STEPS.length - 1)) * 100}%` }}
            />
            {ORDER_STATUS_STEPS.map((step, i) => (
              <div key={step.key} className="flex flex-col items-center gap-2 z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-colors ${i <= currentStep ? "bg-sage" : "bg-gray-100"}`}>
                  {step.icon}
                </div>
                <p className={`font-poppins text-[10px] text-center ${i <= currentStep ? "text-sage font-medium" : "text-gray-400"}`}>
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-5">
        <h2 className="font-playfair text-base text-charcoal mb-4">Items Ordered</h2>
        <div className="space-y-4">
          {order.items.map((item, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-16 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                <img src={item.product?.images?.[0] || "/images/placeholder.jpg"} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="font-poppins text-sm font-medium text-charcoal">{item.product?.name}</p>
                <p className="font-poppins text-xs text-gray-400 mt-0.5">Size: {item.size} · Qty: {item.quantity}</p>
                <p className="font-poppins text-sm font-semibold text-charcoal mt-1">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Address + Payment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-playfair text-sm text-charcoal mb-3">Delivery Address</h3>
          <p className="font-poppins text-sm text-charcoal">{order.shippingAddress.name}</p>
          <p className="font-poppins text-xs text-gray-500 mt-1">{order.shippingAddress.line1}</p>
          {order.shippingAddress.line2 && <p className="font-poppins text-xs text-gray-500">{order.shippingAddress.line2}</p>}
          <p className="font-poppins text-xs text-gray-500">{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}</p>
          <p className="font-poppins text-xs text-gray-500 mt-1">{order.shippingAddress.phone}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-playfair text-sm text-charcoal mb-3">Payment Summary</h3>
          <div className="space-y-2 font-poppins text-sm">
            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>−{formatPrice(order.discount)}</span></div>}
            <div className="flex justify-between text-gray-500"><span>Shipping</span><span>{order.shipping === 0 ? "FREE" : formatPrice(order.shipping)}</span></div>
            <div className="flex justify-between font-semibold text-charcoal border-t border-gray-100 pt-2"><span>Total</span><span>{formatPrice(order.total)}</span></div>
            <p className="text-xs text-gray-400 capitalize">Payment: {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online"} · {order.paymentStatus}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
