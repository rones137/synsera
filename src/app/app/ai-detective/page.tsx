"use client";
import Link from "next/link";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { useApp } from "@/lib/store";

const signals = [
  { title: "Duplicate entertainment?", detail: "Netflix + Showmax both active.", confidence: "probable", evidence: [" overlapping category", "both active"], href: "/app/subscriptions/exp-9" },
  { title: "Price hike vs prior invoice", detail: "Adobe +KSh 700 vs last cycle.", confidence: "confirmed", evidence: ["history 6500→7200", "merchant Adobe"], href: "/app/subscriptions/exp-2" },
  { title: "Trial converting soon", detail: "Canva Pro trial ends Dec 3.", confidence: "likely", evidence: ["status=trial", "nextBillingDate"], href: "/app/subscriptions/exp-5" },
  { title: "Failed payment risk", detail: "Microsoft 365 card declined.", confidence: "confirmed", evidence: ["status=failed", "card ····8820"], href: "/app/subscriptions/exp-8" },
];

export default function AIDetectivePage() {
  const { expenses } = useApp();
  const suspected = expenses.filter(e => e.workspace==="personal" && !e.confirmed);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="AI Detective" description="AI extracts signals. Deterministic rules own money. Confidence + evidence on every card."
        action={<div className="flex gap-2"><Link href="/app/receipts"><Button variant="secondary" size="sm">Upload receipt</Button></Link><Link href="/app/import"><Button size="sm">Import CSV</Button></Link></div>} />
      <div className="rounded-xl border border-border bg-bg-surface p-5 flex gap-3">
        <Sparkles className="text-brand shrink-0" size={20} />
        <div>
          <p className="font-medium">How Synsera uses AI</p>
          <p className="mt-1 text-sm text-text-secondary leading-relaxed">Extraction suggests merchants/amounts. You confirm. No invented savings. Suspected items: {suspected.length}.</p>
        </div>
      </div>
      <ul className="space-y-3">
        {signals.map(r => (
          <li key={r.title} className="rounded-xl border border-border bg-bg-surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{r.title}</p>
                <p className="mt-1 text-sm text-text-secondary">{r.detail}</p>
                <p className="mt-2 text-xs text-text-secondary">Evidence: {r.evidence.join(" · ")}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge tone={r.confidence==="confirmed"?"brand":"neutral"}>Confidence: {r.confidence}</Badge>
                <Link href={r.href}><Button size="sm" variant="secondary">Review</Button></Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
