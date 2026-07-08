"use client";
import Link from "next/link";
import { FiInstagram, FiFacebook, FiYoutube } from "react-icons/fi";
import { useState } from "react";
import SaviraLogo from "@/components/ui/SaviraLogo";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
    alert("Thank you for subscribing!");
  };

  return (
    <footer className="bg-charcoal text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <SaviraLogo variant="gold" size="sm" href="/" />
            </div>
            <p className="font-poppins text-sm text-gray-400 leading-relaxed mb-4">
              Grace Woven Beautifully. Premium Indian ethnic wear crafted for the modern woman.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gold transition-colors">
                <FiInstagram size={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gold transition-colors">
                <FiFacebook size={18} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gold transition-colors">
                <FiYoutube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-playfair text-base font-semibold mb-4 text-gold">Shop</h4>
            <ul className="space-y-2">
              {["New Arrivals", "Kurtis", "Co-ord Sets", "Festive Wear", "Office Wear", "Daily Wear"].map((item) => (
                <li key={item}>
                  <Link href={`/shop?category=${item.toLowerCase().replace(/ /g, "-")}`}
                    className="font-poppins text-sm text-gray-400 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-playfair text-base font-semibold mb-4 text-gold">Help</h4>
            <ul className="space-y-2">
              {[
                { label: "Track Order", href: "/account/orders" },
                { label: "Return Policy", href: "/returns" },
                { label: "Size Guide", href: "/size-guide" },
                { label: "Contact Us", href: "/contact" },
                { label: "FAQ", href: "/faq" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="font-poppins text-sm text-gray-400 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-playfair text-base font-semibold mb-4 text-gold">Stay in the Loop</h4>
            <p className="font-poppins text-sm text-gray-400 mb-4">
              Get exclusive offers, new arrivals & style inspiration.
            </p>
            <form onSubmit={handleNewsletter} className="flex flex-col gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm font-poppins text-white placeholder-gray-500 focus:outline-none focus:border-gold"
              />
              <button type="submit" className="btn-gold text-sm py-2.5">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="font-poppins text-xs text-gray-500">
            © {new Date().getFullYear()} SAVIRA ATTIRES. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="font-poppins text-xs text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="font-poppins text-xs text-gray-500 hover:text-white transition-colors">Terms of Service</Link>
          </div>
          <div className="flex items-center gap-2">
            <img src="/images/razorpay-badge.png" alt="Razorpay" className="h-5 opacity-60" onError={(e) => (e.currentTarget.style.display = "none")} />
            <span className="font-poppins text-xs text-gray-500">Secure Payments</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
