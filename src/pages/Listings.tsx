import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import PropertyCard from "@/components/PropertyCard";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyCardData } from "@/components/PropertyCard";
import { properties as mockProperties } from "@/data/mockData";

const furnishingOptions = ["All", "Furnished", "Semi-Furnished", "Unfurnished"];
const typeOptions = ["All", "Apartment", "House", "Villa", "Studio"];

const Listings = () => {
  const [properties, setProperties] = useState<PropertyCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [furnishing, setFurnishing] = useState("All");
  const [type, setType] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadListings = async () => {
      setLoading(true);

      const { data: propertyRows, error: propertyError } = await supabase
        .from("properties")
        .select("id, title, image, furnishing, type, location, bedrooms, bathrooms, area, price, owner_id")
        .order("created_at", { ascending: false });

      if (propertyError || !propertyRows) {
        setProperties(mockProperties);
        setLoading(false);
        return;
      }

      if (propertyRows.length === 0) {
        setProperties(mockProperties);
        setLoading(false);
        return;
      }

      const ownerIds = Array.from(new Set(propertyRows.map((row) => row.owner_id)));
      const { data: ownerProfiles } = await supabase
        .from("profiles")
        .select("user_id, average_rating")
        .in("user_id", ownerIds);

      const ratingByOwner = new Map((ownerProfiles ?? []).map((row) => [row.user_id, Number(row.average_rating ?? 0)]));

      setProperties(
        propertyRows.map((row) => ({
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
          ownerRating: ratingByOwner.get(row.owner_id) ?? 0,
        }))
      );

      setLoading(false);
    };

    void loadListings();
  }, []);

  const filtered = properties.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
    const matchFurnishing = furnishing === "All" || p.furnishing === furnishing;
    const matchType = type === "All" || p.type === type;
    return matchSearch && matchFurnishing && matchType;
  });

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">Browse Properties</h1>
        <p className="mt-1 text-muted-foreground">Find your perfect rental from verified owners.</p>

        {/* Search & Filter */}
        <div className="mt-6 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or location..."
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </Button>
        </div>

        {showFilters && (
          <div className="mt-4 flex flex-wrap gap-6 rounded-lg border border-border bg-card p-4">
            <div>
              <span className="mb-2 block text-xs font-medium text-muted-foreground">Furnishing</span>
              <div className="flex flex-wrap gap-2">
                {furnishingOptions.map((o) => (
                  <button
                    key={o}
                    onClick={() => setFurnishing(o)}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                      furnishing === o ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="mb-2 block text-xs font-medium text-muted-foreground">Type</span>
              <div className="flex flex-wrap gap-2">
                {typeOptions.map((o) => (
                  <button
                    key={o}
                    onClick={() => setType(o)}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                      type === o ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
        {loading && <div className="py-16 text-center text-muted-foreground">Loading properties...</div>}
        {filtered.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">No properties found matching your criteria.</div>
        )}
      </div>
    </Layout>
  );
};

export default Listings;
