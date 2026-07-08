"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", subject: "", message: "" });
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <p className="section-subtitle">Get in Touch</p>
        <h1 className="section-title mt-1">Contact Us</h1>
        <p className="font-poppins text-sm text-gray-500 mt-3">We'd love to hear from you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { icon: FiMail, title: "Email Us", value: "support@saviraattires.com", href: "mailto:support@saviraattires.com" },
          { icon: FiPhone, title: "Call Us", value: "+91 99999 99999", href: "tel:+919999999999" },
          { icon: FiMapPin, title: "Location", value: "Tamil Nadu, India", href: "#" },
        ].map(({ icon: Icon, title, value, href }) => (
          <a key={title} href={href}
            className="bg-white rounded-2xl p-6 shadow-sm text-center hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 bg-sage/10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-sage/20 transition-colors">
              <Icon size={20} className="text-sage" />
            </div>
            <p className="font-playfair text-sm text-charcoal mb-1">{title}</p>
            <p className="font-poppins text-xs text-gray-500">{value}</p>
          </a>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="font-playfair text-xl text-charcoal mb-6">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Your Name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Full name" />
              </div>
              <div>
                <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Email</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="your@email.com" />
              </div>
            </div>
            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Subject</label>
              <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input-field" placeholder="How can we help?" />
            </div>
            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Message</label>
              <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} className="input-field resize-none" placeholder="Tell us more..." />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              <FiSend size={14} /> {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        <div className="space-y-5">
          <div className="bg-sage rounded-2xl p-8 text-white">
            <h3 className="font-playfair text-xl mb-3">WhatsApp Support</h3>
            <p className="font-poppins text-sm text-white/80 mb-5 leading-relaxed">
              Get instant help on WhatsApp. Our team is available Mon–Sat, 10am–7pm IST.
            </p>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999"}?text=${encodeURIComponent("Hi! I need help with my order on SAVIRA ATTIRES.")}`}
              target="_blank" rel="noreferrer"
              className="flex items-center gap-2 bg-white text-sage px-5 py-3 rounded-full font-poppins text-sm font-medium hover:bg-ivory transition-colors w-fit"
            >
              <FaWhatsapp size={18} /> Chat on WhatsApp
            </a>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-playfair text-base text-charcoal mb-3">Business Hours</h3>
            <div className="space-y-2 font-poppins text-sm">
              {[
                { day: "Monday – Friday", time: "10:00 AM – 7:00 PM" },
                { day: "Saturday", time: "10:00 AM – 5:00 PM" },
                { day: "Sunday", time: "Closed" },
              ].map(({ day, time }) => (
                <div key={day} className="flex justify-between">
                  <span className="text-gray-500">{day}</span>
                  <span className="text-charcoal font-medium">{time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
