import Layout from "@/components/Layout";
import { Shield, Users, Star, TrendingUp, HeartHandshake, CircleCheck, Sparkles, MessageCircle, FileCheck2 } from "lucide-react";

const About = () => {
  const pillars = [
    { icon: Shield, title: "Verified Profiles", desc: "Every user goes through identity verification, creating a foundation of trust." },
    { icon: Star, title: "Multi-Category Reviews", desc: "Rate on behavior, communication, cleanliness, timeliness, and maintenance." },
    { icon: TrendingUp, title: "Trust Scores", desc: "A dynamic score calculated from all reviews, giving instant credibility signals." },
    { icon: Users, title: "Community-Driven", desc: "Real feedback from real people builds an ecosystem of accountability." },
  ];

  const process = [
    {
      icon: FileCheck2,
      title: "Profile Verification",
      desc: "We help establish trusted identities so both tenants and owners can make safer first decisions.",
    },
    {
      icon: MessageCircle,
      title: "Experience Feedback",
      desc: "Post-rental experiences are captured through structured review categories and written context.",
    },
    {
      icon: Sparkles,
      title: "Transparent Trust Signals",
      desc: "Ratings are converted into easy-to-understand trust indicators for future rental decisions.",
    },
  ];

  return (
    <Layout>
      <div className="bg-gradient-to-b from-orange-100 via-amber-50 to-white">
        <div className="container py-16 md:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-300 bg-white/80 px-4 py-1 text-xs font-semibold text-orange-700">
              <HeartHandshake className="h-3.5 w-3.5" /> Our Mission
            </span>
            <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">About RentRate</h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              We are rebuilding rental trust from the ground up. RentRate helps tenants and owners make decisions using verified profiles,
              review-backed reputation, and transparent trust metrics.
            </p>
          </div>

          <div className="mx-auto mt-8 grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { value: "10k+", label: "Active Members" },
              { value: "50k+", label: "Trust Signals Generated" },
              { value: "4.7/5", label: "Average Community Rating" },
              { value: "24h", label: "Typical Support Response" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/80 bg-white/80 p-4 text-center shadow-card">
                <p className="font-heading text-2xl font-extrabold text-slate-900">{stat.value}</p>
                <p className="mt-1 text-xs text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-3">
            {[
              { title: "Clarity", text: "See the full history before signing an agreement." },
              { title: "Safety", text: "Know who you are renting to or renting from." },
              { title: "Fairness", text: "Reward responsible behavior with better visibility." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/80 bg-white/80 p-5 text-left shadow-card">
                <p className="font-heading text-lg font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-16 md:py-20">
        <div className="mb-12 rounded-3xl border border-border bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-elevated md:p-10">
          <h2 className="font-heading text-2xl font-bold md:text-3xl">What We Believe</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-200 md:text-base">
            Renting should feel professional, not risky. We believe trust should be visible, earned over time, and backed by structured feedback.
            RentRate is designed to reduce uncertainty and help both sides enter agreements with confidence.
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-border bg-slate-900 p-8 text-white shadow-elevated">
            <h2 className="font-heading text-2xl font-bold">The Problem We Solve</h2>
            <p className="mt-4 leading-relaxed text-slate-200">
              Every year, rental agreements are signed without meaningful reputation data. Tenants can be trapped with unresponsive owners,
              and owners can face repeated payment or maintenance issues. Lack of transparency creates friction, stress, and financial risk.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-200">
              <li className="flex items-start gap-2"><CircleCheck className="mt-0.5 h-4 w-4 text-emerald-300" /> No reliable way to verify behavior history</li>
              <li className="flex items-start gap-2"><CircleCheck className="mt-0.5 h-4 w-4 text-emerald-300" /> Trust decisions based on guesswork</li>
              <li className="flex items-start gap-2"><CircleCheck className="mt-0.5 h-4 w-4 text-emerald-300" /> Disputes due to missing accountability signals</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-100 p-8 shadow-card">
            <h2 className="font-heading text-2xl font-bold text-slate-900">Our Approach</h2>
            <p className="mt-4 leading-relaxed text-slate-700">
              RentRate combines identity validation, detailed review dimensions, and profile-level trust scoring to make rental decisions more confident and fair for everyone.
            </p>
            <div className="mt-6 space-y-3 text-sm text-slate-700">
              <p><strong>For tenants:</strong> find responsive and responsible property owners.</p>
              <p><strong>For owners:</strong> identify respectful, timely, and reliable tenants.</p>
              <p><strong>For the ecosystem:</strong> reward good behavior through transparency.</p>
            </div>
          </div>
        </div>

        <h2 className="mt-16 text-center font-heading text-3xl font-bold text-foreground">How It Works</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {process.map((step, index) => (
            <div key={step.title} className="relative rounded-2xl border border-border bg-card p-6 shadow-card">
              <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {index + 1}
              </span>
              <step.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-heading text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-16 text-center font-heading text-3xl font-bold text-foreground">How RentRate Builds Confidence</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {pillars.map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-gradient-to-b from-white to-orange-50 p-6 shadow-card">
              <item.icon className="h-8 w-8 text-primary" />
              <h3 className="mt-3 font-heading text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default About;
