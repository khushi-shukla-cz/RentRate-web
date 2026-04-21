import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Star, Home, ArrowRight, Sparkles, CheckCircle2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import PropertyCard from "@/components/PropertyCard";
import type { PropertyCardData } from "@/components/PropertyCard";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { properties as mockProperties } from "@/data/mockData";

const features = [
  { icon: Shield, title: "Verified Profiles", desc: "Every user is verified with real identity checks to ensure a safe community." },
  { icon: Star, title: "Transparent Reviews", desc: "Rate tenants and owners across multiple categories for honest feedback." },
  { icon: Home, title: "Stress-Free Renting", desc: "Make informed decisions with trust scores, reviews, and verified listings." },
];

const fade = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const stats = [
  { value: "10k+", label: "Community Members" },
  { value: "4.7/5", label: "Avg Trust Rating" },
  { value: "120+", label: "Verified Listings" },
];
const FEATURED_CACHE_KEY = "rentrate_featured_cache_v1";
const FEATURED_CACHE_TTL_MS = 5 * 60 * 1000;

const getCachedFeatured = (): PropertyCardData[] | null => {
  const raw = localStorage.getItem(FEATURED_CACHE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as { timestamp: number; data: PropertyCardData[] };
    if (!Array.isArray(parsed.data)) return null;
    if (Date.now() - parsed.timestamp > FEATURED_CACHE_TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
};

const setCachedFeatured = (data: PropertyCardData[]) => {
  localStorage.setItem(
    FEATURED_CACHE_KEY,
    JSON.stringify({
      timestamp: Date.now(),
      data,
    })
  );
};

const Index = () => {
  const [featured, setFeatured] = useState<PropertyCardData[]>([]);

  useEffect(() => {
    const loadFeatured = async () => {
      const cachedFeatured = getCachedFeatured();
      if (cachedFeatured?.length) {
        setFeatured(cachedFeatured);
      }

      if (!isSupabaseConfigured) {
        if (!cachedFeatured?.length) {
          const fallback = mockProperties.slice(0, 3);
          setFeatured(fallback);
          setCachedFeatured(fallback);
        }
        return;
      }

      const { data: propertyRows } = await supabase
        .from("properties")
        .select("id, title, image, furnishing, type, location, bedrooms, bathrooms, area, price, owner_id")
        .order("created_at", { ascending: false })
        .limit(3);

      if (!propertyRows?.length) {
        const fallback = mockProperties.slice(0, 3);
        setFeatured(fallback);
        setCachedFeatured(fallback);
        return;
      }

      const ownerIds = Array.from(new Set(propertyRows.map((row) => row.owner_id)));
      const { data: ownerProfiles } = await supabase
        .from("profiles")
        .select("user_id, average_rating")
        .in("user_id", ownerIds);

      const ratingByOwner = new Map((ownerProfiles ?? []).map((row) => [row.user_id, Number(row.average_rating ?? 0)]));

      const mappedFeatured = propertyRows.map((row) => ({
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
        }));

      setFeatured(mappedFeatured);
      setCachedFeatured(mappedFeatured);
    };

    void loadFeatured();
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-100 via-amber-50 to-teal-50">
        <div className="absolute -left-20 top-16 h-72 w-72 rounded-full bg-orange-300/30 blur-3xl" />
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-teal-300/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-yellow-300/20 blur-3xl" />

        <div className="container relative py-16 md:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div initial="hidden" animate="visible" variants={fade} transition={{ duration: 0.6 }}>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-1.5 text-xs font-semibold text-orange-700 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" /> Built For Trust-First Renting
              </span>
              <h1 className="font-heading text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl lg:text-6xl">
                Rental Decisions
                <span className="block text-orange-600">Backed By Real Reputation</span>
              </h1>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-600 md:text-lg">
                Skip guesswork. Compare verified owners and tenants through transparent ratings, behavioral insights, and trusted community feedback.
              </p>

              <div className="mt-6 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-white/80 bg-white/80 p-3 text-center shadow-card backdrop-blur">
                    <p className="font-heading text-xl font-extrabold text-slate-900">{stat.value}</p>
                    <p className="text-xs text-slate-600">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/listings">
                  <Button size="lg" className="gap-2 bg-slate-900 text-white hover:bg-slate-800">
                    Explore Properties <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" variant="outline" className="border-slate-300 bg-white/70 text-slate-900 hover:bg-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&h=700&fit=crop"
                alt="Modern home"
                className="rounded-3xl border border-white/60 shadow-elevated"
              />

              <div className="absolute -bottom-5 left-5 rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-card backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Average Owner Trust</p>
                <div className="mt-1 flex items-center gap-2">
                  <Star className="h-4 w-4 fill-orange-500 text-orange-500" />
                  <span className="font-heading text-lg font-bold text-slate-900">4.7/5</span>
                </div>
              </div>

              <div className="absolute -right-3 top-8 rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-card backdrop-blur">
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <MapPin className="h-4 w-4 text-teal-600" /> Verified neighborhoods
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-16 md:py-24">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground">Why Choose RentRate?</h2>
          <p className="mt-2 text-muted-foreground">A smarter way to rent, powered by community trust.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="rounded-2xl border border-border bg-gradient-to-b from-white to-orange-50 p-8 text-center shadow-card transition-shadow hover:shadow-hover"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fade}
              transition={{ delay: i * 0.1 }}
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16 md:py-24">
        <div className="container">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-heading text-3xl font-bold text-foreground">Featured Properties</h2>
              <p className="mt-2 text-muted-foreground">Handpicked listings from top-rated owners.</p>
            </div>
            <Link to="/listings" className="hidden text-sm font-medium text-primary hover:underline md:block">
              View All →
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
          {featured.length === 0 && (
            <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
              No featured properties yet.
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16 md:py-24">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-teal-900 px-6 py-12 text-center shadow-elevated md:px-10">
          <h2 className="font-heading text-3xl font-bold text-white">Ready to Build Trust?</h2>
          <p className="mx-auto mt-3 max-w-md text-slate-200">
            Join thousands of tenants and owners creating a transparent rental experience.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/register"><Button size="lg" className="bg-orange-500 text-white hover:bg-orange-600">Create Account</Button></Link>
            <Link to="/about"><Button size="lg" variant="outline" className="border-slate-300 bg-transparent text-white hover:bg-white/10">Learn More</Button></Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-sm text-slate-200">
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> Verified Users</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> Transparent Reviews</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> Trusted Network</span>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
