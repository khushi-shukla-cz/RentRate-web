import { useParams, Link } from "react-router-dom";
import { MapPin, Bed, Bath, Maximize, ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import StarRating from "@/components/StarRating";
import TrustScoreBadge from "@/components/TrustScoreBadge";
import { properties, users, reviews } from "@/data/mockData";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";

interface PropertyDetailsView {
  id: string;
  title: string;
  images: string[];
  price: number;
  location: string;
  furnishing: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  amenities: string[];
  ownerId: string;
}

interface OwnerDetailsView {
  id: string;
  name: string;
  avatar: string;
  averageRating: number;
  trustScore: number;
  totalReviews: number;
  memberSince: string;
}

interface OwnerReviewView {
  id: string;
  comment: string;
  overallRating: number;
  date: string;
}

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<PropertyDetailsView | null>(null);
  const [owner, setOwner] = useState<OwnerDetailsView | null>(null);
  const [ownerReviews, setOwnerReviews] = useState<OwnerReviewView[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const loadProperty = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      setLoading(true);

      if (!isSupabaseConfigured) {
        const mockProperty = properties.find((p) => p.id === id);
        if (mockProperty) {
          setProperty({
            id: mockProperty.id,
            title: mockProperty.title,
            images: mockProperty.images,
            price: mockProperty.price,
            location: mockProperty.location,
            furnishing: mockProperty.furnishing,
            bedrooms: mockProperty.bedrooms,
            bathrooms: mockProperty.bathrooms,
            area: mockProperty.area,
            description: mockProperty.description,
            amenities: mockProperty.amenities,
            ownerId: mockProperty.ownerId,
          });

          const mockOwner = users.find((u) => u.id === mockProperty.ownerId);
          setOwner(
            mockOwner
              ? {
                  id: mockOwner.id,
                  name: mockOwner.name,
                  avatar: mockOwner.avatar,
                  averageRating: mockOwner.averageRating,
                  trustScore: mockOwner.trustScore,
                  totalReviews: mockOwner.totalReviews,
                  memberSince: mockOwner.memberSince,
                }
              : null
          );

          setOwnerReviews(
            reviews
              .filter((review) => review.reviewedUserId === mockProperty.ownerId)
              .slice(0, 2)
              .map((review) => ({
                id: review.id,
                comment: review.comment,
                overallRating: review.overallRating,
                date: review.date,
              }))
          );
        } else {
          setProperty(null);
          setOwner(null);
          setOwnerReviews([]);
        }

        setLoading(false);
        return;
      }

      const { data: propertyRow } = await supabase
        .from("properties")
        .select("id, title, image, images, price, location, furnishing, bedrooms, bathrooms, area, description, amenities, owner_id")
        .eq("id", id)
        .maybeSingle();

      if (propertyRow) {
        const imageList = (propertyRow.images && propertyRow.images.length > 0 ? propertyRow.images : [propertyRow.image]).filter(
          (img): img is string => Boolean(img)
        );

        const fallbackImage = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop";

        setProperty({
          id: propertyRow.id,
          title: propertyRow.title,
          images: imageList.length > 0 ? imageList : [fallbackImage],
          price: Number(propertyRow.price ?? 0),
          location: propertyRow.location,
          furnishing: propertyRow.furnishing || "Unfurnished",
          bedrooms: propertyRow.bedrooms ?? 0,
          bathrooms: propertyRow.bathrooms ?? 0,
          area: Number(propertyRow.area ?? 0),
          description: propertyRow.description || "",
          amenities: propertyRow.amenities ?? [],
          ownerId: propertyRow.owner_id,
        });

        const { data: ownerProfile } = await supabase
          .from("profiles")
          .select("user_id, name, avatar_url, average_rating, trust_score, total_reviews, member_since")
          .eq("user_id", propertyRow.owner_id)
          .maybeSingle();

        const { data: ownerReviewRows } = await supabase
          .from("reviews")
          .select("id, comment, overall_rating, created_at")
          .eq("reviewed_user_id", propertyRow.owner_id)
          .order("created_at", { ascending: false })
          .limit(2);

        setOwnerReviews(
          (ownerReviewRows ?? []).map((row) => ({
            id: row.id,
            comment: row.comment || "No comment provided.",
            overallRating: Number(row.overall_rating ?? 0),
            date: row.created_at || new Date().toISOString(),
          }))
        );

        if (ownerProfile) {
          setOwner({
            id: ownerProfile.user_id,
            name: ownerProfile.name,
            avatar:
              ownerProfile.avatar_url ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(ownerProfile.name)}&background=F97316&color=fff`,
            averageRating: Number(ownerProfile.average_rating ?? 0),
            trustScore: Number(ownerProfile.trust_score ?? 0),
            totalReviews: Number(ownerProfile.total_reviews ?? 0),
            memberSince: ownerProfile.member_since
              ? new Date(ownerProfile.member_since).toLocaleDateString("en-US", { month: "short", year: "numeric" })
              : "-",
          });
        } else {
          const mockOwner = users.find((u) => u.id === propertyRow.owner_id);
          setOwner(
            mockOwner
              ? {
                  id: mockOwner.id,
                  name: mockOwner.name,
                  avatar: mockOwner.avatar,
                  averageRating: mockOwner.averageRating,
                  trustScore: mockOwner.trustScore,
                  totalReviews: mockOwner.totalReviews,
                  memberSince: mockOwner.memberSince,
                }
              : {
                  id: propertyRow.owner_id,
                  name: "Property Owner",
                  avatar: "https://ui-avatars.com/api/?name=Property+Owner&background=F97316&color=fff",
                  averageRating: 0,
                  trustScore: 0,
                  totalReviews: 0,
                  memberSince: "-",
                }
          );
        }

        if (!ownerReviewRows?.length) {
          const mockOwnerReviews = reviews
            .filter((review) => review.reviewedUserId === propertyRow.owner_id)
            .slice(0, 2)
            .map((review) => ({
              id: review.id,
              comment: review.comment,
              overallRating: review.overallRating,
              date: review.date,
            }));
          setOwnerReviews(mockOwnerReviews);
        }

        setLoading(false);
        return;
      }

      const mockProperty = properties.find((p) => p.id === id);
      if (mockProperty) {
        setProperty({
          id: mockProperty.id,
          title: mockProperty.title,
          images: mockProperty.images,
          price: mockProperty.price,
          location: mockProperty.location,
          furnishing: mockProperty.furnishing,
          bedrooms: mockProperty.bedrooms,
          bathrooms: mockProperty.bathrooms,
          area: mockProperty.area,
          description: mockProperty.description,
          amenities: mockProperty.amenities,
          ownerId: mockProperty.ownerId,
        });

        const mockOwner = users.find((u) => u.id === mockProperty.ownerId);
        setOwner(
          mockOwner
            ? {
                id: mockOwner.id,
                name: mockOwner.name,
                avatar: mockOwner.avatar,
                averageRating: mockOwner.averageRating,
                trustScore: mockOwner.trustScore,
                totalReviews: mockOwner.totalReviews,
                memberSince: mockOwner.memberSince,
              }
            : null
        );

        setOwnerReviews(
          reviews
            .filter((review) => review.reviewedUserId === mockProperty.ownerId)
            .slice(0, 2)
            .map((review) => ({
              id: review.id,
              comment: review.comment,
              overallRating: review.overallRating,
              date: review.date,
            }))
        );
      } else {
        setProperty(null);
        setOwner(null);
        setOwnerReviews([]);
      }

      setLoading(false);
    };

    void loadProperty();
  }, [id]);

  useEffect(() => {
    setActiveImg(0);
  }, [property?.id]);

  if (!loading && !property) {
    return <Layout><div className="container py-16 text-center text-muted-foreground">Property not found.</div></Layout>;
  }

  return (
    <Layout>
      <div className="container py-8">
        <Link to="/listings" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to Listings
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="overflow-hidden rounded-xl">
              <img src={property?.images[activeImg]} alt={property?.title} className="aspect-[16/10] w-full object-cover" />
            </div>
            <div className="flex gap-2">
              {property?.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`overflow-hidden rounded-lg border-2 transition-colors ${i === activeImg ? "border-primary" : "border-transparent"}`}>
                  <img src={img} alt="" className="h-16 w-24 object-cover" />
                </button>
              ))}
            </div>

            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">{property?.title}</h1>
              <div className="mt-2 flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" /> {property?.location}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2"><Bed className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{property?.bedrooms} Bedrooms</span></div>
              <div className="flex items-center gap-2"><Bath className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{property?.bathrooms} Bathrooms</span></div>
              <div className="flex items-center gap-2"><Maximize className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{property?.area} sqft</span></div>
              <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{property?.furnishing}</span></div>
            </div>

            <div>
              <h2 className="font-heading text-lg font-semibold text-foreground">About This Property</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{property?.description}</p>
            </div>

            <div>
              <h2 className="font-heading text-lg font-semibold text-foreground">Amenities</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {property?.amenities.map((a) => (
                  <span key={a} className="rounded-md bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">{a}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <div className="text-center">
                <span className="font-heading text-3xl font-bold text-foreground">₹{property?.price.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground"> /month</span>
              </div>
              <Button className="mt-4 w-full" onClick={() => toast({ title: "Inquiry Sent", description: "The owner will get back to you soon!" })}>
                Contact Owner
              </Button>
              <Button variant="outline" className="mt-2 w-full" asChild>
                <Link to={`/messages`}>Send Message</Link>
              </Button>
            </div>

            {owner && (
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <h3 className="font-heading text-sm font-semibold text-foreground">Property Owner</h3>
                <Link to={`/profile/${owner.id}`} className="mt-4 flex items-center gap-3 group">
                  <img src={owner.avatar} alt={owner.name} className="h-12 w-12 rounded-full object-cover" />
                  <div>
                    <p className="font-medium text-foreground group-hover:text-primary">{owner.name}</p>
                    <StarRating rating={owner.averageRating} size={12} />
                  </div>
                </Link>
                <div className="mt-4 flex justify-center">
                  <TrustScoreBadge score={owner.trustScore} size="sm" />
                </div>
                <p className="mt-3 text-center text-xs text-muted-foreground">{owner.totalReviews} reviews · Member since {owner.memberSince}</p>
              </div>
            )}

            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-heading text-sm font-semibold text-foreground">Recent Owner Reviews</h3>
              <div className="mt-4 space-y-3">
                {ownerReviews.length > 0 ? (
                  ownerReviews.map((review) => (
                    <div key={review.id} className="rounded-lg bg-muted/60 p-3">
                      <div className="flex items-center justify-between">
                        <StarRating rating={review.overallRating} size={12} showValue={false} />
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">No owner reviews available yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PropertyDetails;
