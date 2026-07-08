"use client";
import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/api";
import { Order } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

const STATUSES = ["processing", "shipped", "out_for_delivery", "delivered", "cancelled"];
const STATUS_COLORS: Record<string, string> = {
  processing: "bg-yellow-50 text-yellow-600",
  shipped: "bg-blue-50 text-blue-600",
  out_for_delivery: "bg-purple-50 text-purple-600",
  delivered: "bg-green-50 text-green-600",
  cancelled: "bg-red-50 text-red-500",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    adminAPI.getOrders({ status: filter === "all" ? "" : filter })
      .then((res) => setOrders(res.data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await adminAPI.updateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => o._id === id ? { ...o, orderStatus: status as Order["orderStatus"] } : o));
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <h1 className="font-playfair text-2xl text-charcoal mb-6">Orders</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {["all", ...STATUSES].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`font-poppins text-xs px-4 py-2 rounded-full capitalize transition-colors ${filter === s ? "bg-sage text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
            {s.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["Order", "Customer", "Items", "Total", "Payment", "Status", "Date", "Action"].map((h) => (
                  <th key={h} className="font-poppins text-xs text-gray-400 text-left px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={8} className="text-center py-8 font-poppins text-sm text-gray-400">Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-8 font-poppins text-sm text-gray-400">No orders found</td></tr>
              ) : orders.map((o) => (
                <tr key={o._id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-poppins text-xs text-charcoal">#{o._id.slice(-6).toUpperCase()}</td>
                  <td className="px-4 py-3 font-poppins text-xs text-gray-600">{(o as any).user?.name || "—"}</td>
                  <td className="px-4 py-3 font-poppins text-xs text-gray-500">{o.items.length} item{o.items.length > 1 ? "s" : ""}</td>
                  <td className="px-4 py-3 font-poppins text-sm font-medium text-charcoal">{formatPrice(o.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`font-poppins text-xs px-2 py-1 rounded-full ${o.paymentStatus === "paid" ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-500"}`}>
                      {o.paymentMethod === "cod" ? "COD" : o.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-poppins text-xs px-2 py-1 rounded-full capitalize ${STATUS_COLORS[o.orderStatus] || ""}`}>
                      {o.orderStatus.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-poppins text-xs text-gray-400">
                    {new Date(o.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={o.orderStatus}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                      disabled={updating === o._id}
                      className="font-poppins text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-sage bg-white"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
