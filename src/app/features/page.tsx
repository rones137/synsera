"use client";

import Link from "next/link";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    title: "Discover",
    body: "Manual entry, CSV import, and receipt drafts so every recurring payment is visible.",
  },
  {
    title: "Track",
    body: "Personal, Business, and Merchant workspaces with KES amounts and renewal calendars.",
  },
  {
    title: "Predict",
    body: "Money Radar and insights surface what is due next and where you might save.",
  },
  {
    title: "Control",
    body: "Alerts, cancellation workflows, budgets, licenses, and merchant plans — under your rules.",
  },
];

export default function Page() {
  return (
    <div className="flex min-h-full flex-col">
      <MarketingNav />
      <main className="flex-1">
        <section className="hero-glow border-b border-border py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <Badge tone="brand" className="mb-4">
              Synsera
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Features
            </h1>
            <p className="mt-4 text-lg text-text-secondary">
              Discover, Track, Predict, and Control — a recurring financial inbox for Kenya
              &amp; East Africa.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link href="/register">
                <Button size="lg">Get started</Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="secondary">
                  Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <section className="mx-auto grid max-w-5xl gap-4 px-4 py-16 sm:grid-cols-2 sm:px-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-border bg-bg-surface p-6"
            >
              <h2 className="text-lg font-semibold text-text-primary">{f.title}</h2>
              <p className="mt-2 text-sm text-text-secondary">{f.body}</p>
            </div>
          ))}
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
