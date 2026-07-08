"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("You're subscribed! Welcome to SAVIRA family 🌸");
    setEmail("");
    setLoading(false);
  };

  return (
    <section className="py-16 bg-ivory">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <p className="section-subtitle">Stay Connected</p>
        <h2 className="section-title mt-1 mb-3">Join the SAVIRA Family</h2>
        <p className="font-poppins text-sm text-gray-500 mb-8">
          Get exclusive offers, new arrivals, and style inspiration delivered to your inbox.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="input-field flex-1"
          />
          <button type="submit" disabled={loading} className="btn-primary whitespace-nowrap">
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
        <p className="font-poppins text-xs text-gray-400 mt-3">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
