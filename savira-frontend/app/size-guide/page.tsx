export default function SizeGuidePage() {
  const sizes = [
    { size: "XS", chest: "32", waist: "26", hip: "35", length: "44" },
    { size: "S",  chest: "34", waist: "28", hip: "37", length: "45" },
    { size: "M",  chest: "36", waist: "30", hip: "39", length: "46" },
    { size: "L",  chest: "38", waist: "32", hip: "41", length: "47" },
    { size: "XL", chest: "40", waist: "34", hip: "43", length: "48" },
    { size: "XXL",chest: "42", waist: "36", hip: "45", length: "49" },
    { size: "3XL",chest: "44", waist: "38", hip: "47", length: "50" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <p className="section-subtitle">Fit Guide</p>
        <h1 className="section-title mt-1">Size Guide</h1>
        <p className="font-poppins text-sm text-gray-500 mt-3">All measurements are in inches</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sage text-white">
              <tr>
                {["Size", "Chest", "Waist", "Hip", "Kurti Length"].map((h) => (
                  <th key={h} className="font-poppins text-xs font-medium px-5 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sizes.map((row, i) => (
                <tr key={row.size} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                  <td className="px-5 py-3 font-poppins text-sm font-semibold text-sage">{row.size}</td>
                  <td className="px-5 py-3 font-poppins text-sm text-gray-600">{row.chest}"</td>
                  <td className="px-5 py-3 font-poppins text-sm text-gray-600">{row.waist}"</td>
                  <td className="px-5 py-3 font-poppins text-sm text-gray-600">{row.hip}"</td>
                  <td className="px-5 py-3 font-poppins text-sm text-gray-600">{row.length}"</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-playfair text-base text-charcoal mb-3">How to Measure</h3>
          <ul className="space-y-2 font-poppins text-sm text-gray-600">
            <li><strong>Chest:</strong> Measure around the fullest part of your bust</li>
            <li><strong>Waist:</strong> Measure around your natural waistline</li>
            <li><strong>Hip:</strong> Measure around the fullest part of your hips</li>
            <li><strong>Length:</strong> Measure from shoulder to desired hem</li>
          </ul>
        </div>
        <div className="bg-ivory rounded-2xl p-6">
          <h3 className="font-playfair text-base text-charcoal mb-3">Fit Tips</h3>
          <ul className="space-y-2 font-poppins text-sm text-gray-600">
            <li>• If between sizes, size up for a relaxed fit</li>
            <li>• Our kurtis have 1–2 inch ease for comfort</li>
            <li>• Cotton fabric may shrink slightly after first wash</li>
            <li>• Check individual product pages for specific fit notes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
