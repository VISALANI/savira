"use client";
import Link from "next/link";
import { FiHeart, FiShoppingBag } from "react-icons/fi";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useWishlistStore, useCartStore } from "@/lib/store";
import { useRequireAuth } from "@/lib/useRequireAuth";
import toast from "react-hot-toast";
import { useState } from "react";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { toggleItem, isWishlisted } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const requireAuth = useRequireAuth();
  const wishlisted = isWishlisted(product._id);
  const [imgError, setImgError] = useState(false);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    requireAuth(() => {
      toggleItem(product);
      toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist");
    });
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    requireAuth(() => {
      addItem(product, 1, product.sizes[0] || "M", product.colors[0] || "");
      toast.success("Added to cart");
    });
  };

  const discountPct =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  // Use first valid image
  const imageUrl = !imgError && product.images?.[0]
    ? product.images[0]
    : "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=75";

  return (
    <Link href={`/product/${product.slug}`} className="card-product block group">
      {/* Image — always visible, no hover swap */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={() => setImgError(true)}
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNewArrival && (
            <span className="badge-new">New</span>
          )}
          {discountPct > 0 && (
            <span className="badge-discount">{discountPct}% off</span>
          )}
          {product.isBestSeller && (
            <span className="bg-gold text-white text-xs font-poppins font-medium px-2 py-1 rounded-full">
              Best Seller
            </span>
          )}
        </div>

        {/* Wishlist button — always visible on mobile, hover on desktop */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all
            md:opacity-0 md:group-hover:opacity-100
            ${wishlisted ? "bg-red-500 text-white" : "bg-white text-charcoal hover:bg-red-50 hover:text-red-500"}`}
          aria-label="Wishlist"
        >
          <FiHeart size={14} fill={wishlisted ? "currentColor" : "none"} />
        </button>

        {/* Quick add — slides up on hover */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleQuickAdd}
            className="w-full bg-sage text-white py-2.5 font-poppins text-xs tracking-wide flex items-center justify-center gap-2 hover:bg-sage-dark transition-colors"
          >
            <FiShoppingBag size={14} />
            Quick Add
          </button>
        </div>
      </div>

      {/* Product info */}
      <div className="p-3">
        <p className="font-poppins text-xs text-gray-400 mb-0.5 capitalize">
          {product.category.replace(/-/g, " ")}
        </p>
        <h3 className="font-poppins text-sm text-charcoal font-medium leading-snug line-clamp-2 mb-1.5">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-poppins text-sm font-semibold text-charcoal">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span className="font-poppins text-xs text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        {/* Size chips */}
        <div className="flex gap-1 mt-2 flex-wrap">
          {product.sizes.slice(0, 4).map((s) => (
            <span
              key={s}
              className="text-[10px] font-poppins text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
