"use client";

import { useEffect } from "react";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { getDashboardStats } from "@/lib/demo-data";
import { formatKES } from "@/lib/format";
import { useApp } from "@/lib/store";
import { useWorkspaceData } from "@/lib/workspace-store";
import { Building2 } from "lucide-react";

export default function BusinessOverviewPage() {
  const { expenses, setWorkspace } = useApp();
  const { vendors, purchases, budgets } = useWorkspaceData();
  useEffect(() => {
    setWorkspace("business");
  }, [setWorkspace]);

  const biz = expenses.filter((e) => e.workspace === "business");
  const stats = getDashboardStats(biz);
  const pending = purchases.filter((p) => p.status === "pending").length;
  const budgetLeft = budgets.reduce((s, b) => s + (b.limit - b.spent), 0);
  const empty = biz.length === 0 && vendors.length === 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Business overview"
        description="Freelancer & SME command centre — add vendors, expenses, and approvals."
        action={
          <Button href="/business/purchase-requests" size="sm">
            New request
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Monthly recurring"
          value={formatKES(stats.monthlyRecurring)}
          emphasize
          hint="Business · KES"
        />
        <StatCard label="Vendors" value={String(vendors.length)} hint="Active suppliers" />
        <StatCard label="Pending approvals" value={String(pending)} hint="Purchase requests" />
        <StatCard
          label="Budget remaining"
          value={formatKES(budgetLeft)}
          hint={budgets.length ? "Across departments" : "Add budgets to track"}
        />
      </div>
      {empty ? (
        <EmptyState
          icon={<Building2 size={22} />}
          title="No business data yet"
          description="Add a vendor or business expense to start your Synsera Business workspace. Nothing is pre-seeded."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button href="/business/vendors" size="sm">
                Add vendor
              </Button>
              <Button href="/business/expenses" size="sm" variant="secondary">
                Business expenses
              </Button>
            </div>
          }
        />
      ) : (
        <SimpleTable headers={["Vendor", "Category", "Owner", "Monthly"]}>
          {vendors.length === 0 ? (
            <tr>
              <Td>No vendors yet</Td>
              <Td>—</Td>
              <Td>—</Td>
              <Td right>—</Td>
            </tr>
          ) : (
            vendors.slice(0, 8).map((v) => (
              <tr key={v.id}>
                <Td>{v.name}</Td>
                <Td>{v.category}</Td>
                <Td>{v.owner}</Td>
                <Td right>{formatKES(v.spend)}</Td>
              </tr>
            ))
          )}
        </SimpleTable>
      )}
    </div>
  );
}
