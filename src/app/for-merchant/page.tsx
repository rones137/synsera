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
              Synsera Merchant
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Billing without holding funds
            </h1>
            <p className="mt-4 text-lg text-text-secondary">
              Plans, checkout, customers, and invoices via payment-provider adapters. We
              never hold funds or raw cards.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link href="/register">
                <Button size="lg">Get started</Button>
              </Link>
              <Link href="/merchant">
                <Button size="lg" variant="secondary">
                  Open Merchant
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-3xl px-4 py-16 text-sm leading-relaxed text-text-secondary sm:px-6">
          <p>
            Build KES plans, preview checkout, and track customers locally until you connect
            an adapter. Designed for Kenya &amp; East Africa merchants who want clarity without
            card vaulting.
          </p>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
