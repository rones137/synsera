"use client";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { useApp } from "@/lib/store";
import { getDashboardStats, monthlyEquivalent } from "@/lib/demo-data";
import { formatKES } from "@/lib/format";

export default function InsightsPage() {
  const { expenses } = useApp();
  const personal = expenses.filter((e) => e.workspace === "personal" && !["cancelled","archived"].includes(e.status));
  const stats = getDashboardStats(personal);
  const top = [...personal].sort((a,b)=>monthlyEquivalent(b)-monthlyEquivalent(a)).slice(0,5);
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Insights" description="Spend patterns and projections — deterministic maths on your tracked expenses." />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Annualized" value={formatKES(stats.annualized)} hint="Monthly × 12" emphasize />
        <StatCard label="Potential savings" value={formatKES(stats.potentialSavings)} estimate hint="Hypotheses only" />
        <StatCard label="Active items" value={String(personal.length)} hint="Personal workspace" />
      </div>
      <section className="rounded-xl border border-border bg-bg-surface p-5">
        <h2 className="font-semibold mb-4">Largest monthly commitments</h2>
        <ul className="space-y-3">
          {top.map(e => (
            <li key={e.id} className="flex justify-between text-sm border-b border-border/60 pb-3 last:border-0">
              <span>{e.name}</span>
              <span className="money font-semibold">{formatKES(monthlyEquivalent(e))}/mo</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
