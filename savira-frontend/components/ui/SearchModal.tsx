"use client";
import { useState, useEffect, useRef } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { productAPI } from "@/lib/api";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await productAPI.search(query);
        setResults(res.data.products || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col" onClick={onClose}>
      <div className="bg-black/40 absolute inset-0" />
      <div
        className="relative bg-ivory w-full shadow-xl animate-slide-down"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-2xl mx-auto px-4 py-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <FiSearch size={20} className="text-sage flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search kurtis, co-ord sets, festive wear..."
              className="flex-1 bg-transparent font-poppins text-base text-charcoal placeholder-gray-400 focus:outline-none"
            />
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-charcoal">
              <FiX size={22} />
            </button>
          </form>

          {/* Results */}
          {loading && (
            <div className="py-6 text-center font-poppins text-sm text-gray-400">Searching...</div>
          )}
          {!loading && results.length > 0 && (
            <div className="mt-3 border-t border-gray-100 pt-3 max-h-72 overflow-y-auto space-y-2">
              {results.map((p) => (
                <Link
                  key={p._id}
                  href={`/product/${p.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-white transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-poppins text-sm text-charcoal truncate">{p.name}</p>
                    <p className="font-poppins text-xs text-sage font-medium">{formatPrice(p.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {!loading && query && results.length === 0 && (
            <div className="py-6 text-center font-poppins text-sm text-gray-400">
              No results for &quot;{query}&quot;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
