"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import { Product } from "@/lib/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { productAPI } from "@/lib/api";

type SectionType = "new-arrivals" | "best-sellers" | "festive" | "featured";

interface Props {
  title: string;
  subtitle: string;
  type: SectionType;
  viewAllHref: string;
}

const fetchByType = (type: SectionType) => {
  switch (type) {
    case "new-arrivals":  return productAPI.getNewArrivals();
    case "best-sellers":  return productAPI.getBestSellers();
    case "festive":       return productAPI.getFestive();
    case "featured":      return productAPI.getFeatured();
  }
};

export default function ProductSection({ title, subtitle, type, viewAllHref }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchByType(type)
      .then((res) => setProducts(res.data.products || []))
      .finally(() => setLoading(false));
  }, [type]);

  return (
    <section className="py-14 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <p className="section-subtitle">{subtitle}</p>
        <h2 className="section-title mt-1">{title}</h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 font-poppins text-sm text-gray-400">
          No products available right now.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 8).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href={viewAllHref} className="btn-outline">
              View All
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
