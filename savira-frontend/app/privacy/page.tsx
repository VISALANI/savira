export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <p className="section-subtitle">Legal</p>
        <h1 className="section-title mt-1">Privacy Policy</h1>
        <p className="font-poppins text-xs text-gray-400 mt-2">Last updated: May 2026</p>
      </div>
      <div className="bg-white rounded-2xl p-8 shadow-sm space-y-7 font-poppins text-sm text-gray-600 leading-relaxed">
        {[
          { title: "Information We Collect", body: "We collect information you provide during registration (name, email, phone, address), order details, payment information processed securely through Razorpay, and browsing data to improve your experience." },
          { title: "How We Use Your Information", body: "Your information is used to process orders, send order updates and OTP verification emails, provide customer support, improve our products and services, and send promotional communications (only with your consent)." },
          { title: "Data Security", body: "We implement industry-standard security measures including JWT authentication, bcrypt password hashing, HTTPS encryption, and secure payment processing through Razorpay. We never store your payment card details." },
          { title: "Sharing Your Information", body: "We do not sell your personal data. We share information only with trusted partners required to fulfill your order (shipping providers, payment processors) and as required by law." },
          { title: "Cookies", body: "We use essential cookies for authentication and session management. You can control cookie settings through your browser, though disabling them may affect site functionality." },
          { title: "Your Rights", body: "You have the right to access, correct, or delete your personal data. You can update your profile information in your account settings or contact us to request data deletion." },
          { title: "Contact Us", body: "For privacy-related queries, contact us at support@saviraattires.com or through our WhatsApp support." },
        ].map(({ title, body }) => (
          <div key={title}>
            <h2 className="font-playfair text-lg text-charcoal mb-2">{title}</h2>
            <p>{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
