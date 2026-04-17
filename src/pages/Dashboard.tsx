import { Link } from "react-router-dom";
import { MessageSquare, Star, Home, Users, ClipboardList, TrendingUp, Building2 } from "lucide-react";
import Layout from "@/components/Layout";
import TrustScoreBadge from "@/components/TrustScoreBadge";
import PropertyCard from "@/components/PropertyCard";
import ReviewCard from "@/components/ReviewCard";
import { useCallback, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { PropertyCardData } from "@/components/PropertyCard";
import type { ReviewCardData } from "@/components/ReviewCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { messages as mockMessages, properties as mockProperties, reviews as mockReviews, users as mockUsers } from "@/data/mockData";

type Tab = "overview" | "listings" | "reviews" | "messages";
const MOCK_AUTH_ENABLED = import.meta.env.VITE_USE_MOCK_AUTH !== "false";
const MOCK_OWNER_LISTINGS_KEY = "rentrate_mock_owner_listings";

const Dashboard = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [myProperties, setMyProperties] = useState<PropertyCardData[]>([]);
  const [myReviews, setMyReviews] = useState<ReviewCardData[]>([]);
  const [messageCount, setMessageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submittingListing, setSubmittingListing] = useState(false);
  const [deletingListingId, setDeletingListingId] = useState<string | null>(null);
  const [listingForm, setListingForm] = useState({
    title: "",
    location: "",
    price: "",
    type: "Apartment",
    furnishing: "Unfurnished",
    bedrooms: "1",
    bathrooms: "1",
    area: "500",
    image: "",
    description: "",
    amenities: "",
  });

  const isOwner = profile?.role === "owner";

  const getStoredMockOwnerListings = useCallback(() => {
    const raw = localStorage.getItem(MOCK_OWNER_LISTINGS_KEY);
    if (!raw) return [] as PropertyCardData[];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as PropertyCardData[]) : [];
    } catch {
      return [];
    }
  }, []);

  const setStoredMockOwnerListings = useCallback((listings: PropertyCardData[]) => {
    localStorage.setItem(MOCK_OWNER_LISTINGS_KEY, JSON.stringify(listings));
  }, []);

  const loadDashboardData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (MOCK_AUTH_ENABLED || !isSupabaseConfigured) {
      setLoading(true);

      const ownerUser = mockUsers.find((item) => item.role === "owner");
      const ownerId = ownerUser?.id || "u1";
      const mockBaseProperties = mockProperties
        .filter((item) => item.ownerId === ownerId)
        .map((item) => ({
          id: item.id,
          title: item.title,
          image: item.image,
          furnishing: item.furnishing,
          type: item.type,
          location: item.location,
          bedrooms: item.bedrooms,
          bathrooms: item.bathrooms,
          area: item.area,
          price: item.price,
          ownerRating: item.ownerRating,
        }));

      const localCreatedListings = getStoredMockOwnerListings();
      setMyProperties([...localCreatedListings, ...mockBaseProperties]);

      setMyReviews(
        mockReviews
          .filter((item) => item.reviewedUserId === ownerId)
          .map((item) => ({
            id: item.id,
            reviewerName: item.reviewerName,
            reviewerRole: item.reviewerRole,
            behavior: item.behavior,
            communication: item.communication,
            cleanliness: item.cleanliness,
            paymentTimeliness: item.paymentTimeliness,
            maintenance: item.maintenance,
            overallRating: item.overallRating,
            comment: item.comment,
            date: item.date,
          }))
      );

      setMessageCount(
        mockMessages.filter((item) => item.receiverId === ownerId || item.senderId === ownerId).length
      );
      setLoading(false);
      return;
    }

    setLoading(true);

    const [{ data: propertyRows }, { data: reviewRows }, messageCountResult] = await Promise.all([
      supabase
        .from("properties")
        .select("id, title, image, furnishing, type, location, bedrooms, bathrooms, area, price")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("reviews")
        .select("id, reviewer_id, behavior, communication, cleanliness, payment_timeliness, maintenance, overall_rating, comment, created_at")
        .eq("reviewed_user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("receiver_id", user.id),
    ]);

    const reviewerIds = Array.from(new Set((reviewRows ?? []).map((row) => row.reviewer_id)));
    const { data: reviewerProfiles } = reviewerIds.length
      ? await supabase.from("profiles").select("user_id, name, role").in("user_id", reviewerIds)
      : { data: [] as { user_id: string; name: string; role: string }[] };

    const reviewerMap = new Map((reviewerProfiles ?? []).map((row) => [row.user_id, row]));

    setMyProperties(
      (propertyRows ?? []).map((row) => ({
        id: row.id,
        title: row.title,
        image: row.image || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
        furnishing: row.furnishing || "Unfurnished",
        type: row.type || "Apartment",
        location: row.location,
        bedrooms: row.bedrooms ?? 0,
        bathrooms: row.bathrooms ?? 0,
        area: Number(row.area ?? 0),
        price: Number(row.price ?? 0),
        ownerRating: Number(profile?.average_rating ?? 0),
      }))
    );

    setMyReviews(
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

    setMessageCount(messageCountResult.count ?? 0);
    setLoading(false);
  }, [user, profile?.average_rating, getStoredMockOwnerListings]);

  useEffect(() => {
    void loadDashboardData();
  }, [loadDashboardData]);

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;
    if (!isOwner) {
      toast({ title: "Only owners can create listings", description: "Switch to an owner account to add properties.", variant: "destructive" });
      return;
    }

    setSubmittingListing(true);

    const amenitiesArray = listingForm.amenities
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (MOCK_AUTH_ENABLED) {
      const localListing: PropertyCardData = {
        id: `mock-local-${Date.now()}`,
        title: listingForm.title,
        image: listingForm.image || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
        furnishing: listingForm.furnishing,
        type: listingForm.type,
        location: listingForm.location,
        bedrooms: Number(listingForm.bedrooms),
        bathrooms: Number(listingForm.bathrooms),
        area: Number(listingForm.area),
        price: Number(listingForm.price),
        ownerRating: Number(profile?.average_rating ?? 4.5),
      };

      const nextLocalListings = [localListing, ...getStoredMockOwnerListings()];
      setStoredMockOwnerListings(nextLocalListings);

      setListingForm({
        title: "",
        location: "",
        price: "",
        type: "Apartment",
        furnishing: "Unfurnished",
        bedrooms: "1",
        bathrooms: "1",
        area: "500",
        image: "",
        description: "",
        amenities: "",
      });

      toast({ title: "Mock listing created", description: "Saved locally for demo owner account." });
      setSubmittingListing(false);
      await loadDashboardData();
      return;
    }

    const { error } = await supabase.from("properties").insert({
      title: listingForm.title,
      location: listingForm.location,
      price: Number(listingForm.price),
      type: listingForm.type,
      furnishing: listingForm.furnishing,
      bedrooms: Number(listingForm.bedrooms),
      bathrooms: Number(listingForm.bathrooms),
      area: Number(listingForm.area),
      image: listingForm.image || null,
      images: listingForm.image ? [listingForm.image] : [],
      description: listingForm.description || null,
      amenities: amenitiesArray,
      owner_id: user.id,
      city: listingForm.location.split(",").slice(-1)[0]?.trim() || null,
    });

    if (error) {
      toast({ title: "Failed to create listing", description: error.message, variant: "destructive" });
      setSubmittingListing(false);
      return;
    }

    setListingForm({
      title: "",
      location: "",
      price: "",
      type: "Apartment",
      furnishing: "Unfurnished",
      bedrooms: "1",
      bathrooms: "1",
      area: "500",
      image: "",
      description: "",
      amenities: "",
    });

    toast({ title: "Listing created", description: "Your property is now live in your listings." });
    setSubmittingListing(false);
    await loadDashboardData();
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!user) return;
    if (!window.confirm("Delete this listing? This action cannot be undone.")) return;

    if (MOCK_AUTH_ENABLED) {
      setDeletingListingId(listingId);
      const remaining = getStoredMockOwnerListings().filter((item) => item.id !== listingId);
      setStoredMockOwnerListings(remaining);
      toast({ title: "Mock listing deleted", description: "Removed from local demo data." });
      setDeletingListingId(null);
      await loadDashboardData();
      return;
    }

    setDeletingListingId(listingId);
    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", listingId)
      .eq("owner_id", user.id);

    if (error) {
      toast({ title: "Failed to delete listing", description: error.message, variant: "destructive" });
      setDeletingListingId(null);
      return;
    }

    toast({ title: "Listing deleted", description: "The property has been removed." });
    setDeletingListingId(null);
    await loadDashboardData();
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "listings", label: "My Listings", icon: ClipboardList },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "messages", label: "Messages", icon: MessageSquare },
  ];

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={
                profile?.avatar_url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || "User")}&background=F97316&color=fff`
              }
              alt={profile?.name || "User"}
              className="h-16 w-16 rounded-full object-cover"
            />
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground">Welcome, {(profile?.name || "User").split(" ")[0]}</h1>
              <span className="text-sm capitalize text-muted-foreground">{profile?.role || "user"} Dashboard</span>
            </div>
          </div>
          <TrustScoreBadge score={Number(profile?.trust_score ?? 0)} />
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-1 overflow-x-auto rounded-lg border border-border bg-card p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-6">
          {activeTab === "overview" && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Home, label: "Properties", value: myProperties.length },
                { icon: Star, label: "Avg Rating", value: Number(profile?.average_rating ?? 0).toFixed(1) },
                { icon: Users, label: "Total Reviews", value: Number(profile?.total_reviews ?? 0) },
                { icon: MessageSquare, label: "Messages", value: messageCount },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-card p-6 shadow-card">
                  <s.icon className="h-5 w-5 text-primary" />
                  <p className="mt-3 font-heading text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "listings" && (
            <div className="space-y-8">
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { icon: Building2, label: "Active Listings", value: myProperties.length },
                  { icon: TrendingUp, label: "Avg Owner Rating", value: Number(profile?.average_rating ?? 0).toFixed(1) },
                  { icon: MessageSquare, label: "Listing Inquiries", value: messageCount },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-border bg-gradient-to-br from-white to-orange-50 p-4 shadow-card">
                    <item.icon className="h-5 w-5 text-primary" />
                    <p className="mt-2 font-heading text-2xl font-bold text-foreground">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <h3 className="font-heading text-lg font-semibold text-foreground">Create New Listing</h3>
                <p className="mt-1 text-sm text-muted-foreground">Add a property and manage it directly from your dashboard.</p>

                {!isOwner ? (
                  <p className="mt-4 rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
                    Listing creation is available for owner accounts.
                  </p>
                ) : (
                  <form onSubmit={handleCreateListing} className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <Label htmlFor="title">Property title</Label>
                      <Input
                        id="title"
                        value={listingForm.title}
                        onChange={(e) => setListingForm((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Modern 2BHK Apartment in Koramangala"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={listingForm.location}
                        onChange={(e) => setListingForm((prev) => ({ ...prev, location: e.target.value }))}
                        placeholder="Koramangala, Bangalore"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Monthly rent (INR)</Label>
                      <Input
                        id="price"
                        type="number"
                        min="1"
                        value={listingForm.price}
                        onChange={(e) => setListingForm((prev) => ({ ...prev, price: e.target.value }))}
                        placeholder="25000"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Property type</Label>
                      <select
                        id="type"
                        value={listingForm.type}
                        onChange={(e) => setListingForm((prev) => ({ ...prev, type: e.target.value }))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option>Apartment</option>
                        <option>House</option>
                        <option>Villa</option>
                        <option>Studio</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="furnishing">Furnishing</Label>
                      <select
                        id="furnishing"
                        value={listingForm.furnishing}
                        onChange={(e) => setListingForm((prev) => ({ ...prev, furnishing: e.target.value }))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option>Furnished</option>
                        <option>Semi-Furnished</option>
                        <option>Unfurnished</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="bedrooms">Bedrooms</Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        min="0"
                        value={listingForm.bedrooms}
                        onChange={(e) => setListingForm((prev) => ({ ...prev, bedrooms: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="bathrooms">Bathrooms</Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        min="0"
                        value={listingForm.bathrooms}
                        onChange={(e) => setListingForm((prev) => ({ ...prev, bathrooms: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="area">Area (sqft)</Label>
                      <Input
                        id="area"
                        type="number"
                        min="0"
                        value={listingForm.area}
                        onChange={(e) => setListingForm((prev) => ({ ...prev, area: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="image">Cover image URL</Label>
                      <Input
                        id="image"
                        type="url"
                        value={listingForm.image}
                        onChange={(e) => setListingForm((prev) => ({ ...prev, image: e.target.value }))}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="amenities">Amenities (comma separated)</Label>
                      <Input
                        id="amenities"
                        value={listingForm.amenities}
                        onChange={(e) => setListingForm((prev) => ({ ...prev, amenities: e.target.value }))}
                        placeholder="WiFi, Parking, Gym"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        rows={4}
                        value={listingForm.description}
                        onChange={(e) => setListingForm((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the property highlights, nearby places, and rules..."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Button type="submit" disabled={submittingListing} className="w-full sm:w-auto">
                        {submittingListing ? "Creating..." : "Create Listing"}
                      </Button>
                    </div>
                  </form>
                )}
              </div>

              <div>
                <h3 className="font-heading text-lg font-semibold text-foreground">Manage Listings</h3>
                <p className="mt-1 text-sm text-muted-foreground">View, review, and remove your active listings.</p>

                <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {myProperties.map((p) => (
                    <div key={p.id} className="space-y-3">
                      <PropertyCard property={p} />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteListing(p.id)}
                        disabled={deletingListingId === p.id}
                        className="w-full"
                      >
                        {deletingListingId === p.id ? "Deleting..." : "Delete Listing"}
                      </Button>
                    </div>
                  ))}
                </div>

                {!loading && myProperties.length === 0 && <p className="mt-4 text-muted-foreground">No listings found.</p>}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4 max-w-2xl">
              {myReviews.map((r) => <ReviewCard key={r.id} review={r} />)}
              {!loading && myReviews.length === 0 && <p className="text-muted-foreground">No reviews yet.</p>}
            </div>
          )}

          {activeTab === "messages" && (
            <div className="rounded-xl border border-border bg-card p-8 text-center shadow-card">
              <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-3 font-medium text-foreground">Messages</p>
              <p className="text-sm text-muted-foreground">Check your conversations in the <Link to="/messages" className="text-primary hover:underline">Messages</Link> section.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
