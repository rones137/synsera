"use client";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { formatKES } from "@/lib/format";

const ideas = [
  { title: "Showmax cancel verification", amount: 720, note: "Cancellation pending — confirm with merchant" },
  { title: "Canva trial decision", amount: 1500, note: "Trial ends Dec 3 — keep or drop" },
  { title: "Adobe price review", amount: 700, note: "Delta vs prior plan — estimate only" },
];

export default function SavingsPage() {
  const total = ideas.reduce((s,i)=>s+i.amount,0);
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Savings Vault" description="Potential recoveries labelled as estimates — never invented auto-savings." />
      <div className="rounded-xl border border-brand/30 bg-red-tint/40 p-6">
        <Badge tone="sample">Estimate</Badge>
        <p className="money mt-3 text-3xl font-semibold text-brand">{formatKES(total)}</p>
        <p className="mt-1 text-sm text-text-secondary">Illustrative monthly opportunity across open actions</p>
      </div>
      <ul className="space-y-3">
        {ideas.map(i => (
          <li key={i.title} className="rounded-xl border border-border bg-bg-surface p-4 flex justify-between gap-4">
            <div>
              <p className="font-medium">{i.title}</p>
              <p className="text-xs text-text-secondary mt-1">{i.note}</p>
            </div>
            <p className="money font-semibold">{formatKES(i.amount)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
