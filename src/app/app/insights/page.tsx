"use client";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { useApp } from "@/lib/store";
import { useWorkspaceData } from "@/lib/workspace-store";
import { getDashboardStats, monthlyEquivalent } from "@/lib/demo-data";
import { formatKES } from "@/lib/format";
import { useEffect } from "react";

export default function InsightsPage() {
  const { expenses } = useApp();
  const { healthScore, recomputeHealth, emergencyMode, fxWatch } = useWorkspaceData();
  const personal = expenses.filter(e => e.workspace==="personal" && !["cancelled","archived"].includes(e.status));
  const stats = getDashboardStats(personal);
  const failed = personal.filter(e=>e.status==="failed").length;
  const trials = personal.filter(e=>e.status==="trial").length;
  const payday = 50000; // illustrative net payday
  const pressure = stats.next7;
  const leftover = payday - pressure;

  useEffect(() => {
    let score = 85;
    score -= failed * 12;
    score -= trials * 4;
    score -= personal.filter((e) => e.status === "price_changed").length * 5;
    if (emergencyMode) score -= 8;
    const next = Math.max(20, Math.min(98, score));
    queueMicrotask(() => recomputeHealth(next));
  }, [failed, trials, personal, emergencyMode, recomputeHealth]);

  const top = [...personal].sort((a,b)=>monthlyEquivalent(b)-monthlyEquivalent(a)).slice(0,5);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Insights" description="Health score, payday forecast, and spend patterns — deterministic maths." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Health score" value={`${healthScore}`} hint="0–100 · based on failures, trials, hikes" emphasize />
        <StatCard label="Payday forecast" value={formatKES(leftover)} hint={`After next-7 of ${formatKES(pressure)} vs ${formatKES(payday)} payday`} />
        <StatCard label="Annualized" value={formatKES(stats.annualized)} hint="Monthly × 12" />
        <StatCard label="Potential savings" value={formatKES(stats.potentialSavings)} estimate hint="Hypotheses only" />
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
      <section className="rounded-xl border border-border bg-bg-surface p-5">
        <h2 className="font-semibold mb-2">Currency watch</h2>
        <p className="text-xs text-text-secondary mb-4">
          Illustrative mid rates — useful when SaaS invoices land in foreign currency.
        </p>
        <ul className="space-y-3">
          {fxWatch.map((fx) => (
            <li key={fx.pair} className="flex justify-between text-sm border-b border-border/60 pb-3 last:border-0">
              <span>
                {fx.pair}
                <span className="block text-xs text-text-secondary">{fx.note}</span>
              </span>
              <span className="money font-semibold">{fx.rate.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
