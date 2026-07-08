"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import {
  FiGrid, FiPackage, FiShoppingBag, FiUsers, FiTag, FiLogOut,
  FiMenu, FiX, FiBarChart2, FiLayers, FiStar, FiBell, FiSettings,
  FiChevronRight,
} from "react-icons/fi";
import SaviraLogo from "@/components/ui/SaviraLogo";

const navGroups = [
  {
    label: "Overview",
    items: [
      { href: "/admin", icon: FiGrid, label: "Dashboard" },
      { href: "/admin/analytics", icon: FiBarChart2, label: "Analytics" },
    ],
  },
  {
    label: "Catalogue",
    items: [
      { href: "/admin/products", icon: FiPackage, label: "Products" },
      { href: "/admin/categories", icon: FiLayers, label: "Categories" },
    ],
  },
  {
    label: "Sales",
    items: [
      { href: "/admin/orders", icon: FiShoppingBag, label: "Orders" },
      { href: "/admin/coupons", icon: FiTag, label: "Coupons" },
    ],
  },
  {
    label: "Community",
    items: [
      { href: "/admin/users", icon: FiUsers, label: "Users" },
      { href: "/admin/reviews", icon: FiStar, label: "Reviews" },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications] = useState(3);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!isAuthenticated() || !user?.isAdmin)) {
      router.push("/admin/login");
    }
  }, [mounted, user]);

  // Show loading skeleton until store hydrates
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-sage/30 border-t-sage rounded-full animate-spin" />
          <p className="font-poppins text-xs text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-sage/30 border-t-sage rounded-full animate-spin" />
      </div>
    );
  }

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1a1f2e] text-white flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:flex`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <SaviraLogo variant="gold" size="sm" href="/" />
          <button className="md:hidden text-gray-400" onClick={() => setSidebarOpen(false)}>
            <FiX size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="font-poppins text-[10px] text-gray-500 uppercase tracking-widest mb-2 px-3">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map(({ href, icon: Icon, label }) => {
                  const active = isActive(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-poppins text-sm transition-all ${
                        active
                          ? "bg-sage text-white shadow-sm"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon size={16} />
                      {label}
                      {active && <FiChevronRight size={12} className="ml-auto opacity-60" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-white/10 space-y-1">
          <Link href="/admin/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-poppins text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-all">
            <FiSettings size={16} /> Settings
          </Link>
          <button
            onClick={() => { logout(); router.push("/"); }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-poppins text-sm text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all w-full"
          >
            <FiLogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-5 py-3.5 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-charcoal" onClick={() => setSidebarOpen(true)}>
              <FiMenu size={22} />
            </button>
            <div className="hidden md:block">
              <p className="font-poppins text-xs text-gray-400">
                {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <Link href="/admin/notifications" className="relative w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
              <FiBell size={16} />
              {notifications > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-poppins">
                  {notifications}
                </span>
              )}
            </Link>

            {/* Admin avatar */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-sage text-white flex items-center justify-center font-poppins text-sm font-semibold">
                {user.name.charAt(0)}
              </div>
              <div className="hidden md:block">
                <p className="font-poppins text-xs font-medium text-charcoal leading-none">{user.name}</p>
                <p className="font-poppins text-[10px] text-gray-400 mt-0.5">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-5 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
