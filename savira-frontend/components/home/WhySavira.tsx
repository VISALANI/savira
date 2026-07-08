const features = [
  {
    icon: "🌿",
    title: "Premium Fabrics",
    desc: "Handpicked cotton, silk, and blended fabrics for lasting comfort and elegance.",
  },
  {
    icon: "✂️",
    title: "Artisan Craftsmanship",
    desc: "Every piece is crafted with attention to detail by skilled artisans.",
  },
  {
    icon: "🚚",
    title: "Pan-India Delivery",
    desc: "Fast, reliable shipping across India with real-time order tracking.",
  },
  {
    icon: "💳",
    title: "Easy Returns",
    desc: "Hassle-free 7-day returns. Your satisfaction is our priority.",
  },
  {
    icon: "🔒",
    title: "Secure Payments",
    desc: "UPI, cards, netbanking & COD — all secured by Razorpay.",
  },
  {
    icon: "💬",
    title: "WhatsApp Support",
    desc: "Instant support on WhatsApp. We're always here to help.",
  },
];

export default function WhySavira() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="section-subtitle">Our Promise</p>
          <h2 className="section-title mt-1">Why SAVIRA ATTIRES</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col items-center text-center p-4 md:p-6 rounded-2xl hover:bg-ivory transition-colors duration-300">
              <span className="text-3xl mb-3">{f.icon}</span>
              <h3 className="font-playfair text-base md:text-lg text-charcoal mb-2">{f.title}</h3>
              <p className="font-poppins text-xs md:text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
