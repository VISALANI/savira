"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import SaviraLogo from "@/components/ui/SaviraLogo";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff, FiShield } from "react-icons/fi";

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser, setToken, isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  // Already logged in as admin → go to dashboard
  useEffect(() => {
    if (isAuthenticated() && user?.isAdmin) router.replace("/admin");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.login({ identifier: form.email, password: form.password });
      if (!res.data.user.isAdmin) {
        toast.error("Access denied. Admin credentials required.");
        return;
      }
      setUser(res.data.user);
      setToken(res.data.token);
      toast.success(`Welcome, ${res.data.user.name}`);
      // Small delay to let Zustand persist before redirect
      setTimeout(() => router.push("/admin"), 100);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <SaviraLogo variant="gold" size="md" href="/" />
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-sage/20 flex items-center justify-center">
              <FiShield size={18} className="text-sage" />
            </div>
            <div>
              <h1 className="font-playfair text-lg text-white">Admin Login</h1>
              <p className="font-poppins text-xs text-gray-400">Restricted access</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-poppins text-xs text-gray-400 mb-1.5 block">
                Email Address
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 font-poppins text-sm text-white placeholder-gray-500 focus:outline-none focus:border-sage transition-colors"
                placeholder="admin@savira.com"
              />
            </div>

            <div>
              <label className="font-poppins text-xs text-gray-400 mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-10 font-poppins text-sm text-white placeholder-gray-500 focus:outline-none focus:border-sage transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sage text-white py-3.5 rounded-xl font-poppins text-sm font-medium hover:bg-sage-dark transition-colors disabled:opacity-60 mt-2"
            >
              {loading ? "Signing in..." : "Sign In to Dashboard"}
            </button>
          </form>
        </div>

        <p className="font-poppins text-xs text-gray-600 text-center mt-6">
          Not an admin?{" "}
          <a href="/" className="text-gray-400 hover:text-white transition-colors">
            Go to store
          </a>
        </p>
      </div>
    </div>
  );
}
