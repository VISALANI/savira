"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";
import SaviraLogo from "@/components/ui/SaviraLogo";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

const INDIAN_PHONE = /^[6-9]\d{9}$/;

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const blur = (field: string) => setTouched((t) => ({ ...t, [field]: true }));

  const phoneError = touched.phone && form.phone.length > 0 && form.phone.length < 10
    ? "Enter all 10 digits"
    : touched.phone && form.phone.length === 10 && !INDIAN_PHONE.test(form.phone)
    ? "Must start with 6, 7, 8 or 9"
    : "";

  const pwdMatch = form.confirmPassword === "" || form.password === form.confirmPassword;
  const pwdStrong = form.password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!INDIAN_PHONE.test(form.phone)) { toast.error("Enter a valid 10-digit Indian mobile number"); return; }
    if (form.password !== form.confirmPassword) { toast.error("Passwords do not match"); return; }
    if (!pwdStrong) { toast.error("Password must be at least 6 characters"); return; }

    setLoading(true);
    try {
      await authAPI.register(form);
      toast.success("Account created! Check your email for the OTP.");
      router.push(`/verify-email?email=${encodeURIComponent(form.email)}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <SaviraLogo variant="dark" size="md" href="/" />
          </div>
          <h1 className="font-playfair text-2xl text-charcoal mt-2">Create Account</h1>
          <p className="font-poppins text-sm text-gray-400 mt-1">Join the SAVIRA family</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* Full Name */}
            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Full Name *</label>
              <input
                type="text" required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                onBlur={() => blur("name")}
                className="input-field" placeholder="Your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Email Address *</label>
              <input
                type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onBlur={() => blur("email")}
                className="input-field" placeholder="you@gmail.com"
                autoComplete="email"
              />
              <p className="font-poppins text-[10px] text-gray-400 mt-1">
                A 6-digit OTP will be sent to this email for verification
              </p>
            </div>

            {/* Mobile — single seamless input, +91 is just placeholder prefix */}
            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Mobile Number *</label>
              <div className={`flex items-center input-field p-0 overflow-hidden ${
                phoneError ? "border-red-300 focus-within:border-red-400 focus-within:ring-red-100" : ""
              }`}>
                <span className="font-poppins text-sm text-gray-400 pl-4 pr-1 pointer-events-none select-none">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setForm({ ...form, phone: val });
                  }}
                  onBlur={() => blur("phone")}
                  className="flex-1 py-3 pr-4 bg-transparent font-poppins text-sm text-charcoal focus:outline-none"
                  placeholder="10-digit mobile number"
                  autoComplete="tel-national"
                  inputMode="numeric"
                />
              </div>
              {phoneError && (
                <p className="font-poppins text-xs text-red-400 mt-1">{phoneError}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Password *</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"} required value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onBlur={() => blur("password")}
                  className="input-field pr-10" placeholder="Min. 6 characters"
                  autoComplete="new-password"
                />
                <button
                  type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {form.password.length > 0 && (
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 h-1 rounded-full bg-gray-100 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${
                      form.password.length >= 10 ? "w-full bg-green-500" :
                      form.password.length >= 6 ? "w-2/3 bg-green-400" : "w-1/3 bg-red-400"
                    }`} />
                  </div>
                  <span className={`font-poppins text-[10px] ${pwdStrong ? "text-green-500" : "text-red-400"}`}>
                    {form.password.length >= 10 ? "Strong" : pwdStrong ? "Good" : "Too short"}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Confirm Password *</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"} required value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  onBlur={() => blur("confirmPassword")}
                  className={`input-field pr-10 ${
                    touched.confirmPassword && form.confirmPassword && !pwdMatch
                      ? "border-red-300 focus:border-red-400"
                      : ""
                  }`}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                />
                <button
                  type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {touched.confirmPassword && form.confirmPassword && !pwdMatch && (
                <p className="font-poppins text-xs text-red-400 mt-1">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit" disabled={loading}
              className="btn-primary w-full py-3.5 mt-2"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="font-poppins text-sm text-center text-gray-400 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-sage font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
