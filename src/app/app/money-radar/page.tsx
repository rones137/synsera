"use client";

import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/badge";
import { useApp } from "@/lib/store";
import { getDashboardStats, monthlyEquivalent } from "@/lib/demo-data";
import { formatKES } from "@/lib/format";

export default function MoneyRadarPage() {
  const { expenses } = useApp();
  const personal = expenses.filter(
    (e) => e.workspace === "personal" && e.status !== "archived",
  );
  const stats = getDashboardStats(personal);
  const suspected = personal.filter((e) => !e.confirmed);
  const byCat: Record<string, number> = {};
  for (const e of personal) {
    byCat[e.category] = (byCat[e.category] || 0) + monthlyEquivalent(e);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Money Radar"
        description="Confirmed vs suspected recurring — a unified scan across your commitments."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Tracked monthly"
          value={formatKES(stats.monthlyRecurring)}
          hint="Confirmed + active · KES"
          emphasize
        />
        <StatCard
          label="Suspected"
          value={String(suspected.length)}
          hint="Needs your confirmation"
        />
        <StatCard
          label="Categories"
          value={String(Object.keys(byCat).length)}
          hint="Spend clusters"
        />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-bg-surface p-5">
          <h2 className="mb-4 text-[15px] font-semibold">By category</h2>
          <ul className="space-y-3">
            {Object.entries(byCat)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, amt]) => (
                <li key={cat} className="flex items-center justify-between text-sm">
                  <span>{cat}</span>
                  <span className="money font-semibold">{formatKES(amt)}</span>
                </li>
              ))}
          </ul>
        </section>
        <section className="rounded-xl border border-border bg-bg-surface p-5">
          <h2 className="mb-4 text-[15px] font-semibold">Needs attention</h2>
          <ul className="space-y-3">
            {personal
              .filter((e) =>
                ["failed", "price_changed", "trial", "cancellation_pending"].includes(
                  e.status,
                ),
              )
              .map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="truncate">{e.name}</span>
                  <StatusBadge status={e.status} />
                </li>
              ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
