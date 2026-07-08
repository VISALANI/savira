"use client";
import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/api";
import { Coupon } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: "", discountType: "percentage" as "percentage" | "flat",
    discountValue: "", minOrderValue: "", maxUses: "", expiresAt: "",
  });

  useEffect(() => {
    adminAPI.getCoupons()
      .then((res) => setCoupons(res.data.coupons || []))
      .catch(() => setCoupons([]))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminAPI.createCoupon({
        ...form,
        discountValue: Number(form.discountValue),
        minOrderValue: Number(form.minOrderValue),
        maxUses: Number(form.maxUses),
      });
      setCoupons([...coupons, res.data.coupon]);
      setShowForm(false);
      setForm({ code: "", discountType: "percentage", discountValue: "", minOrderValue: "", maxUses: "", expiresAt: "" });
      toast.success("Coupon created!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create coupon");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    try {
      await adminAPI.deleteCoupon(id);
      setCoupons(coupons.filter((c) => c._id !== id));
      toast.success("Coupon deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-playfair text-2xl text-charcoal">Coupons</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 text-sm">
          <FiPlus size={16} /> New Coupon
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="font-playfair text-base text-charcoal mb-4">Create Coupon</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Code *</label>
              <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="input-field" placeholder="SAVE20" />
            </div>
            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Discount Type</label>
              <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value as any })} className="input-field">
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat (₹)</option>
              </select>
            </div>
            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Discount Value *</label>
              <input required type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} className="input-field" placeholder={form.discountType === "percentage" ? "20" : "200"} />
            </div>
            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Min Order (₹)</label>
              <input type="number" value={form.minOrderValue} onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })} className="input-field" placeholder="500" />
            </div>
            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Max Uses</label>
              <input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} className="input-field" placeholder="100" />
            </div>
            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Expires At</label>
              <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="input-field" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" className="btn-primary text-sm">Create Coupon</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-outline text-sm">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {["Code", "Discount", "Min Order", "Used / Max", "Expires", "Status", ""].map((h) => (
                <th key={h} className="font-poppins text-xs text-gray-400 text-left px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8 font-poppins text-sm text-gray-400">Loading...</td></tr>
            ) : coupons.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8 font-poppins text-sm text-gray-400">No coupons yet</td></tr>
            ) : coupons.map((c) => (
              <tr key={c._id} className="hover:bg-gray-50/50">
                <td className="px-5 py-3 font-poppins text-sm font-semibold text-charcoal">{c.code}</td>
                <td className="px-5 py-3 font-poppins text-sm text-gray-600">
                  {c.discountType === "percentage" ? `${c.discountValue}%` : formatPrice(c.discountValue)}
                </td>
                <td className="px-5 py-3 font-poppins text-xs text-gray-500">{formatPrice(c.minOrderValue)}</td>
                <td className="px-5 py-3 font-poppins text-xs text-gray-500">{c.usedCount} / {c.maxUses}</td>
                <td className="px-5 py-3 font-poppins text-xs text-gray-500">
                  {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("en-IN") : "—"}
                </td>
                <td className="px-5 py-3">
                  <span className={`font-poppins text-xs px-2 py-1 rounded-full ${c.isActive ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-400"}`}>
                    {c.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <button onClick={() => handleDelete(c._id)} className="text-gray-300 hover:text-red-400 transition-colors">
                    <FiTrash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
