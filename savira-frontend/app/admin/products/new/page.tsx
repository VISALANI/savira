"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminAPI } from "@/lib/api";
import { CATEGORIES, SIZES } from "@/lib/utils";
import toast from "react-hot-toast";
import { FiUpload, FiX } from "react-icons/fi";
import Link from "next/link";

const FABRICS = ["Cotton", "Silk", "Rayon", "Georgette", "Linen", "Chiffon", "Chanderi"];

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const [form, setForm] = useState({
    name: "", description: "", price: "", originalPrice: "",
    category: "kurtis", fabric: "Cotton", stock: "",
    washCare: "Hand wash in cold water. Do not bleach. Dry in shade.",
    estimatedDelivery: "3-5 business days",
    codAvailable: true, isNewArrival: false, isBestSeller: false, isFeatured: false,
    sizes: [] as string[], colors: [] as string[], tags: "",
  });

  const toggleArr = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const images = imageUrls.filter((u) => u.trim());
    if (images.length === 0) { toast.error("Add at least one image URL"); return; }
    if (form.sizes.length === 0) { toast.error("Select at least one size"); return; }

    setLoading(true);
    try {
      await adminAPI.createProduct({
        ...form,
        price: Number(form.price),
        originalPrice: Number(form.originalPrice) || Number(form.price),
        stock: Number(form.stock),
        images,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      });
      toast.success("Product created!");
      router.push("/admin/products");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/products" className="font-poppins text-sm text-gray-400 hover:text-sage">Products</Link>
        <span className="text-gray-300">/</span>
        <h1 className="font-playfair text-2xl text-charcoal">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="font-playfair text-base text-charcoal">Basic Information</h2>
          <div>
            <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Product Name *</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="e.g. Floral Embroidered Anarkali Kurti" />
          </div>
          <div>
            <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Description *</label>
            <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="input-field resize-none" placeholder="Describe the product..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Category *</label>
              <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Fabric *</label>
              <select value={form.fabric} onChange={(e) => setForm({ ...form, fabric: e.target.value })} className="input-field">
                {FABRICS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="font-playfair text-base text-charcoal">Pricing & Inventory</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Selling Price (₹) *</label>
              <input required type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" placeholder="1299" />
            </div>
            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Original Price (₹)</label>
              <input type="number" min="0" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} className="input-field" placeholder="1799" />
            </div>
            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Stock *</label>
              <input required type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-field" placeholder="50" />
            </div>
          </div>
        </div>

        {/* Sizes & Colors */}
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="font-playfair text-base text-charcoal">Variants</h2>
          <div>
            <label className="font-poppins text-xs text-gray-500 mb-2 block">Sizes *</label>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <button key={s} type="button" onClick={() => setForm((f) => ({ ...f, sizes: toggleArr(f.sizes, s) }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-poppins border transition-colors ${form.sizes.includes(s) ? "bg-sage text-white border-sage" : "border-gray-200 text-gray-600"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Colors (comma separated)</label>
            <input value={form.colors.join(", ")} onChange={(e) => setForm({ ...form, colors: e.target.value.split(",").map((c) => c.trim()).filter(Boolean) })} className="input-field" placeholder="Sage Green, Ivory, Dusty Rose" />
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="font-playfair text-base text-charcoal">Product Images</h2>
          <p className="font-poppins text-xs text-gray-400">Add Cloudinary or direct image URLs</p>
          {imageUrls.map((url, i) => (
            <div key={i} className="flex gap-2">
              <input value={url} onChange={(e) => { const u = [...imageUrls]; u[i] = e.target.value; setImageUrls(u); }} className="input-field flex-1" placeholder="https://res.cloudinary.com/..." />
              {url && <img src={url} alt="" className="w-12 h-14 rounded-lg object-cover bg-gray-100" onError={(e) => (e.currentTarget.style.display = "none")} />}
              {imageUrls.length > 1 && (
                <button type="button" onClick={() => setImageUrls(imageUrls.filter((_, j) => j !== i))} className="text-gray-300 hover:text-red-400">
                  <FiX size={16} />
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => setImageUrls([...imageUrls, ""])} className="btn-outline text-sm py-2 flex items-center gap-2">
            <FiUpload size={14} /> Add Image URL
          </button>
        </div>

        {/* Additional */}
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="font-playfair text-base text-charcoal">Additional Details</h2>
          <div>
            <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Wash Care</label>
            <input value={form.washCare} onChange={(e) => setForm({ ...form, washCare: e.target.value })} className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Estimated Delivery</label>
              <input value={form.estimatedDelivery} onChange={(e) => setForm({ ...form, estimatedDelivery: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Tags (comma separated)</label>
              <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="input-field" placeholder="kurti, festive, cotton" />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            {[
              { key: "isNewArrival", label: "Mark as New" },
              { key: "isBestSeller", label: "Best Seller" },
              { key: "isFeatured", label: "Featured" },
              { key: "codAvailable", label: "COD Available" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form[key as keyof typeof form] as boolean}
                  onChange={(e) => setForm({ ...form, [key]: e.target.checked })} className="accent-sage w-4 h-4" />
                <span className="font-poppins text-sm text-gray-600">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary flex-1 py-3.5">
            {loading ? "Creating..." : "Create Product"}
          </button>
          <Link href="/admin/products" className="btn-outline px-8 py-3.5">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
