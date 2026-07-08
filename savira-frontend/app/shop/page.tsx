"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ui/ProductCard";
import { productAPI } from "@/lib/api";
import { Product } from "@/lib/types";
import { CATEGORIES } from "@/lib/utils";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { FiChevronDown, FiX } from "react-icons/fi";
import { PageLoader } from "@/components/ui/LoadingSpinner";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "popularity", label: "Most Popular" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export default function ShopPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    sort: "newest",
    search: searchParams.get("search") || "",
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productAPI.getAll({
        category: filters.category,
        sort: filters.sort,
        search: filters.search,
      });
      setProducts(res.data.products || []);
    } catch {
      setProducts(MOCK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const activeCategory = CATEGORIES.find((c) => c.slug === filters.category);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Page header */}
      <div className="mb-6">
        <h1 className="font-playfair text-2xl md:text-3xl text-charcoal">
          {activeCategory ? activeCategory.name : "All Products"}
        </h1>
        <p className="font-poppins text-sm text-gray-400 mt-1">
          {loading ? "Loading..." : `${products.length} products`}
        </p>
      </div>

      {/* Category chips + sort row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilters((f) => ({ ...f, category: "" }))}
            className={`font-poppins text-xs px-4 py-2 rounded-full border transition-all ${
              filters.category === ""
                ? "bg-sage text-white border-sage"
                : "border-gray-200 text-gray-500 hover:border-sage hover:text-sage"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              onClick={() => setFilters((f) => ({ ...f, category: c.slug }))}
              className={`font-poppins text-xs px-4 py-2 rounded-full border transition-all ${
                filters.category === c.slug
                  ? "bg-sage text-white border-sage"
                  : "border-gray-200 text-gray-500 hover:border-sage hover:text-sage"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div className="relative flex-shrink-0">
          <select
            value={filters.sort}
            onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
            className="input-field py-2 pl-3 pr-8 text-sm appearance-none cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <FiChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={14}
          />
        </div>
      </div>

      {/* Active search chip */}
      {filters.search && (
        <div className="flex items-center gap-2 mb-5">
          <span className="font-poppins text-xs text-gray-500">Results for:</span>
          <span className="flex items-center gap-1.5 bg-sage/10 text-sage text-xs font-poppins px-3 py-1.5 rounded-full">
            &ldquo;{filters.search}&rdquo;
            <button onClick={() => setFilters((f) => ({ ...f, search: "" }))}>
              <FiX size={12} />
            </button>
          </span>
        </div>
      )}

      {/* Products grid */}
      {loading ? (
        <PageLoader />
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-playfair text-2xl text-gray-300 mb-2">No products found</p>
          <p className="font-poppins text-sm text-gray-400 mb-4">Try a different category</p>
          <button
            onClick={() => setFilters({ category: "", sort: "newest", search: "" })}
            className="btn-outline text-sm"
          >
            View All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-5">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}
