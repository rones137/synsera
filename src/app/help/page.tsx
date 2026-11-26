"use client";

import Link from "next/link";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const topics = [
  {
    title: "Add a recurring expense",
    body: "Personal → Add expense. Enter name, KES amount, cycle, and next billing date.",
    href: "/app/expenses/new",
  },
  {
    title: "Import CSV",
    body: "Paste rows with name, merchant, amount, cycle, nextBillingDate, category, paymentMethod.",
    href: "/app/import",
  },
  {
    title: "Google sign-in",
    body: "Use Continue with Google on login/register when Supabase is configured for the host.",
    href: "/login",
  },
  {
    title: "Business & Merchant",
    body: "Switch workspaces from the sidebar. Business tracks vendors and contracts; Merchant builds plans.",
    href: "/business",
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
              Help Centre
            </h1>
            <p className="mt-4 text-lg text-text-secondary">
              Track expenses, alerts, imports, and workspaces — Kenya &amp; East Africa first.
              We never ask for M-PESA PIN or bank passwords.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link href="/register">
                <Button size="lg">Get started</Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="secondary">
                  Log in
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-3xl space-y-4 px-4 py-16 sm:px-6">
          {topics.map((t) => (
            <Link
              key={t.title}
              href={t.href}
              className="block rounded-xl border border-border bg-bg-surface p-5 hover:border-brand/30"
            >
              <h2 className="font-semibold text-text-primary">{t.title}</h2>
              <p className="mt-2 text-sm text-text-secondary">{t.body}</p>
            </Link>
          ))}
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
