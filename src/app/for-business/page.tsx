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
              Synsera Business
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Software spend under control
            </h1>
            <p className="mt-4 text-lg text-text-secondary">
              Vendors, contracts, budgets, and licenses for freelancers and SMEs —
              Kenya &amp; East Africa first, amounts in KES.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link href="/register">
                <Button size="lg">Get started</Button>
              </Link>
              <Link href="/business">
                <Button size="lg" variant="secondary">
                  Open Business
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-3xl px-4 py-16 text-sm leading-relaxed text-text-secondary sm:px-6">
          <p>
            Every recurring payment. Every renewal. Under your control. We never ask for
            M-PESA PIN or bank passwords — only the data you choose to enter or import.
          </p>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
