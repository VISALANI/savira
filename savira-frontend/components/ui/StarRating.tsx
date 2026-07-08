import { FiStar } from "react-icons/fi";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

interface Props {
  rating: number;
  size?: number;
  showCount?: boolean;
  count?: number;
}

export default function StarRating({ rating, size = 14, showCount, count }: Props) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          if (rating >= star) return <FaStar key={star} size={size} className="text-gold" />;
          if (rating >= star - 0.5) return <FaStarHalfAlt key={star} size={size} className="text-gold" />;
          return <FiStar key={star} size={size} className="text-gray-300" />;
        })}
      </div>
      {showCount && count !== undefined && (
        <span className="font-poppins text-xs text-gray-400">({count})</span>
      )}
    </div>
  );
}
