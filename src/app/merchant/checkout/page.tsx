"use client";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { formatKES } from "@/lib/format";
export default function Page() {
  return (<div className="mx-auto max-w-6xl space-y-6"><PageHeader title="Checkout" description="Hosted checkout preview — no real charges." />
  <div className="rounded-xl border border-border bg-bg-surface p-8 max-w-md">
    <Badge tone="sample" className="mb-4">Demo checkout · no real charges</Badge>
    <h2 className="text-xl font-semibold">Growth plan</h2>
    <p className="money text-3xl font-semibold mt-2">{formatKES(2499)}<span className="text-sm text-text-secondary">/mo</span></p>
    <button type="button" className="mt-6 w-full h-11 rounded-lg bg-brand text-white font-medium">Subscribe (demo)</button>
    <p className="mt-3 text-xs text-text-secondary">Adapters only — Synsera never stores raw cards or holds funds.</p>
  </div></div>);
}
