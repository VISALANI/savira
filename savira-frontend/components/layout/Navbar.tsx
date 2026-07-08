"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore, useAuthStore, useWishlistStore } from "@/lib/store";
import { FiShoppingBag, FiHeart, FiUser, FiSearch, FiMenu, FiX } from "react-icons/fi";
import SearchModal from "@/components/ui/SearchModal";
import SaviraLogo from "@/components/ui/SaviraLogo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Only read persisted store values after hydration
  const totalItems = useCartStore((s) => s.totalItems());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { user } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/shop", label: "Shop" },
    { href: "/shop?category=new-arrivals", label: "New Arrivals" },
    { href: "/shop?category=festive-wear", label: "Festive" },
    { href: "/shop?category=coord-sets", label: "Co-ord Sets" },
    { href: "/shop?category=kurtis", label: "Kurtis" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-ivory/95 backdrop-blur-md shadow-sm" : "bg-ivory"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button */}
            <button
              className="md:hidden text-charcoal p-1"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>

            {/* Logo */}
            <SaviraLogo variant="dark" size="sm" href="/" />

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-7">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-poppins text-sm text-charcoal hover:text-sage transition-colors tracking-wide"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-3 md:gap-4">
              <button
                onClick={() => setSearchOpen(true)}
                className="text-charcoal hover:text-sage transition-colors"
                aria-label="Search"
              >
                <FiSearch size={20} />
              </button>

              <Link
                href="/wishlist"
                className="relative text-charcoal hover:text-sage transition-colors hidden md:block"
                aria-label="Wishlist"
              >
                <FiHeart size={20} />
                {mounted && wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-poppins">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                href={user ? "/account" : "/login"}
                className="text-charcoal hover:text-sage transition-colors hidden md:block"
                aria-label="Account"
              >
                <FiUser size={20} />
              </Link>

              <Link
                href="/cart"
                className="relative text-charcoal hover:text-sage transition-colors"
                aria-label="Cart"
              >
                <FiShoppingBag size={20} />
                {mounted && totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-sage text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-poppins">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-ivory border-t border-gray-100 animate-slide-down">
            <nav className="flex flex-col px-6 py-4 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-poppins text-sm text-charcoal hover:text-sage transition-colors py-1 border-b border-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={user ? "/account" : "/login"}
                className="font-poppins text-sm text-charcoal hover:text-sage transition-colors py-1"
                onClick={() => setMenuOpen(false)}
              >
                {user ? "My Account" : "Login / Register"}
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
