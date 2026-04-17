import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const categories = ["Behavior", "Communication", "Cleanliness", "Payment Timeliness", "Maintenance"];

const WriteReview = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const [reviewedUser, setReviewedUser] = useState<{ user_id: string; name: string } | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadReviewedUser = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      const { data } = await supabase.from("profiles").select("user_id, name").eq("user_id", userId).single();
      setReviewedUser(data ?? null);
      setLoading(false);
    };

    void loadReviewedUser();
  }, [userId]);

  const handleRate = (cat: string, val: number) => {
    setRatings((prev) => ({ ...prev, [cat]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !userId) {
      toast({ title: "Error", description: "Please sign in to submit a review.", variant: "destructive" });
      return;
    }

    const behavior = ratings["Behavior"] || 0;
    const communication = ratings["Communication"] || 0;
    const cleanliness = ratings["Cleanliness"] || 0;
    const paymentTimeliness = ratings["Payment Timeliness"] || 0;
    const maintenance = ratings["Maintenance"] || 0;
    const values = [behavior, communication, cleanliness, paymentTimeliness, maintenance];
    const overall = values.reduce((sum, value) => sum + value, 0) / values.length;

    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      reviewer_id: user.id,
      reviewed_user_id: userId,
      behavior,
      communication,
      cleanliness,
      payment_timeliness: paymentTimeliness,
      maintenance,
      overall_rating: Number(overall.toFixed(1)),
      comment,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setSubmitting(false);
      return;
    }

    toast({ title: "Review Submitted", description: "Your review has been recorded. Thank you!" });
    setRatings({});
    setComment("");
    setSubmitting(false);
  };

  if (!loading && !reviewedUser) return <Layout><div className="container py-16 text-center text-muted-foreground">User not found.</div></Layout>;

  return (
    <Layout>
      <div className="container max-w-2xl py-8">
        <h1 className="font-heading text-2xl font-bold text-foreground">Write a Review</h1>
        <p className="mt-1 text-sm text-muted-foreground">Share your experience with <strong>{reviewedUser?.name || "this user"}</strong></p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {categories.map((cat) => (
            <div key={cat}>
              <Label className="text-sm">{cat}</Label>
              <div className="mt-1 flex gap-1">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => handleRate(cat, val)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-7 w-7 ${val <= (ratings[cat] || 0) ? "fill-star text-star" : "text-border"}`}
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div>
            <Label htmlFor="comment">Written Feedback</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe your experience..."
              rows={4}
              className="mt-1"
            />
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>{submitting ? "Submitting..." : "Submit Review"}</Button>
        </form>
      </div>
    </Layout>
  );
};

export default WriteReview;
