"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";
import SaviraLogo from "@/components/ui/SaviraLogo";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff, FiCheck } from "react-icons/fi";

type Step = "email" | "otp" | "password";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [passwords, setPasswords] = useState({ password: "", confirm: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.forgotPassword({ email });
      toast.success("OTP sent to your email");
      setStep("otp");
      setResendTimer(60);
      setTimeout(() => inputs.current[0]?.focus(), 100);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
    if (val && i === 5 && next.every((d) => d)) setStep("password");
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.password !== passwords.confirm) { toast.error("Passwords don't match"); return; }
    if (passwords.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await authAPI.resetPassword({ email, otp: otp.join(""), password: passwords.password, confirmPassword: passwords.confirm });
      toast.success("Password reset successfully!");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Reset failed");
      if (err.response?.data?.message?.includes("OTP")) {
        setStep("otp");
        setOtp(["", "", "", "", "", ""]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await authAPI.resendOTP({ email, type: "reset" });
      toast.success("New OTP sent");
      setResendTimer(60);
      setOtp(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to resend");
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center"><SaviraLogo variant="dark" size="md" href="/" /></div>
          <h1 className="font-playfair text-2xl text-charcoal mt-2">Forgot Password</h1>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          {/* Step indicators */}
          <div className="flex items-center gap-2 mb-6">
            {(["email", "otp", "password"] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-poppins font-medium transition-colors ${
                  step === s ? "bg-sage text-white" :
                  (["email", "otp", "password"].indexOf(step) > i) ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"
                }`}>
                  {(["email", "otp", "password"].indexOf(step) > i) ? <FiCheck size={12} /> : i + 1}
                </div>
                {i < 2 && <div className={`flex-1 h-0.5 ${(["email", "otp", "password"].indexOf(step) > i) ? "bg-green-400" : "bg-gray-100"}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Email */}
          {step === "email" && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <p className="font-poppins text-sm text-gray-500 mb-4">
                Enter your registered email address and we&apos;ll send you an OTP.
              </p>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="input-field" placeholder="your@email.com" autoFocus />
              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === "otp" && (
            <div className="space-y-4">
              <p className="font-poppins text-sm text-gray-500">
                Enter the 6-digit OTP sent to <strong>{email}</strong>
              </p>
              <div className="flex gap-2 justify-center">
                {otp.map((digit, i) => (
                  <input key={i} ref={(el) => { inputs.current[i] = el; }}
                    type="text" inputMode="numeric" maxLength={1} value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Backspace" && !otp[i] && i > 0) inputs.current[i - 1]?.focus(); }}
                    className={`w-11 h-12 text-center text-lg font-poppins font-semibold border-2 rounded-xl focus:outline-none transition-colors ${digit ? "border-sage bg-sage/5 text-sage" : "border-gray-200 focus:border-sage"}`}
                  />
                ))}
              </div>
              <button onClick={() => otp.every((d) => d) && setStep("password")}
                disabled={!otp.every((d) => d)}
                className="btn-primary w-full py-3.5">
                Verify OTP
              </button>
              <div className="text-center font-poppins text-sm text-gray-400">
                {resendTimer > 0 ? (
                  <span className="text-gray-300">Resend in {resendTimer}s</span>
                ) : (
                  <button onClick={handleResend} className="text-sage hover:underline">Resend OTP</button>
                )}
              </div>
            </div>
          )}

          {/* Step 3: New password */}
          {step === "password" && (
            <form onSubmit={handleReset} className="space-y-4">
              <p className="font-poppins text-sm text-gray-500 mb-2">Set your new password</p>
              <div className="relative">
                <input type={showPwd ? "text" : "password"} required value={passwords.password}
                  onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
                  className="input-field pr-10" placeholder="New password (min. 6 chars)" autoFocus />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              <input type="password" required value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="input-field" placeholder="Confirm new password" />
              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
