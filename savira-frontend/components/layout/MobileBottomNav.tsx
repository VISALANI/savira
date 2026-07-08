"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiGrid, FiShoppingBag, FiHeart, FiUser } from "react-icons/fi";
import { useCartStore, useWishlistStore } from "@/lib/store";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const wishlistCount = useWishlistStore((s) => s.items.length);

  useEffect(() => { setMounted(true); }, []);

  const links = [
    { href: "/", icon: FiHome, label: "Home" },
    { href: "/shop", icon: FiGrid, label: "Shop" },
    { href: "/cart", icon: FiShoppingBag, label: "Cart", badge: totalItems },
    { href: "/wishlist", icon: FiHeart, label: "Wishlist", badge: wishlistCount },
    { href: "/account", icon: FiUser, label: "Account" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 pb-safe shadow-lg">
      <div className="flex items-center justify-around h-14">
        {links.map(({ href, icon: Icon, label, badge }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 relative px-3 py-1 ${
                active ? "text-sage" : "text-gray-400"
              }`}
            >
              <div className="relative">
                <Icon size={20} />
                {mounted && badge && badge > 0 ? (
                  <span className="absolute -top-1.5 -right-1.5 bg-sage text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-poppins">
                    {badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] font-poppins">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
