"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { authAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { FiSave, FiEye, FiEyeOff } from "react-icons/fi";

export default function ProfilePage() {
  const { user, setUser, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", password: "", confirm: "" });

  useEffect(() => {
    if (!isAuthenticated()) { router.push("/login"); return; }
    if (user) setForm((f) => ({ ...f, name: user.name, phone: user.phone || "" }));
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirm) {
      toast.error("Passwords don't match"); return;
    }
    if (form.password && form.password.length < 6) {
      toast.error("Password must be at least 6 characters"); return;
    }
    setLoading(true);
    try {
      const payload: any = { name: form.name, phone: form.phone };
      if (form.password) payload.password = form.password;
      const res = await authAPI.updateProfile(payload);
      setUser({ ...user!, ...res.data.user });
      toast.success("Profile updated!");
      setForm((f) => ({ ...f, password: "", confirm: "" }));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/account" className="font-poppins text-sm text-gray-400 hover:text-sage">Account</Link>
        <span className="text-gray-300">/</span>
        <h1 className="font-playfair text-2xl text-charcoal">Profile Settings</h1>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-50">
          <div className="w-16 h-16 rounded-full bg-sage text-white flex items-center justify-center font-playfair text-2xl font-semibold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-poppins text-sm font-medium text-charcoal">{user?.name}</p>
            <p className="font-poppins text-xs text-gray-400">{user?.email}</p>
            <span className={`font-poppins text-[10px] px-2 py-0.5 rounded-full mt-1 inline-block ${user?.isVerified ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}`}>
              {user?.isVerified ? "✓ Verified" : "Pending verification"}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Full Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field" placeholder="Your full name" required />
          </div>
          <div>
            <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Email Address</label>
            <input value={user?.email || ""} disabled
              className="input-field bg-gray-50 text-gray-400 cursor-not-allowed" />
            <p className="font-poppins text-[10px] text-gray-400 mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Phone Number</label>
            <div className="flex items-center input-field p-0 overflow-hidden">
              <span className="font-poppins text-sm text-gray-400 pl-4 pr-1 pointer-events-none">+91</span>
              <input
                type="tel" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                className="flex-1 py-3 pr-4 bg-transparent font-poppins text-sm text-charcoal focus:outline-none"
                placeholder="10-digit mobile" inputMode="numeric"
              />
            </div>
          </div>

          <div className="border-t border-gray-50 pt-4">
            <p className="font-poppins text-xs text-gray-400 mb-3">Change Password (leave blank to keep current)</p>
            <div className="space-y-3">
              <div className="relative">
                <input type={showPwd ? "text" : "password"} value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field pr-10" placeholder="New password (min. 6 chars)" />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" tabIndex={-1}>
                  {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              <input type="password" value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                className="input-field" placeholder="Confirm new password" />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3.5">
            <FiSave size={16} />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
