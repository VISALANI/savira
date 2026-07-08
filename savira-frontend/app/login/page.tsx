"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import SaviraLogo from "@/components/ui/SaviraLogo";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState(""); // email or phone
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser, setToken } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.login({ identifier, password });
      setUser(res.data.user);
      setToken(res.data.token);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      router.push(res.data.user.isAdmin ? "/admin" : redirect);
    } catch (err: any) {
      const data = err.response?.data;
      if (data?.code === "UNVERIFIED") {
        toast.error("Please verify your email first");
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
      } else {
        toast.error(data?.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const isPhone = /^\d+$/.test(identifier);

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center"><SaviraLogo variant="dark" size="md" href="/" /></div>
          <h1 className="font-playfair text-2xl text-charcoal mt-2">Welcome Back</h1>
          <p className="font-poppins text-sm text-gray-400 mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">
                Email or Mobile Number
              </label>
              <div className="relative">
                {isPhone && identifier.length > 0 && (
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-poppins text-sm text-gray-400">+91</span>
                )}
                <input
                  type="text" required value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className={`input-field ${isPhone && identifier.length > 0 ? "pl-12" : ""}`}
                  placeholder="Email address or 10-digit mobile"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-poppins text-xs text-gray-500">Password</label>
                <Link href="/forgot-password" className="font-poppins text-xs text-sage hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"} required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10" placeholder="Your password"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="font-poppins text-sm text-center text-gray-400 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-sage font-medium hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
