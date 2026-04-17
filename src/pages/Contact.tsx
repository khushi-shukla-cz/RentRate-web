import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Clock3, Headphones, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitting(false);
    toast({ title: "Message Sent", description: "We'll get back to you within 24 hours." });
  };

  return (
    <Layout>
      <div className="bg-gradient-to-b from-slate-100 via-white to-orange-50">
        <div className="container py-16">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-1 text-xs font-semibold text-slate-700">
              <Headphones className="h-3.5 w-3.5" /> Support & Partnerships
            </span>
            <h1 className="mt-4 font-heading text-4xl font-extrabold text-slate-900 md:text-5xl">Get in Touch</h1>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Have a question, collaboration idea, or issue to report? Our team is here to help you quickly and professionally.
            </p>
          </div>

          <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { icon: Clock3, title: "Fast Response", value: "Within 24 hours" },
              { icon: ShieldCheck, title: "Priority Support", value: "Trust & safety first" },
              { icon: Headphones, title: "Help Channels", value: "Email, phone, office" },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-white bg-white/90 p-5 text-center shadow-card">
                <item.icon className="mx-auto h-6 w-6 text-primary" />
                <p className="mt-2 font-heading text-base font-semibold text-slate-900">{item.title}</p>
                <p className="text-sm text-slate-600">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-12 md:py-16">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.2fr,0.8fr]">
          <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" required />
              </div>
              <div>
                <Label htmlFor="company">Company (optional)</Label>
                <Input id="company" placeholder="Your company" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" required />
            </div>
            <div>
              <Label htmlFor="topic">Topic</Label>
              <Input id="topic" placeholder="Billing, account issue, partnership, feedback..." required />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="How can we help?" rows={5} required />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Sending..." : "Send Message"}
            </Button>
            <p className="text-xs text-muted-foreground">By contacting us, you agree to receive email replies regarding your request.</p>
          </form>

          <div className="space-y-5">
            {[
              { icon: Mail, label: "Email", value: "hello@rentrate.com" },
              { icon: Phone, label: "Phone", value: "+91 98765 43210" },
              { icon: MapPin, label: "Office", value: "Bangalore, Karnataka, India" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.value}</p>
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-100 p-5 shadow-card">
              <p className="font-heading text-base font-semibold text-slate-900">Support Hours</p>
              <p className="mt-1 text-sm text-slate-700">Mon - Fri: 9:00 AM to 7:00 PM IST</p>
              <p className="text-sm text-slate-700">Sat: 10:00 AM to 2:00 PM IST</p>
              <p className="mt-2 text-xs text-slate-600">Critical trust & safety reports are prioritized.</p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-5xl rounded-3xl border border-border bg-card p-6 shadow-card md:p-8">
          <h2 className="font-heading text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {[
              {
                q: "How quickly can I expect a response?",
                a: "Most questions receive a response within 24 hours during working days.",
              },
              {
                q: "Can I report trust or safety concerns?",
                a: "Yes. Use the contact form with topic 'Trust & Safety' for priority handling.",
              },
              {
                q: "Do you support partnerships and integrations?",
                a: "Absolutely. Choose 'Partnership' in your message topic and share your proposal details.",
              },
              {
                q: "Can I request account data corrections?",
                a: "Yes, include your registered email and required changes and our support team will help.",
              },
            ].map((item) => (
              <div key={item.q} className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="font-medium text-foreground">{item.q}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
