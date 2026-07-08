"use client";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const FAQS = [
  { q: "How do I track my order?", a: "Once your order is shipped, you'll receive a tracking link via email. You can also track your order from My Account → Orders." },
  { q: "What payment methods do you accept?", a: "We accept UPI (Google Pay, PhonePe, Paytm), credit/debit cards, net banking, and Cash on Delivery (COD)." },
  { q: "Is Cash on Delivery available?", a: "Yes! COD is available on all orders across India. No extra charges for COD." },
  { q: "How long does delivery take?", a: "Standard delivery takes 3–5 business days. Express delivery (1–2 days) is available in select cities." },
  { q: "Can I exchange for a different size?", a: "Yes, size exchanges are accepted within 7 days of delivery. Contact us on WhatsApp to initiate an exchange." },
  { q: "Are the colors accurate in photos?", a: "We try our best to show accurate colors. However, slight variations may occur due to screen settings and lighting." },
  { q: "How do I care for my kurti?", a: "Most of our kurtis are hand-wash recommended in cold water. Specific care instructions are mentioned on each product page." },
  { q: "Do you ship outside India?", a: "Currently we ship only within India. International shipping is coming soon!" },
  { q: "How do I apply a coupon code?", a: "Enter your coupon code in the cart page before proceeding to checkout. The discount will be applied automatically." },
  { q: "Can I cancel my order?", a: "Orders can be cancelled within 2 hours of placing. After that, please wait for delivery and initiate a return." },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <p className="section-subtitle">Help Center</p>
        <h1 className="section-title mt-1">Frequently Asked Questions</h1>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-4 text-left"
            >
              <span className="font-poppins text-sm font-medium text-charcoal pr-4">{faq.q}</span>
              <FiChevronDown
                size={16}
                className={`text-sage flex-shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
              />
            </button>
            {open === i && (
              <div className="px-6 pb-4">
                <p className="font-poppins text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 bg-sage rounded-2xl p-6 text-center text-white">
        <p className="font-playfair text-lg mb-2">Still have questions?</p>
        <p className="font-poppins text-sm text-white/80 mb-4">Our team is happy to help</p>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999"}`}
          target="_blank" rel="noreferrer"
          className="inline-block bg-white text-sage px-6 py-2.5 rounded-full font-poppins text-sm font-medium hover:bg-ivory transition-colors"
        >
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}
