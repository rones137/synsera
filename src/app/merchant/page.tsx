"use client";

import { useEffect } from "react";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { Badge } from "@/components/ui/badge";
import {
  MERCHANT_CUSTOMERS,
  MERCHANT_INVOICES,
  MERCHANT_PLANS,
} from "@/lib/demo-data";
import { formatKES } from "@/lib/format";
import { useApp } from "@/lib/store";

export default function MerchantOverviewPage() {
  const { setWorkspace } = useApp();
  useEffect(() => {
    setWorkspace("merchant");
  }, [setWorkspace]);

  const mrr = MERCHANT_CUSTOMERS.reduce((s, c) => s + c.mrr, 0);
  const failed = MERCHANT_INVOICES.filter((i) => i.status === "failed").length;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Merchant overview"
        description="Billing demo — adapters only. No real payment processor, no card storage."
      />
      <Badge tone="sample">Demo billing UI · no live charges</Badge>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="MRR" value={formatKES(mrr)} emphasize hint="Illustrative · KES" />
        <StatCard label="Active plans" value={String(MERCHANT_PLANS.length)} hint="Published" />
        <StatCard
          label="Customers"
          value={String(MERCHANT_CUSTOMERS.length)}
          hint="Sample accounts"
        />
        <StatCard label="Failed payments" value={String(failed)} hint="Needs retry" />
      </div>
      <SimpleTable headers={["Customer", "Plan", "Status", "MRR"]}>
        {MERCHANT_CUSTOMERS.map((c) => (
          <tr key={c.id}>
            <Td>{c.name}</Td>
            <Td>{c.plan}</Td>
            <Td>{c.status}</Td>
            <Td right>{formatKES(c.mrr)}</Td>
          </tr>
        ))}
      </SimpleTable>
    </div>
  );
}
