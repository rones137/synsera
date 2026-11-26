"use client";

import Link from "next/link";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

const rules = [
  {
    title: "Duplicate entertainment?",
    detail: "Netflix + Showmax both active — review overlap. Confidence: probable.",
    tone: "warning" as const,
  },
  {
    title: "Price hike vs prior invoice",
    detail: "Adobe +KSh 700 vs last cycle. Deterministic delta — not an AI invention.",
    tone: "brand" as const,
  },
  {
    title: "Trial converting soon",
    detail: "Canva Pro trial ends Dec 3. No auto-action without your confirm.",
    tone: "neutral" as const,
  },
];

export default function AIDetectivePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="AI Detective"
        description="AI extracts signals. Deterministic rules own money, dates, and state. No invented savings."
        action={
          <div className="flex gap-2">
            <Link href="/app/receipts">
              <Button variant="secondary" size="sm">
                Upload receipt
              </Button>
            </Link>
            <Link href="/app/import">
              <Button size="sm">Import CSV</Button>
            </Link>
          </div>
        }
      />

      <div className="rounded-xl border border-border bg-bg-surface p-5 flex gap-3">
        <Sparkles className="text-brand shrink-0" size={20} />
        <div>
          <p className="font-medium">How Synsera uses AI</p>
          <p className="mt-1 text-sm text-text-secondary leading-relaxed">
            Extraction helps pull merchant, amount, and dates from receipts or statements.
            Status engines and forecasts stay rule-based. Suspected items need your
            confirmation before they become tracked truth.
          </p>
        </div>
      </div>

      <ul className="space-y-3">
        {rules.map((r) => (
          <li key={r.title} className="rounded-xl border border-border bg-bg-surface p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{r.title}</p>
                <p className="mt-1 text-sm text-text-secondary">{r.detail}</p>
              </div>
              <Badge tone={r.tone}>Signal</Badge>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
