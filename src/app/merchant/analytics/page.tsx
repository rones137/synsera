"use client";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { useWorkspaceData } from "@/lib/workspace-store";
import { formatKES } from "@/lib/format";

export default function MerchantAnalyticsPage() {
  const { customers, plans, invoices } = useWorkspaceData();
  const mrr = customers
    .filter((c) => c.status === "active" || c.status === "trialing")
    .reduce((s, c) => s + c.mrr, 0);
  const churnRisk = customers.filter((c) => c.status === "past_due" || c.status === "cancelled").length;
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Analytics" description="MRR and plan mix — deterministic demo maths." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="MRR" value={formatKES(mrr)} emphasize />
        <StatCard label="Customers" value={String(customers.length)} />
        <StatCard label="Active plans" value={String(plans.filter((p) => p.active).length)} />
        <StatCard label="At-risk" value={String(churnRisk)} hint="Past due + cancelled" />
      </div>
      <div className="rounded-xl border border-border bg-bg-surface p-5">
        <h2 className="font-semibold mb-3">Plan mix</h2>
        <ul className="space-y-2">
          {plans.map((p) => (
            <li key={p.id} className="flex justify-between text-sm border-b border-border/60 pb-2">
              <span>{p.name}</span>
              <span className="text-text-secondary">{p.subscribers} subs · {formatKES(p.price)}/mo</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-text-secondary">
          Invoice count: {invoices.length}. No payment processor called.
        </p>
      </div>
    </div>
  );
}
