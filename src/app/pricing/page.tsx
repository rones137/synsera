import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Synsera pricing hypotheses for Personal and Business — Kenya/KES first.",
};

const personal = [
  {
    name: "Free",
    price: "KSh 0",
    blurb: "Start tracking manually.",
    features: ["Up to 15 recurring expenses", "Overview dashboard", "Basic reminders", "KES display"],
  },
  {
    name: "Plus",
    price: "KSh 199",
    blurb: "More intelligence for households.",
    features: [
      "Unlimited expenses",
      "AI receipt extraction (soon)",
      "Savings estimates",
      "CSV import",
      "Priority alerts",
    ],
    featured: true,
  },
  {
    name: "Family",
    price: "KSh 399",
    blurb: "Shared visibility at home.",
    features: [
      "Everything in Plus",
      "Up to 5 members (soon)",
      "Shared calendar",
      "Split views",
    ],
  },
];

const business = [
  {
    name: "Starter",
    price: "KSh 1,500",
    features: ["Vendor & software tracking", "1 company", "Exports", "Email support"],
  },
  {
    name: "Growth",
    price: "KSh 4,500",
    features: ["Budgets & owners", "License waste signals", "Approvals (soon)", "3 companies"],
    featured: true,
  },
  {
    name: "Professional",
    price: "KSh 10,000+",
    features: ["Multi-company", "Audit trails", "API / webhooks (later)", "Dedicated support"],
  },
];

function PlanCard({
  name,
  price,
  blurb,
  features,
  featured,
}: {
  name: string;
  price: string;
  blurb?: string;
  features: string[];
  featured?: boolean;
}) {
  return (
    <div
      className={`flex flex-col rounded-xl border p-6 ${
        featured ? "border-brand bg-red-tint/30" : "border-border bg-bg-surface"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-lg font-semibold">{name}</h3>
        {featured && <Badge tone="brand">Popular</Badge>}
      </div>
      {blurb && <p className="mt-1 text-sm text-text-secondary">{blurb}</p>}
      <p className="mt-4">
        <span className="money text-3xl font-semibold">{price}</span>
        <span className="text-text-secondary">/mo</span>
      </p>
      <ul className="mt-6 flex-1 space-y-2.5">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-text-secondary">
            <Check size={16} className="mt-0.5 shrink-0 text-brand" />
            {f}
          </li>
        ))}
      </ul>
      <Link href="/register" className="mt-6">
        <Button variant={featured ? "primary" : "secondary"} className="w-full">
          Get started
        </Button>
      </Link>
    </div>
  );
}

export default function PricingPage() {
  return (
    <div className="flex min-h-full flex-col">
      <MarketingNav />
      <main className="flex-1">
        <section className="hero-glow border-b border-border py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <Badge tone="sample" className="mb-4">
              Hypothesis · not live billing
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Pricing built for Kenya first
            </h1>
            <p className="mt-4 text-text-secondary">
              These are validation targets in KES — not locked charges. Synsera earns
              trust by delivering verified financial value, not surprise renewals of our
              own.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-2xl font-semibold">Personal</h2>
            <p className="mt-2 text-sm text-text-secondary">
              Individuals and families tracking household recurring spend.
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {personal.map((p) => (
                <PlanCard key={p.name} {...p} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-bg-surface py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-2xl font-semibold">Business</h2>
            <p className="mt-2 text-sm text-text-secondary">
              Freelancers and SMEs — our primary early revenue bet. Workspace UI lands
              after Personal MVP.
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {business.map((p) => (
                <PlanCard key={p.name} {...p} />
              ))}
            </div>
            <p className="mt-10 text-center text-sm text-text-secondary">
              Merchant Billing uses subscription + usage fees via payment-provider
              adapters. We never sell personal transaction data.
            </p>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
