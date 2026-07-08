"use client";
import { useState } from "react";
import { FiShoppingBag, FiAlertCircle, FiUser, FiCreditCard, FiCheck, FiTrash2 } from "react-icons/fi";

interface Notification {
  id: string;
  type: "order" | "stock" | "user" | "payment";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "1", type: "order", title: "New Order Received", message: "Order #ABC123 placed by Priya Sharma for ₹1,299", time: "2 min ago", read: false },
  { id: "2", type: "stock", title: "Low Stock Alert", message: "Festive Silk Co-ord Set has only 3 units left", time: "15 min ago", read: false },
  { id: "3", type: "user", title: "New User Registration", message: "Ananya Reddy joined SAVIRA ATTIRES", time: "1 hour ago", read: false },
  { id: "4", type: "payment", title: "Payment Received", message: "₹2,499 received for Order #DEF456 via Razorpay", time: "2 hours ago", read: true },
  { id: "5", type: "order", title: "Order Delivered", message: "Order #GHI789 has been delivered to Meera Patel", time: "3 hours ago", read: true },
  { id: "6", type: "stock", title: "Low Stock Alert", message: "Block Print Cotton Kurti has only 5 units left", time: "5 hours ago", read: true },
  { id: "7", type: "order", title: "New Order Received", message: "Order #JKL012 placed by Kavya Nair for ₹1,999", time: "Yesterday", read: true },
  { id: "8", type: "payment", title: "COD Order Placed", message: "COD order #MNO345 placed for ₹899", time: "Yesterday", read: true },
];

const TYPE_CONFIG = {
  order: { icon: FiShoppingBag, color: "bg-blue-50 text-blue-500" },
  stock: { icon: FiAlertCircle, color: "bg-red-50 text-red-500" },
  user: { icon: FiUser, color: "bg-green-50 text-green-500" },
  payment: { icon: FiCreditCard, color: "bg-purple-50 text-purple-500" },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const deleteNotif = (id: string) => setNotifications((prev) => prev.filter((n) => n.id !== id));
  const clearAll = () => setNotifications([]);

  const filtered = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-playfair text-2xl text-charcoal">Notifications</h1>
          <p className="font-poppins text-xs text-gray-400 mt-0.5">{unreadCount} unread</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="btn-outline text-sm flex items-center gap-2">
              <FiCheck size={14} /> Mark all read
            </button>
          )}
          <button onClick={clearAll} className="font-poppins text-xs text-red-400 hover:text-red-500 px-3 py-2">
            Clear all
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {(["all", "unread"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`font-poppins text-xs px-4 py-2 rounded-full capitalize transition-colors ${filter === f ? "bg-sage text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
            {f} {f === "unread" && unreadCount > 0 && `(${unreadCount})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <p className="font-poppins text-sm text-gray-400">No notifications</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((notif) => {
            const { icon: Icon, color } = TYPE_CONFIG[notif.type];
            return (
              <div key={notif.id}
                className={`bg-white rounded-2xl p-4 shadow-sm flex items-start gap-4 transition-all ${!notif.read ? "border-l-4 border-sage" : ""}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0" onClick={() => markRead(notif.id)}>
                  <div className="flex items-start justify-between gap-2">
                    <p className={`font-poppins text-sm ${!notif.read ? "font-semibold text-charcoal" : "font-medium text-gray-600"}`}>
                      {notif.title}
                    </p>
                    <span className="font-poppins text-[10px] text-gray-400 flex-shrink-0">{notif.time}</span>
                  </div>
                  <p className="font-poppins text-xs text-gray-500 mt-0.5">{notif.message}</p>
                </div>
                <button onClick={() => deleteNotif(notif.id)}
                  className="text-gray-200 hover:text-red-400 transition-colors flex-shrink-0">
                  <FiTrash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
