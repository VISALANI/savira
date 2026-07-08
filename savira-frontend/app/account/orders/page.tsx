"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { orderAPI } from "@/lib/api";
import { Order } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { FiPackage } from "react-icons/fi";

const STATUS_COLORS: Record<string, string> = {
  processing: "bg-yellow-50 text-yellow-600",
  shipped: "bg-blue-50 text-blue-600",
  out_for_delivery: "bg-purple-50 text-purple-600",
  delivered: "bg-green-50 text-green-600",
  cancelled: "bg-red-50 text-red-500",
};

export default function OrdersPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) { router.push("/login"); return; }
    orderAPI.getMyOrders()
      .then((res) => setOrders(res.data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/account" className="font-poppins text-sm text-gray-400 hover:text-sage">Account</Link>
        <span className="text-gray-300">/</span>
        <h1 className="font-playfair text-2xl text-charcoal">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <FiPackage size={48} className="text-gray-200 mx-auto mb-4" />
          <p className="font-playfair text-xl text-gray-300 mb-2">No orders yet</p>
          <Link href="/shop" className="btn-primary mt-4 inline-block">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order._id} href={`/account/orders/${order._id}`}
              className="bg-white rounded-2xl p-5 shadow-sm block hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-poppins text-xs text-gray-400">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="font-poppins text-xs text-gray-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <span className={`font-poppins text-xs font-medium px-3 py-1 rounded-full capitalize ${STATUS_COLORS[order.orderStatus] || "bg-gray-50 text-gray-500"}`}>
                  {order.orderStatus.replace(/_/g, " ")}
                </span>
              </div>
              <div className="flex gap-2 mb-3">
                {order.items.slice(0, 3).map((item, i) => (
                  <div key={i} className="w-12 h-14 rounded-lg overflow-hidden bg-gray-50">
                    <img src={item.product?.images?.[0] || "/images/placeholder.jpg"} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="w-12 h-14 rounded-lg bg-gray-50 flex items-center justify-center font-poppins text-xs text-gray-400">
                    +{order.items.length - 3}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="font-poppins text-xs text-gray-400">{order.items.length} item{order.items.length > 1 ? "s" : ""}</p>
                <p className="font-poppins text-sm font-semibold text-charcoal">{formatPrice(order.total)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
