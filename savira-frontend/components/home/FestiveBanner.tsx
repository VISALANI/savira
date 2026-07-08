import Link from "next/link";

export default function FestiveBanner() {
  return (
    <section className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden h-72 md:h-96">

          {/* Festive background image */}
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1400&q=85"
            alt="Festive Collection"
            className="w-full h-full object-cover object-center scale-105"
          />

          {/* Deep festive gradient overlay — crimson to maroon */}
          <div className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, rgba(139,0,0,0.88) 0%, rgba(90,0,40,0.75) 50%, rgba(30,10,0,0.55) 100%)"
            }}
          />

          {/* Gold shimmer top strip */}
          <div className="absolute top-0 left-0 right-0 h-0.5"
            style={{ background: "linear-gradient(90deg, transparent, #C8A96B, #e8c97e, #C8A96B, transparent)" }}
          />
          {/* Gold shimmer bottom strip */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5"
            style={{ background: "linear-gradient(90deg, transparent, #C8A96B, #e8c97e, #C8A96B, transparent)" }}
          />

          {/* Decorative gold circles */}
          <div className="absolute top-6 right-12 w-24 h-24 rounded-full opacity-10 border-2 border-gold hidden md:block" />
          <div className="absolute top-10 right-16 w-14 h-14 rounded-full opacity-15 border border-gold hidden md:block" />
          <div className="absolute bottom-8 right-24 w-32 h-32 rounded-full opacity-10 border-2 border-gold hidden md:block" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center px-8 md:px-16">
            <div className="max-w-lg">
              {/* Decorative line */}
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-8 bg-gold" />
                <p className="font-poppins text-[10px] tracking-[0.5em] text-gold uppercase">
                  Limited Edition
                </p>
                <div className="h-px w-8 bg-gold" />
              </div>

              <h2 className="font-playfair text-4xl md:text-6xl text-white mb-1 leading-tight">
                Festive
              </h2>
              <h2 className="font-playfair text-4xl md:text-6xl italic leading-tight mb-4"
                style={{ color: "#e8c97e" }}>
                Collection
              </h2>

              <p className="font-poppins text-sm text-white/80 mb-6 leading-relaxed">
                Celebrate every occasion in timeless elegance.<br className="hidden md:block" />
                Curated exclusively for your special moments.
              </p>

              <div className="flex gap-3 flex-wrap">
                <Link
                  href="/shop?category=festive-wear"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-poppins text-sm font-medium tracking-wide transition-all duration-300 hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #C8A96B, #e8c97e)", color: "#2E2E2E" }}
                >
                  ✦ Explore Now
                </Link>
                <Link
                  href="/shop?category=coord-sets"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-poppins text-sm font-medium tracking-wide border border-white/40 text-white hover:bg-white/10 transition-all duration-300"
                >
                  Co-ord Sets
                </Link>
              </div>
            </div>
          </div>

          {/* Right side decorative motif text */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-2 opacity-20">
            <div className="text-gold font-playfair text-6xl select-none">✦</div>
            <div className="h-16 w-px bg-gold" />
            <div className="text-gold font-playfair text-3xl select-none">✦</div>
          </div>
        </div>
      </div>
    </section>
  );
}
