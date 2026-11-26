"use client";

import { useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { Button } from "@/components/ui/button";
import {
  BUSINESS_BUDGETS,
  BUSINESS_PURCHASES,
  BUSINESS_VENDORS,
  DEMO_EXPENSES,
  getDashboardStats,
} from "@/lib/demo-data";
import { formatKES } from "@/lib/format";
import { useApp } from "@/lib/store";

export default function BusinessOverviewPage() {
  const { expenses, setWorkspace } = useApp();
  useEffect(() => {
    setWorkspace("business");
  }, [setWorkspace]);

  const biz = expenses.filter((e) => e.workspace === "business");
  const source = biz.length
    ? biz
    : DEMO_EXPENSES.filter((e) => e.workspace === "business");
  const stats = getDashboardStats(source);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Business overview"
        description="Freelancer & SME command centre — illustrative Kenya/KES demo."
        action={
          <Link href="/business/purchase-requests">
            <Button size="sm">New request</Button>
          </Link>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Monthly recurring"
          value={formatKES(stats.monthlyRecurring)}
          emphasize
          hint="Business · KES"
        />
        <StatCard
          label="Vendors"
          value={String(BUSINESS_VENDORS.length)}
          hint="Active suppliers"
        />
        <StatCard
          label="Pending approvals"
          value={String(
            BUSINESS_PURCHASES.filter((p) => p.status === "pending").length,
          )}
          hint="Purchase requests"
        />
        <StatCard
          label="Budget remaining"
          value={formatKES(
            BUSINESS_BUDGETS.reduce((s, b) => s + (b.limit - b.spent), 0),
          )}
          hint="Across departments"
        />
      </div>
      <SimpleTable headers={["Vendor", "Category", "Owner", "Monthly"]}>
        {BUSINESS_VENDORS.slice(0, 5).map((v) => (
          <tr key={v.id}>
            <Td>{v.name}</Td>
            <Td>{v.category}</Td>
            <Td>{v.owner}</Td>
            <Td right>{formatKES(v.spend)}</Td>
          </tr>
        ))}
      </SimpleTable>
    </div>
  );
}
