"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { productAPI } from "@/lib/api";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore, useWishlistStore } from "@/lib/store";
import { useBuyNowStore } from "@/lib/store";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { FiHeart, FiShoppingBag, FiTruck, FiRefreshCw, FiShield } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import StarRating from "@/components/ui/StarRating";
import ProductCard from "@/components/ui/ProductCard";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import toast from "react-hot-toast";
import Link from "next/link";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import ReviewSection from "@/components/ui/ReviewSection";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "care" | "delivery">("desc");
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isWishlisted } = useWishlistStore();
  const setBuyNow = useBuyNowStore((s) => s.set);
  const requireAuth = useRequireAuth();

  useEffect(() => {
    productAPI.getOne(slug)
      .then((res) => {
        setProduct(res.data.product);
        setSelectedColor(res.data.product.colors[0] || "");
        setSelectedSize(res.data.product.sizes[0] || "");
      })
      .catch(() => {
        const mock = MOCK_PRODUCTS.find((p) => p.slug === slug) || MOCK_PRODUCTS[0];
        setProduct(mock);
        setSelectedColor(mock.colors[0]);
        setSelectedSize(mock.sizes[0]);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) { toast.error("Please select a size"); return; }
    requireAuth(() => {
      addItem(product, quantity, selectedSize, selectedColor);
      toast.success("Added to cart!");
    });
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (!selectedSize) { toast.error("Please select a size"); return; }
    requireAuth(() => {
      setBuyNow({ product, quantity, size: selectedSize, color: selectedColor });
      router.push("/checkout?mode=buynow");
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  if (loading) return <PageLoader />;
  if (!product) return <div className="text-center py-20 font-poppins">Product not found</div>;

  const discountPct = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const whatsappMsg = encodeURIComponent(`Hi! I'm interested in ${product.name} (${formatPrice(product.price)}). Can you help me?`);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="font-poppins text-xs text-gray-400 mb-6 flex gap-2">
        <Link href="/" className="hover:text-sage">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-sage">Shop</Link>
        <span>/</span>
        <span className="text-charcoal">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div className="flex gap-3">
          {/* Thumbnails */}
          <div className="flex flex-col gap-2 w-16 flex-shrink-0">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === i ? "border-sage" : "border-transparent"}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Main image with zoom */}
          <div
            className="flex-1 relative rounded-2xl overflow-hidden bg-gray-50 cursor-zoom-in aspect-[3/4]"
            onMouseEnter={() => setZoomed(true)}
            onMouseLeave={() => setZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
              style={zoomed ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`, transform: "scale(2)" } : {}}
            />
            {discountPct > 0 && (
              <span className="absolute top-3 left-3 badge-discount">{discountPct}% OFF</span>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="font-poppins text-xs text-gray-400 uppercase tracking-widest mb-1 capitalize">{product.category}</p>
            <h1 className="font-playfair text-2xl md:text-3xl text-charcoal leading-snug">{product.name}</h1>
          </div>

          <div className="flex items-center gap-3">
            <StarRating rating={product.ratings} showCount count={product.numReviews} />
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="font-playfair text-3xl text-charcoal font-semibold">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="font-poppins text-base text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                <span className="badge-discount">{discountPct}% off</span>
              </>
            )}
          </div>
          <p className="font-poppins text-xs text-green-600">Inclusive of all taxes</p>

          {/* Color */}
          {product.colors.length > 0 && (
            <div>
              <p className="font-poppins text-sm font-medium text-charcoal mb-2">
                Color: <span className="font-normal text-gray-500">{selectedColor}</span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-poppins border transition-all ${selectedColor === c ? "border-sage bg-sage text-white" : "border-gray-200 text-gray-600 hover:border-sage"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-poppins text-sm font-medium text-charcoal">
                Size: <span className="font-normal text-gray-500">{selectedSize}</span>
              </p>
              <Link href="/size-guide" className="font-poppins text-xs text-sage underline">Size Guide</Link>
            </div>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`w-12 h-10 rounded-lg text-sm font-poppins border transition-all ${selectedSize === s ? "border-sage bg-sage text-white" : "border-gray-200 text-gray-600 hover:border-sage"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-3">
            <p className="font-poppins text-sm font-medium text-charcoal">Qty:</p>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-charcoal hover:bg-gray-50 font-poppins">−</button>
              <span className="px-4 py-2 font-poppins text-sm border-x border-gray-200">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 text-charcoal hover:bg-gray-50 font-poppins">+</button>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex gap-3">
            <button onClick={handleAddToCart} className="flex-1 btn-outline flex items-center justify-center gap-2">
              <FiShoppingBag size={16} /> Add to Cart
            </button>
            <button onClick={handleBuyNow} className="flex-1 btn-primary flex items-center justify-center gap-2">
              Buy Now
            </button>
            <button
              onClick={() => { toggleItem(product); toast.success(isWishlisted(product._id) ? "Removed from wishlist" : "Added to wishlist"); }}
              className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors ${isWishlisted(product._id) ? "bg-red-50 border-red-200 text-red-500" : "border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400"}`}
              aria-label="Wishlist"
            >
              <FiHeart size={18} fill={isWishlisted(product._id) ? "currentColor" : "none"} />
            </button>
          </div>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999"}?text=${whatsappMsg}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 border border-green-500 text-green-600 rounded-full py-2.5 font-poppins text-sm hover:bg-green-50 transition-colors"
          >
            <FaWhatsapp size={18} /> Ask on WhatsApp
          </a>

          {/* Info pills */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { icon: FiTruck, text: product.estimatedDelivery },
              { icon: FiRefreshCw, text: "7-day returns" },
              { icon: FiShield, text: product.codAvailable ? "COD available" : "Prepaid only" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex flex-col items-center gap-1 bg-ivory rounded-xl p-3 text-center">
                <Icon size={16} className="text-sage" />
                <span className="font-poppins text-[10px] text-gray-500">{text}</span>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex gap-4 border-b border-gray-100 mb-4">
              {(["desc", "care", "delivery"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`font-poppins text-sm pb-2 border-b-2 transition-colors ${activeTab === tab ? "border-sage text-sage" : "border-transparent text-gray-400"}`}
                >
                  {tab === "desc" ? "Description" : tab === "care" ? "Wash Care" : "Delivery"}
                </button>
              ))}
            </div>
            <div className="font-poppins text-sm text-gray-600 leading-relaxed">
              {activeTab === "desc" && <p>{product.description}</p>}
              {activeTab === "care" && <p>{product.washCare}</p>}
              {activeTab === "delivery" && (
                <ul className="space-y-1">
                  <li>• Estimated delivery: {product.estimatedDelivery}</li>
                  <li>• Free shipping on orders above ₹999</li>
                  <li>• {product.codAvailable ? "Cash on Delivery available" : "Prepaid orders only"}</li>
                  <li>• Easy 7-day returns</li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      <div className="mt-16">
        <h2 className="section-title mb-8">You May Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {MOCK_PRODUCTS.slice(0, 4).map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </div>

      {/* Reviews */}
      <ReviewSection productId={product._id} />
    </div>
  );
}
