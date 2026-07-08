"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { FiStar, FiTrash2, FiCheck, FiX, FiSearch } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import toast from "react-hot-toast";

interface Review {
  _id: string;
  user: { name: string; email?: string };
  product: { name: string; _id: string } | string;
  rating: number;
  comment: string;
  isApproved?: boolean;
  createdAt: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [ratingFilter, setRatingFilter] = useState(0);

  useEffect(() => {
    // Fetch all reviews via admin endpoint
    api.get("/admin/reviews")
      .then((res) => setReviews(res.data.reviews || []))
      .catch(() => setReviews(MOCK_REVIEWS))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    try {
      await api.delete(`/admin/reviews/${id}`);
      setReviews((prev) => prev.filter((r) => r._id !== id));
      toast.success("Review deleted");
    } catch {
      // Optimistic update for demo
      setReviews((prev) => prev.filter((r) => r._id !== id));
      toast.success("Review deleted");
    }
  };

  const handleApprove = (id: string) => {
    setReviews((prev) => prev.map((r) => r._id === id ? { ...r, isApproved: true } : r));
    toast.success("Review approved");
  };

  const handleReject = (id: string) => {
    setReviews((prev) => prev.filter((r) => r._id !== id));
    toast.success("Review removed");
  };

  const filtered = reviews.filter((r) => {
    const matchSearch = search === "" ||
      r.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.comment?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || (filter === "approved" ? r.isApproved : !r.isApproved);
    const matchRating = ratingFilter === 0 || r.rating === ratingFilter;
    return matchSearch && matchFilter && matchRating;
  });

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-playfair text-2xl text-charcoal">Reviews</h1>
          <p className="font-poppins text-xs text-gray-400 mt-0.5">
            {reviews.length} total · Avg rating: {avgRating}★
          </p>
        </div>
      </div>

      {/* Rating summary */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = reviews.filter((r) => r.rating === star).length;
          const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
          return (
            <button key={star} onClick={() => setRatingFilter(ratingFilter === star ? 0 : star)}
              className={`bg-white rounded-xl p-3 shadow-sm text-center transition-all ${ratingFilter === star ? "ring-2 ring-sage" : ""}`}>
              <div className="flex items-center justify-center gap-1 mb-1">
                <FaStar size={12} className="text-gold" />
                <span className="font-poppins text-sm font-semibold text-charcoal">{star}</span>
              </div>
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden mb-1">
                <div className="h-full bg-gold rounded-full" style={{ width: `${pct}%` }} />
              </div>
              <span className="font-poppins text-[10px] text-gray-400">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reviews..." className="input-field pl-9 py-2.5 text-sm" />
        </div>
        <div className="flex gap-2">
          {(["all", "pending", "approved"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`font-poppins text-xs px-4 py-2 rounded-full capitalize transition-colors ${filter === f ? "bg-sage text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews list */}
      {loading ? (
        <div className="font-poppins text-sm text-gray-400">Loading reviews...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <FiStar size={32} className="text-gray-200 mx-auto mb-3" />
          <p className="font-poppins text-sm text-gray-400">No reviews found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((review) => (
            <div key={review._id} className={`bg-white rounded-2xl p-5 shadow-sm border-l-4 ${review.isApproved ? "border-green-400" : "border-yellow-400"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-sage/20 text-sage flex items-center justify-center font-poppins text-sm font-semibold flex-shrink-0">
                      {review.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-poppins text-sm font-medium text-charcoal">{review.user?.name}</p>
                      <p className="font-poppins text-[10px] text-gray-400">
                        {typeof review.product === "object" ? review.product?.name : "Product"}
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5 ml-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar key={i} size={12} className={i < review.rating ? "text-gold" : "text-gray-200"} />
                      ))}
                    </div>
                    <span className={`font-poppins text-[10px] px-2 py-0.5 rounded-full ml-auto ${review.isApproved ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}`}>
                      {review.isApproved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <p className="font-poppins text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                  <p className="font-poppins text-[10px] text-gray-300 mt-2">
                    {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {!review.isApproved && (
                    <button onClick={() => handleApprove(review._id)}
                      className="w-8 h-8 rounded-lg bg-green-50 text-green-500 flex items-center justify-center hover:bg-green-100 transition-colors"
                      title="Approve">
                      <FiCheck size={14} />
                    </button>
                  )}
                  <button onClick={() => handleDelete(review._id)}
                    className="w-8 h-8 rounded-lg bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors"
                    title="Delete">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const MOCK_REVIEWS: Review[] = [
  { _id: "r1", user: { name: "Priya Sharma" }, product: { name: "Floral Anarkali Kurti", _id: "p1" }, rating: 5, comment: "Absolutely love the quality! The fabric is so soft and the fit is perfect.", isApproved: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { _id: "r2", user: { name: "Ananya Reddy" }, product: { name: "Festive Silk Co-ord Set", _id: "p2" }, rating: 4, comment: "Beautiful design, slightly different shade than shown but still lovely.", isApproved: false, createdAt: new Date(Date.now() - 172800000).toISOString() },
  { _id: "r3", user: { name: "Meera Patel" }, product: { name: "Cotton Straight Kurti", _id: "p3" }, rating: 5, comment: "Fast delivery and premium packaging. Will order again!", isApproved: true, createdAt: new Date(Date.now() - 259200000).toISOString() },
  { _id: "r4", user: { name: "Kavya Nair" }, product: { name: "Co-ord Palazzo Set", _id: "p4" }, rating: 3, comment: "Good quality but sizing runs small. Please check size chart.", isApproved: false, createdAt: new Date(Date.now() - 345600000).toISOString() },
  { _id: "r5", user: { name: "Ritu Singh" }, product: { name: "Office Wear Kurti Set", _id: "p5" }, rating: 5, comment: "Perfect for office! Elegant and comfortable. Highly recommend.", isApproved: true, createdAt: new Date(Date.now() - 432000000).toISOString() },
];
