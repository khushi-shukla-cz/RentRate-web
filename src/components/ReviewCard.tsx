import StarRating from "./StarRating";

export interface ReviewCardData {
  id: string;
  reviewerName: string;
  reviewerRole: string;
  behavior: number;
  communication: number;
  cleanliness: number;
  paymentTimeliness: number;
  maintenance: number;
  overallRating: number;
  comment: string;
  date: string;
}

const ReviewCard = ({ review }: { review: ReviewCardData }) => (
  <div className="rounded-lg border border-border bg-background p-5 shadow-card">
    <div className="flex items-start justify-between">
      <div>
        <h4 className="font-heading text-sm font-semibold text-foreground">{review.reviewerName}</h4>
        <span className="text-xs capitalize text-muted-foreground">{review.reviewerRole}</span>
      </div>
      <span className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
    </div>
    <div className="mt-3">
      <StarRating rating={review.overallRating} size={14} />
    </div>
    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
      {[
        { label: "Behavior", value: review.behavior },
        { label: "Communication", value: review.communication },
        { label: "Cleanliness", value: review.cleanliness },
        { label: "Timeliness", value: review.paymentTimeliness },
        { label: "Maintenance", value: review.maintenance },
      ].map((item) => (
        <div key={item.label} className="flex items-center justify-between rounded-md bg-muted px-2 py-1">
          <span className="text-xs text-muted-foreground">{item.label}</span>
          <span className="text-xs font-semibold text-foreground">{item.value}/5</span>
        </div>
      ))}
    </div>
  </div>
);

export default ReviewCard;
