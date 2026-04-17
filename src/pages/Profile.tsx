import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import StarRating from "@/components/StarRating";
import TrustScoreBadge from "@/components/TrustScoreBadge";
import ReviewCard from "@/components/ReviewCard";
import { supabase } from "@/integrations/supabase/client";
import type { ReviewCardData } from "@/components/ReviewCard";
import { Mail, Phone, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

interface ProfileView {
  user_id: string;
  name: string;
  role: string;
  phone: string | null;
  avatar_url: string | null;
  trust_score: number | null;
  average_rating: number | null;
  total_reviews: number | null;
  member_since: string | null;
  bio: string | null;
}

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState<ProfileView | null>(null);
  const [userReviews, setUserReviews] = useState<ReviewCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const { data: profileRow } = await supabase
        .from("profiles")
        .select("user_id, name, role, phone, avatar_url, trust_score, average_rating, total_reviews, member_since, bio")
        .eq("user_id", id)
        .single();

      setUser(profileRow ?? null);

      const { data: reviewRows } = await supabase
        .from("reviews")
        .select("id, reviewer_id, behavior, communication, cleanliness, payment_timeliness, maintenance, overall_rating, comment, created_at")
        .eq("reviewed_user_id", id)
        .order("created_at", { ascending: false });

      const reviewerIds = Array.from(new Set((reviewRows ?? []).map((row) => row.reviewer_id)));
      const { data: reviewerProfiles } = reviewerIds.length
        ? await supabase.from("profiles").select("user_id, name, role").in("user_id", reviewerIds)
        : { data: [] as { user_id: string; name: string; role: string }[] };

      const reviewerMap = new Map((reviewerProfiles ?? []).map((row) => [row.user_id, row]));

      setUserReviews(
        (reviewRows ?? []).map((row) => {
          const reviewer = reviewerMap.get(row.reviewer_id);
          return {
            id: row.id,
            reviewerName: reviewer?.name || "Unknown User",
            reviewerRole: reviewer?.role || "user",
            behavior: Number(row.behavior ?? 0),
            communication: Number(row.communication ?? 0),
            cleanliness: Number(row.cleanliness ?? 0),
            paymentTimeliness: Number(row.payment_timeliness ?? 0),
            maintenance: Number(row.maintenance ?? 0),
            overallRating: Number(row.overall_rating ?? 0),
            comment: row.comment || "",
            date: row.created_at || new Date().toISOString(),
          };
        })
      );

      setLoading(false);
    };

    void loadProfile();
  }, [id]);

  if (!loading && !user) {
    return <Layout><div className="container py-16 text-center text-muted-foreground">User not found.</div></Layout>;
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Profile Sidebar */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 text-center shadow-card">
              <img
                src={
                  user?.avatar_url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=F97316&color=fff`
                }
                alt={user?.name || "User"}
                className="mx-auto h-24 w-24 rounded-full object-cover"
              />
              <h1 className="mt-4 font-heading text-xl font-bold text-foreground">{user.name}</h1>
              <span className="mt-1 inline-block rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold capitalize text-primary">{user.role}</span>
              <div className="mt-4">
                <TrustScoreBadge score={Number(user.trust_score ?? 0)} size="lg" />
              </div>
              <div className="mt-3">
                <StarRating rating={Number(user.average_rating ?? 0)} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{Number(user.total_reviews ?? 0)} reviews</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-card space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" /> {user.user_id}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" /> {user.phone || "-"}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" /> Member since {user.member_since ? new Date(user.member_since).toLocaleDateString() : "-"}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-heading text-sm font-semibold text-foreground">About</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{user.bio || "No bio added yet."}</p>
            </div>
          </div>

          {/* Reviews */}
          <div className="lg:col-span-2">
            <h2 className="font-heading text-2xl font-bold text-foreground">Reviews ({userReviews.length})</h2>
            <div className="mt-6 space-y-4">
              {userReviews.length > 0 ? (
                userReviews.map((r) => <ReviewCard key={r.id} review={r} />)
              ) : (
                <p className="text-muted-foreground">{loading ? "Loading reviews..." : "No reviews yet."}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
