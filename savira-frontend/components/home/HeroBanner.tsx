"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1400&q=80",
    title: "Grace Woven",
    titleItalic: "Beautifully",
    subtitle: "Premium Indian ethnic wear for the modern woman",
    cta1: { label: "Shop Now", href: "/shop" },
    cta2: { label: "New Arrivals", href: "/shop?category=new-arrivals" },
  },
  {
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1400&q=80",
    title: "Festive",
    titleItalic: "Collection",
    subtitle: "Celebrate every moment in timeless elegance",
    cta1: { label: "Explore Festive", href: "/shop?category=festive-wear" },
    cta2: { label: "View All", href: "/shop" },
  },
  {
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1400&q=80",
    title: "Co-ord Sets",
    titleItalic: "Redefined",
    subtitle: "Effortlessly matched, endlessly stylish",
    cta1: { label: "Shop Co-ords", href: "/shop?category=coord-sets" },
    cta2: { label: "New Arrivals", href: "/shop?category=new-arrivals" },
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative h-[85vh] md:h-screen overflow-hidden">
      {/* Background images */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100" : "opacity-0"}`}
        >
          <img src={s.image} alt="Hero" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/60 via-charcoal/30 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="max-w-xl animate-fade-in" key={current}>
            <p className="font-poppins text-xs tracking-[0.4em] text-gold uppercase mb-4">
              Premium Indian Ethnic Wear
            </p>
            <h1 className="font-playfair text-5xl md:text-7xl text-white leading-tight mb-2">
              {slide.title}
            </h1>
            <h1 className="font-playfair text-5xl md:text-7xl text-gold italic leading-tight mb-6">
              {slide.titleItalic}
            </h1>
            <p className="font-poppins text-sm md:text-base text-white/80 mb-8 leading-relaxed">
              {slide.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={slide.cta1.href} className="btn-gold text-sm px-8 py-3.5">
                {slide.cta1.label}
              </Link>
              <Link
                href={slide.cta2.href}
                className="border border-white text-white px-8 py-3.5 rounded-full font-poppins text-sm tracking-wide hover:bg-white hover:text-charcoal transition-all duration-300"
              >
                {slide.cta2.label}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current ? "w-8 h-2 bg-gold" : "w-2 h-2 bg-white/50"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
