export default function TermsPage() {
  const sections = [
    {
      title: "Acceptance of Terms",
      body: "By accessing and using SAVIRA ATTIRES website and services, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our services.",
    },
    {
      title: "Use of the Platform",
      body: "You must be at least 18 years old to make purchases. You agree to provide accurate information during registration and checkout. You are responsible for maintaining the confidentiality of your account credentials.",
    },
    {
      title: "Products & Pricing",
      body: "All prices are in Indian Rupees (INR) and inclusive of applicable taxes. We reserve the right to modify prices at any time. Product images are for representation purposes — slight color variations may occur due to screen settings.",
    },
    {
      title: "Orders & Payments",
      body: "Orders are confirmed only after successful payment or COD confirmation. We accept UPI, credit/debit cards, net banking via Razorpay, and Cash on Delivery. We reserve the right to cancel orders in case of pricing errors or stock unavailability.",
    },
    {
      title: "Shipping & Delivery",
      body: "We ship pan-India. Estimated delivery is 3–5 business days. Delivery timelines may vary due to location, weather, or logistics partner delays. Free shipping on orders above ₹999.",
    },
    {
      title: "Returns & Refunds",
      body: "We accept returns within 7 days of delivery for eligible items. Refunds are processed within 5–7 business days after we receive the returned item. Please refer to our Return Policy for complete details.",
    },
    {
      title: "Intellectual Property",
      body: "All content on this website including logos, images, text, and designs are the property of SAVIRA ATTIRES. Unauthorized use, reproduction, or distribution is strictly prohibited.",
    },
    {
      title: "Limitation of Liability",
      body: "SAVIRA ATTIRES shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services. Our liability is limited to the purchase price of the product.",
    },
    {
      title: "Governing Law",
      body: "These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Tamil Nadu, India.",
    },
    {
      title: "Contact",
      body: "For any questions regarding these terms, contact us at support@saviraattires.com or through our WhatsApp support.",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <p className="section-subtitle">Legal</p>
        <h1 className="section-title mt-1">Terms of Service</h1>
        <p className="font-poppins text-xs text-gray-400 mt-2">Last updated: May 2026</p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm space-y-7 font-poppins text-sm text-gray-600 leading-relaxed">
        <p className="text-gray-500 italic border-l-4 border-sage pl-4">
          Please read these Terms of Service carefully before using SAVIRA ATTIRES.
        </p>
        {sections.map(({ title, body }) => (
          <div key={title}>
            <h2 className="font-playfair text-lg text-charcoal mb-2">{title}</h2>
            <p>{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
