import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: number;
  showValue?: boolean;
}

const StarRating = ({ rating, size = 16, showValue = true }: StarRatingProps) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.25;

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`${i <= fullStars ? "fill-star text-star" : i === fullStars + 1 && hasHalf ? "fill-star/50 text-star" : "text-border"}`}
            style={{ width: size, height: size }}
          />
        ))}
      </div>
      {showValue && <span className="text-sm font-medium text-muted-foreground">{rating.toFixed(1)}</span>}
    </div>
  );
};

export default StarRating;
