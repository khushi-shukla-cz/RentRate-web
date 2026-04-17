interface TrustScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

const TrustScoreBadge = ({ score, size = "md" }: TrustScoreBadgeProps) => {
  const sizeClasses = {
    sm: "h-10 w-10 text-sm",
    md: "h-14 w-14 text-lg",
    lg: "h-20 w-20 text-2xl",
  };

  const getColor = (s: number) => {
    if (s >= 8) return "bg-trust text-accent-foreground";
    if (s >= 6) return "bg-star text-accent-foreground";
    return "bg-destructive text-destructive-foreground";
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`flex items-center justify-center rounded-full font-heading font-bold ${sizeClasses[size]} ${getColor(score)}`}>
        {score.toFixed(1)}
      </div>
      <span className="text-xs font-medium text-muted-foreground">Trust Score</span>
    </div>
  );
};

export default TrustScoreBadge;
