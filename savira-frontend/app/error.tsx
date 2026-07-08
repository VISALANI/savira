"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="font-playfair text-6xl font-bold text-sage/20 mb-4">Oops</p>
      <h2 className="font-playfair text-2xl text-charcoal mb-3">Something went wrong</h2>
      <p className="font-poppins text-sm text-gray-400 mb-8 max-w-sm">
        An unexpected error occurred. Please try again or contact support.
      </p>
      <div className="flex gap-3">
        <button onClick={reset} className="btn-primary">Try Again</button>
        <Link href="/" className="btn-outline">Go Home</Link>
      </div>
    </div>
  );
}
