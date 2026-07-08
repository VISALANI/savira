"use client";
import { useWishlistStore, useCartStore } from "@/lib/store";
import ProductCard from "@/components/ui/ProductCard";
import Link from "next/link";
import { FiHeart } from "react-icons/fi";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);

  const moveAllToCart = () => {
    items.forEach((p) => addItem(p, 1, p.sizes[0] || "M", p.colors[0] || ""));
    toast.success("All items moved to cart!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-playfair text-2xl md:text-3xl text-charcoal">My Wishlist</h1>
          <p className="font-poppins text-sm text-gray-400 mt-1">{items.length} saved items</p>
        </div>
        {items.length > 0 && (
          <button onClick={moveAllToCart} className="btn-outline text-sm">
            Move All to Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <FiHeart size={48} className="text-gray-200 mx-auto mb-4" />
          <p className="font-playfair text-xl text-gray-300 mb-2">Your wishlist is empty</p>
          <p className="font-poppins text-sm text-gray-400 mb-6">Save items you love to buy them later</p>
          <Link href="/shop" className="btn-primary">Explore Collection</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {items.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}
