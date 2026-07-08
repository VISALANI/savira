"use client";
import { useAuthStore } from "./store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

/**
 * Returns a function you call before any protected action.
 * If not logged in, shows a toast and redirects to /login?redirect=<current path>
 */
export function useRequireAuth() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const requireAuth = (action?: () => void): boolean => {
    if (isAuthenticated()) {
      action?.();
      return true;
    }
    toast.error("Please login to continue");
    const redirect = typeof window !== "undefined" ? window.location.pathname : "/";
    router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
    return false;
  };

  return requireAuth;
}
