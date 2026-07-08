"use client";
import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/api";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchProducts = () => {
    adminAPI.getProducts({ search })
      .then((res) => setProducts(res.data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, [search]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await adminAPI.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-playfair text-2xl text-charcoal">Products</h1>
        <Link href="/admin/products/new" className="btn-primary flex items-center gap-2 text-sm">
          <FiPlus size={16} /> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="input-field pl-9 py-2.5 text-sm"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["Product", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                  <th key={h} className="font-poppins text-xs text-gray-400 text-left px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 font-poppins text-sm text-gray-400">Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 font-poppins text-sm text-gray-400">No products found</td></tr>
              ) : products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <p className="font-poppins text-sm text-charcoal line-clamp-1 max-w-[180px]">{p.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-poppins text-xs text-gray-500 capitalize">{p.category}</td>
                  <td className="px-5 py-3">
                    <p className="font-poppins text-sm text-charcoal">{formatPrice(p.price)}</p>
                    {p.originalPrice > p.price && (
                      <p className="font-poppins text-xs text-gray-400 line-through">{formatPrice(p.originalPrice)}</p>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`font-poppins text-xs px-2 py-1 rounded-full ${p.stock > 10 ? "bg-green-50 text-green-600" : p.stock > 0 ? "bg-yellow-50 text-yellow-600" : "bg-red-50 text-red-500"}`}>
                      {p.stock > 0 ? `${p.stock} left` : "Out of stock"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {p.isNewArrival && <span className="badge-new text-[10px]">New</span>}
                      {p.isBestSeller && <span className="bg-gold text-white text-[10px] font-poppins px-1.5 py-0.5 rounded-full">Best</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/products/${p._id}/edit`}
                        className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition-colors">
                        <FiEdit2 size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(p._id, p.name)}
                        disabled={deleting === p._id}
                        className="w-8 h-8 rounded-lg bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors disabled:opacity-50">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
