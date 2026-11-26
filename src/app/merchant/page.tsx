"use client";

import { useEffect } from "react";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { formatKES } from "@/lib/format";
import { useApp } from "@/lib/store";
import { useWorkspaceData } from "@/lib/workspace-store";
import { Store } from "lucide-react";

export default function MerchantOverviewPage() {
  const { setWorkspace } = useApp();
  const { customers, invoices, plans } = useWorkspaceData();
  useEffect(() => {
    setWorkspace("merchant");
  }, [setWorkspace]);

  const mrr = customers
    .filter((c) => c.status === "active" || c.status === "trialing")
    .reduce((s, c) => s + c.mrr, 0);
  const failed = invoices.filter((i) => i.status === "failed").length;
  const empty = customers.length === 0 && plans.length === 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Merchant overview"
        description="Synsera Billing — adapters only. No real charges, no card storage."
        action={
          <Button href="/merchant/plans" size="sm">
            Build a plan
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="MRR" value={formatKES(mrr)} emphasize hint="From your customers · KES" />
        <StatCard
          label="Active plans"
          value={String(plans.filter((p) => p.active).length)}
          hint="Published"
        />
        <StatCard label="Customers" value={String(customers.length)} hint="Merchant directory" />
        <StatCard label="Failed payments" value={String(failed)} hint="Needs retry" />
      </div>
      {empty ? (
        <EmptyState
          icon={<Store size={22} />}
          title="No billing data yet"
          description="Create a plan and run the checkout demo. Synsera never holds funds or raw cards."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button href="/merchant/plans" size="sm">
                Plan builder
              </Button>
              <Button href="/merchant/checkout" size="sm" variant="secondary">
                Checkout demo
              </Button>
            </div>
          }
        />
      ) : (
        <SimpleTable headers={["Customer", "Plan", "Status", "MRR"]}>
          {customers.map((c) => (
            <tr key={c.id}>
              <Td>{c.name}</Td>
              <Td>{c.plan}</Td>
              <Td>{c.status}</Td>
              <Td right>{formatKES(c.mrr)}</Td>
            </tr>
          ))}
        </SimpleTable>
      )}
    </div>
  );
}
