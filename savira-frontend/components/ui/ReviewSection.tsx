"use client";
import { useState, useEffect } from "react";
import { reviewAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { FaStar } from "react-icons/fa";
import { FiStar } from "react-icons/fi";
import toast from "react-hot-toast";
import Link from "next/link";

interface Review {
  _id: string;
  user: { name: string };
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ReviewSection({ productId }: { productId: string }) {
  const { user, isAuthenticated } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Skip API call for mock/demo products
    if (productId.startsWith("mock-") || productId.startsWith("related-")) {
      setReviews([]);
      setLoading(false);
      return;
    }
    reviewAPI.getByProduct(productId)
      .then((res) => setReviews(res.data.reviews || []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [productId]);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) { toast.error("Please write a review"); return; }
    if (productId.startsWith("mock-")) {
      toast.error("Cannot review demo products");
      return;
    }
    setSubmitting(true);
    try {
      const res = await reviewAPI.create({ product: productId, rating, comment });
      setReviews((prev) => [res.data.review, ...prev]);
      setShowForm(false);
      setComment("");
      setRating(5);
      toast.success("Review submitted!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-playfair text-2xl text-charcoal">Customer Reviews</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <FaStar key={s} size={14} className={s <= Math.round(Number(avgRating)) ? "text-gold" : "text-gray-200"} />
                ))}
              </div>
              <span className="font-poppins text-sm text-gray-500">{avgRating} out of 5 ({reviews.length} reviews)</span>
            </div>
          )}
        </div>
        {isAuthenticated() ? (
          <button onClick={() => setShowForm(!showForm)} className="btn-outline text-sm">
            {showForm ? "Cancel" : "Write a Review"}
          </button>
        ) : (
          <Link href="/login" className="btn-outline text-sm">Login to Review</Link>
        )}
      </div>

      {/* Write review form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-ivory rounded-2xl p-5 mb-6 space-y-4">
          <div>
            <p className="font-poppins text-sm font-medium text-charcoal mb-2">Your Rating</p>
            <div className="flex gap-1">
              {[1,2,3,4,5].map((s) => (
                <button key={s} type="button"
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(s)}
                  className="text-2xl transition-transform hover:scale-110"
                >
                  {s <= (hoverRating || rating)
                    ? <FaStar className="text-gold" />
                    : <FiStar className="text-gray-300" />}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Your Review</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)}
              rows={4} className="input-field resize-none"
              placeholder="Share your experience with this product..." required />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary text-sm">
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="space-y-3">
          {[1,2].map((i) => <div key={i} className="bg-white rounded-2xl h-24 animate-pulse" />)}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-2xl">
          <FiStar size={32} className="text-gray-200 mx-auto mb-3" />
          <p className="font-poppins text-sm text-gray-400">No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r._id} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-sage/20 text-sage flex items-center justify-center font-poppins text-sm font-semibold">
                    {r.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-poppins text-sm font-medium text-charcoal">{r.user?.name}</p>
                    <p className="font-poppins text-[10px] text-gray-400">
                      {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((s) => (
                    <FaStar key={s} size={12} className={s <= r.rating ? "text-gold" : "text-gray-200"} />
                  ))}
                </div>
              </div>
              <p className="font-poppins text-sm text-gray-600 leading-relaxed">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
