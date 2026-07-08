import Link from "next/link";
import { CATEGORIES } from "@/lib/utils";

export default function CategorySection() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <p className="section-subtitle">Explore</p>
        <h2 className="section-title mt-1">Shop by Category</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/shop?category=${cat.slug}`}
            className="group flex flex-col items-center gap-3"
          >
            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-300">
              <img
                src={`https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=70`}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div className="text-center">
              <p className="font-poppins text-sm font-medium text-charcoal group-hover:text-sage transition-colors">
                {cat.name}
              </p>
              <p className="font-poppins text-xs text-gray-400">{cat.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
