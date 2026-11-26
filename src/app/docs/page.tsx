"use client";

import Link from "next/link";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
              Documentation
            </h1>
            <p className="mt-4 text-lg text-text-secondary">
              Setup guides for auth, Supabase, and workspaces. Public API docs arrive with
              Merchant adapters.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link href="/help">
                <Button size="lg">Help Centre</Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="secondary">
                  Get started
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-3xl space-y-4 px-4 py-16 text-sm leading-relaxed text-text-secondary sm:px-6">
          <div className="rounded-xl border border-border bg-bg-surface p-5">
            <h2 className="font-semibold text-text-primary">Supabase + Google Auth</h2>
            <p className="mt-2">
              See <code className="text-text-primary">docs/google-oauth-setup.md</code> and{" "}
              <code className="text-text-primary">docs/supabase-setup.md</code> in the repo for
              redirect URLs, schema.sql, and env vars.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-bg-surface p-5">
            <h2 className="font-semibold text-text-primary">CSV format</h2>
            <p className="mt-2">
              Headers: name, merchant, amount, cycle, nextBillingDate, category, paymentMethod.
              Import from Personal → CSV import.
            </p>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
