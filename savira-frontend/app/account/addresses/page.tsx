"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { authAPI } from "@/lib/api";
import { Address } from "@/lib/types";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2, FiMapPin, FiCheck } from "react-icons/fi";

const STATES = ["Andhra Pradesh","Assam","Bihar","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"];

const EMPTY: Omit<Address, "_id"> = { name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "", isDefault: false };

export default function AddressesPage() {
  const { user, setUser, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) router.push("/login");
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.addAddress(form);
      setUser({ ...user!, addresses: res.data.addresses });
      toast.success("Address saved");
      setShowForm(false);
      setForm(EMPTY);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await authAPI.deleteAddress(id);
      setUser({ ...user!, addresses: res.data.addresses });
      toast.success("Address removed");
    } catch {
      toast.error("Failed to remove address");
    }
  };

  const addresses = user?.addresses || [];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/account" className="font-poppins text-sm text-gray-400 hover:text-sage">Account</Link>
        <span className="text-gray-300">/</span>
        <h1 className="font-playfair text-2xl text-charcoal">Saved Addresses</h1>
      </div>

      {/* Address list */}
      <div className="space-y-3 mb-4">
        {addresses.length === 0 && !showForm && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <FiMapPin size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="font-poppins text-sm text-gray-400">No saved addresses yet</p>
          </div>
        )}
        {addresses.map((addr) => (
          <div key={addr._id} className="bg-white rounded-2xl p-5 shadow-sm flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              {addr.isDefault && (
                <span className="mt-0.5 w-5 h-5 rounded-full bg-sage flex items-center justify-center flex-shrink-0">
                  <FiCheck size={11} className="text-white" />
                </span>
              )}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-poppins text-sm font-medium text-charcoal">{addr.name}</p>
                  {addr.isDefault && <span className="font-poppins text-[10px] bg-sage/10 text-sage px-2 py-0.5 rounded-full">Default</span>}
                </div>
                <p className="font-poppins text-xs text-gray-500">{addr.phone}</p>
                <p className="font-poppins text-xs text-gray-500 mt-0.5">
                  {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}, {addr.city}, {addr.state} — {addr.pincode}
                </p>
              </div>
            </div>
            <button onClick={() => handleDelete(addr._id!)}
              className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 mt-1">
              <FiTrash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Add form */}
      {showForm ? (
        <form onSubmit={handleAdd} className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-playfair text-base text-charcoal mb-2">New Address</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Full Name *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Recipient name" />
            </div>
            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Phone *</label>
              <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} className="input-field" placeholder="10-digit mobile" />
            </div>
          </div>
          <div>
            <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Address Line 1 *</label>
            <input required value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} className="input-field" placeholder="House/Flat no., Street" />
          </div>
          <div>
            <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Address Line 2</label>
            <input value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} className="input-field" placeholder="Landmark, Area (optional)" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">City *</label>
              <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-field" placeholder="City" />
            </div>
            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">State *</label>
              <select required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="input-field">
                <option value="">Select</option>
                {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Pincode *</label>
              <input required value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })} className="input-field" placeholder="6-digit" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} className="accent-sage w-4 h-4" />
            <span className="font-poppins text-sm text-gray-600">Set as default address</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1 py-3">
              {loading ? "Saving..." : "Save Address"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setForm(EMPTY); }} className="btn-outline px-6 py-3">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-2xl py-4 font-poppins text-sm text-gray-400 hover:border-sage hover:text-sage transition-colors">
          <FiPlus size={16} /> Add New Address
        </button>
      )}
    </div>
  );
}
