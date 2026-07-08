"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import SaviraLogo from "@/components/ui/SaviraLogo";
import toast from "react-hot-toast";
import { FiMail } from "react-icons/fi";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(120); // 2 minute cooldown
  const [otpTimer, setOtpTimer] = useState(60); // 1 minute OTP expiry countdown
  const [resending, setResending] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) router.push("/register");
    inputs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  // OTP expiry countdown
  useEffect(() => {
    if (otpTimer <= 0) return;
    const t = setTimeout(() => setOtpTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [otpTimer]);

  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
    // Auto-submit when all filled
    if (val && i === 5 && next.every((d) => d)) {
      handleVerify(next.join(""));
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const next = pasted.split("");
      setOtp(next);
      inputs.current[5]?.focus();
      handleVerify(pasted);
    }
  };

  const handleVerify = async (code?: string) => {
    const otpCode = code || otp.join("");
    if (otpCode.length !== 6) { toast.error("Enter the 6-digit OTP"); return; }
    setLoading(true);
    try {
      const res = await authAPI.verifyEmail({ email, otp: otpCode });
      setUser(res.data.user);
      setToken(res.data.token);
      toast.success("Email verified! Welcome to SAVIRA 🌸");
      router.push("/account");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Verification failed");
      setOtp(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await authAPI.resendOTP({ email, type: "verify" });
      toast.success("New OTP sent! It expires in 1 minute.");
      setResendTimer(120);
      setOtpTimer(60); // reset 1-min OTP countdown
      setOtp(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
    } catch (err: any) {
      const data = err.response?.data;
      if (data?.secondsLeft) {
        setResendTimer(data.secondsLeft);
        toast.error(`Please wait ${Math.ceil(data.secondsLeft / 60)} minute(s) before resending`);
      } else {
        toast.error(data?.message || "Failed to resend OTP");
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center"><SaviraLogo variant="dark" size="md" href="/" /></div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
          <div className="w-14 h-14 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiMail size={24} className="text-sage" />
          </div>
          <h1 className="font-playfair text-2xl text-charcoal mb-2">Verify Your Email</h1>
          <p className="font-poppins text-sm text-gray-400 mb-1">
            We sent a 6-digit OTP to
          </p>
          <p className="font-poppins text-sm font-medium text-charcoal mb-2">{email}</p>

          {/* OTP expiry countdown */}
          <div className={`mb-5 py-2 px-4 rounded-xl font-poppins text-xs font-medium inline-flex items-center gap-2 ${
            otpTimer > 20 ? "bg-green-50 text-green-600" :
            otpTimer > 0 ? "bg-orange-50 text-orange-500" :
            "bg-red-50 text-red-500"
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${otpTimer > 20 ? "bg-green-500" : otpTimer > 0 ? "bg-orange-400" : "bg-red-400"}`} />
            {otpTimer > 0
              ? `OTP expires in ${otpTimer}s`
              : "OTP expired — please request a new one"}
          </div>

          {/* OTP inputs */}
          <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`w-11 h-12 text-center text-lg font-poppins font-semibold border-2 rounded-xl focus:outline-none transition-colors ${
                  digit ? "border-sage bg-sage/5 text-sage" : "border-gray-200 focus:border-sage"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => handleVerify()}
            disabled={loading || otp.some((d) => !d) || otpTimer === 0}
            className="btn-primary w-full py-3.5 mb-4 disabled:opacity-50"
          >
            {loading ? "Verifying..." : otpTimer === 0 ? "OTP Expired" : "Verify Email"}
          </button>

          <div className="font-poppins text-sm text-gray-400">
            Didn&apos;t receive the OTP?{" "}
            {resendTimer > 0 ? (
              <span className="text-gray-300">Resend in {resendTimer}s</span>
            ) : (
              <button onClick={handleResend} disabled={resending}
                className="text-sage font-medium hover:underline disabled:opacity-50">
                {resending ? "Sending..." : "Resend OTP"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
