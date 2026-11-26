"use client";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { useWorkspaceData } from "@/lib/workspace-store";
import { formatKES } from "@/lib/format";

export default function BusinessAnalyticsPage() {
  const { vendors, budgets, licenses, purchases } = useWorkspaceData();
  const spend = vendors.reduce((s, v) => s + v.spend, 0);
  const waste = licenses.reduce((s, l) => s + l.waste, 0);
  const pending = purchases.filter((p) => p.status === "pending").length;
  const budgetUsed = budgets.reduce((s, b) => s + b.spent, 0);
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Analytics" description="Vendor spend, license waste, and approval load." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Vendor MRR" value={formatKES(spend)} emphasize />
        <StatCard label="Budget used" value={formatKES(budgetUsed)} />
        <StatCard label="Seat waste" value={String(waste)} hint="Reclaim in Licenses" />
        <StatCard label="Pending approvals" value={String(pending)} />
      </div>
    </div>
  );
}
