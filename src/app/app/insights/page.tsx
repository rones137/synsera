"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useApp } from "@/lib/store";
import { useWorkspaceData } from "@/lib/workspace-store";
import { getDashboardStats, monthlyEquivalent } from "@/lib/demo-data";
import { formatKES } from "@/lib/format";
import { PieChart } from "lucide-react";

const PAYDAY_KEY = "synsera-payday-kes";

export default function InsightsPage() {
  const { expenses } = useApp();
  const { healthScore, recomputeHealth, emergencyMode, fxWatch } = useWorkspaceData();
  const personal = expenses.filter(
    (e) => e.workspace === "personal" && !["cancelled", "archived"].includes(e.status),
  );
  const stats = getDashboardStats(personal);
  const failed = personal.filter((e) => e.status === "failed").length;
  const trials = personal.filter((e) => e.status === "trial").length;
  const [payday, setPayday] = useState(0);
  const pressure = stats.next7;
  const leftover = payday - pressure;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PAYDAY_KEY);
      if (raw) setPayday(Number(raw) || 0);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    let score = personal.length === 0 ? 100 : 85;
    score -= failed * 12;
    score -= trials * 4;
    score -= personal.filter((e) => e.status === "price_changed").length * 5;
    if (emergencyMode) score -= 8;
    const next = Math.max(0, Math.min(100, score));
    queueMicrotask(() => recomputeHealth(next));
  }, [failed, trials, personal, emergencyMode, recomputeHealth]);

  const top = [...personal]
    .sort((a, b) => monthlyEquivalent(b) - monthlyEquivalent(a))
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Insights"
        description="Health score, payday forecast, and spend patterns — from your data only."
      />
      <div className="rounded-xl border border-border bg-bg-surface p-4 max-w-sm">
        <Label htmlFor="payday">Net payday (KES)</Label>
        <Input
          id="payday"
          type="number"
          min={0}
          className="money mt-1"
          value={payday || ""}
          placeholder="0"
          onChange={(e) => {
            const v = Number(e.target.value) || 0;
            setPayday(v);
            try {
              localStorage.setItem(PAYDAY_KEY, String(v));
            } catch {
              /* ignore */
            }
          }}
        />
        <p className="mt-1 text-xs text-text-secondary">
          Set your take-home to forecast leftover after next-7 renewals. Not prefilled.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Health score"
          value={`${healthScore}`}
          hint="0–100 · failures, trials, hikes"
          emphasize
        />
        <StatCard
          label="Payday forecast"
          value={formatKES(leftover)}
          hint={
            payday
              ? `After next-7 of ${formatKES(pressure)} vs ${formatKES(payday)} payday`
              : "Set payday above to forecast"
          }
        />
        <StatCard label="Annualized" value={formatKES(stats.annualized)} hint="Monthly × 12" />
        <StatCard
          label="Potential savings"
          value={formatKES(stats.potentialSavings)}
          estimate
          hint="From trials / pending cancels / hikes"
        />
      </div>
      {personal.length === 0 ? (
        <EmptyState
          icon={<PieChart size={22} />}
          title="No spend to analyse"
          description="Add expenses to unlock health score drivers and payday pressure."
          action={<Button href="/app/expenses/new" size="sm">Add expense</Button>}
        />
      ) : (
        <section className="rounded-xl border border-border bg-bg-surface p-5">
          <h2 className="font-semibold mb-4">Largest monthly commitments</h2>
          <ul className="space-y-3">
            {top.map((e) => (
              <li
                key={e.id}
                className="flex justify-between text-sm border-b border-border/60 pb-3 last:border-0"
              >
                <span>{e.name}</span>
                <span className="money font-semibold">
                  {formatKES(monthlyEquivalent(e))}/mo
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className="rounded-xl border border-border bg-bg-surface p-5">
        <h2 className="font-semibold mb-2">Currency watch</h2>
        {fxWatch.length === 0 ? (
          <p className="text-sm text-text-secondary">
            No FX pairs tracked yet. Add foreign-currency SaaS invoices later — nothing is pre-seeded.
          </p>
        ) : (
          <ul className="space-y-3 mt-4">
            {fxWatch.map((fx) => (
              <li
                key={fx.pair}
                className="flex justify-between text-sm border-b border-border/60 pb-3 last:border-0"
              >
                <span>
                  {fx.pair}
                  <span className="block text-xs text-text-secondary">{fx.note}</span>
                </span>
                <span className="money font-semibold">{fx.rate.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
