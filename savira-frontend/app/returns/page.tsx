export default function ReturnsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <p className="section-subtitle">Hassle-Free</p>
        <h1 className="section-title mt-1">Return Policy</h1>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm space-y-8 font-poppins text-sm text-gray-600 leading-relaxed">
        <div>
          <h2 className="font-playfair text-lg text-charcoal mb-3">7-Day Easy Returns</h2>
          <p>We want you to love every piece from SAVIRA ATTIRES. If you're not completely satisfied, you can return your order within <strong>7 days</strong> of delivery.</p>
        </div>

        <div>
          <h2 className="font-playfair text-lg text-charcoal mb-3">Eligible for Return</h2>
          <ul className="space-y-2">
            {["Item received is damaged or defective", "Wrong item delivered", "Size doesn't fit (exchange available)", "Item significantly different from description"].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-playfair text-lg text-charcoal mb-3">Not Eligible for Return</h2>
          <ul className="space-y-2">
            {["Items that have been worn, washed, or altered", "Items without original tags", "Sale or clearance items", "Returns requested after 7 days of delivery"].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">✗</span> {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-playfair text-lg text-charcoal mb-3">How to Initiate a Return</h2>
          <ol className="space-y-2 list-decimal list-inside">
            <li>Contact us on WhatsApp or email within 7 days of delivery</li>
            <li>Share your order ID and reason for return with photos</li>
            <li>Our team will review and approve within 24 hours</li>
            <li>Ship the item back to our address (we'll share it)</li>
            <li>Refund processed within 5–7 business days after we receive the item</li>
          </ol>
        </div>

        <div className="bg-ivory rounded-xl p-5">
          <h3 className="font-playfair text-base text-charcoal mb-2">Refund Method</h3>
          <p>Refunds are credited to the original payment method. For COD orders, refunds are processed via bank transfer or UPI.</p>
        </div>
      </div>
    </div>
  );
}
