"use client";
import StarRating from "@/components/ui/StarRating";

const reviews = [
  { name: "Priya Sharma", city: "Mumbai", rating: 5, text: "Absolutely love the quality! The fabric is so soft and the fit is perfect. Will definitely order again.", avatar: "PS" },
  { name: "Ananya Reddy", city: "Hyderabad", rating: 5, text: "The festive kurti I ordered was stunning. Got so many compliments at the wedding. SAVIRA never disappoints!", avatar: "AR" },
  { name: "Meera Patel", city: "Ahmedabad", rating: 4, text: "Beautiful designs and fast delivery. The packaging was also very premium. Highly recommend!", avatar: "MP" },
  { name: "Kavya Nair", city: "Bangalore", rating: 5, text: "The co-ord set is exactly as shown. Colors are vibrant and the stitching is excellent. Love it!", avatar: "KN" },
  { name: "Ritu Singh", city: "Delhi", rating: 5, text: "Finally found a brand that understands Indian women's fashion. The office wear collection is chef's kiss!", avatar: "RS" },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <p className="section-subtitle">Happy Customers</p>
        <h2 className="section-title mt-1">What They Say</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reviews.slice(0, 3).map((r) => (
          <div key={r.name} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <StarRating rating={r.rating} />
            <p className="font-poppins text-sm text-gray-600 leading-relaxed mt-3 mb-4 italic">
              &ldquo;{r.text}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-sage text-white flex items-center justify-center font-poppins text-xs font-semibold">
                {r.avatar}
              </div>
              <div>
                <p className="font-poppins text-sm font-medium text-charcoal">{r.name}</p>
                <p className="font-poppins text-xs text-gray-400">{r.city}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary bar */}
      <div className="mt-10 bg-sage rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-around gap-6 text-white text-center">
        {[
          { value: "10,000+", label: "Happy Customers" },
          { value: "4.8★", label: "Average Rating" },
          { value: "500+", label: "Products" },
          { value: "Pan India", label: "Delivery" },
        ].map((s) => (
          <div key={s.label}>
            <p className="font-playfair text-3xl font-bold">{s.value}</p>
            <p className="font-poppins text-xs tracking-widest uppercase mt-1 text-white/70">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
