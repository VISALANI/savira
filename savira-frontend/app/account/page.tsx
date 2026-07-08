"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { FiPackage, FiHeart, FiMapPin, FiUser, FiLogOut, FiChevronRight } from "react-icons/fi";

export default function AccountPage() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) router.push("/login");
  }, []);

  if (!user) return null;

  const menuItems = [
    { icon: FiPackage, label: "My Orders", desc: "Track and manage your orders", href: "/account/orders" },
    { icon: FiHeart, label: "Wishlist", desc: "Your saved items", href: "/wishlist" },
    { icon: FiMapPin, label: "Saved Addresses", desc: "Manage delivery addresses", href: "/account/addresses" },
    { icon: FiUser, label: "Profile Settings", desc: "Update your personal info", href: "/account/profile" },
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Profile header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-sage text-white flex items-center justify-center font-playfair text-xl font-semibold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="font-playfair text-xl text-charcoal">{user.name}</h1>
          <p className="font-poppins text-sm text-gray-400">{user.email}</p>
          {user.phone && <p className="font-poppins text-xs text-gray-400">{user.phone}</p>}
        </div>
      </div>

      {/* Menu */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
        {menuItems.map(({ icon: Icon, label, desc, href }, i) => (
          <Link key={href} href={href}
            className={`flex items-center gap-4 p-5 hover:bg-ivory transition-colors ${i < menuItems.length - 1 ? "border-b border-gray-50" : ""}`}>
            <div className="w-10 h-10 rounded-xl bg-sage/10 flex items-center justify-center">
              <Icon size={18} className="text-sage" />
            </div>
            <div className="flex-1">
              <p className="font-poppins text-sm font-medium text-charcoal">{label}</p>
              <p className="font-poppins text-xs text-gray-400">{desc}</p>
            </div>
            <FiChevronRight size={16} className="text-gray-300" />
          </Link>
        ))}
      </div>

      <button onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 bg-white rounded-2xl p-4 shadow-sm text-red-400 hover:bg-red-50 transition-colors font-poppins text-sm">
        <FiLogOut size={16} /> Sign Out
      </button>
    </div>
  );
}
