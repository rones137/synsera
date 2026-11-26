"use client";

import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { useWorkspaceData } from "@/lib/workspace-store";
import { formatKES } from "@/lib/format";

export default function PaymentsPage() {
  const { invoices } = useWorkspaceData();
  const paid = invoices.filter((i) => i.status === "paid");
  const failed = invoices.filter((i) => i.status === "failed");
  const volume = paid.reduce((s, i) => s + i.amount, 0);
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Payments"
        description="Invoice statuses from checkout trials — adapters settle funds outside Synsera."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Settled volume"
          value={formatKES(volume)}
          emphasize
          hint="Paid invoices · KES"
        />
        <StatCard label="Paid" value={String(paid.length)} />
        <StatCard
          label="Failed"
          value={String(failed.length)}
          hint="Retry from Failed payments"
        />
      </div>
      {invoices.length === 0 ? (
        <EmptyState
          title="No invoices yet"
          description="Create a plan and run checkout to generate an open invoice."
          action={<Button href="/merchant/checkout">Open checkout</Button>}
        />
      ) : (
        <SimpleTable headers={["Invoice", "Customer", "Status", "Amount"]}>
          {invoices.map((i) => (
            <tr key={i.id}>
              <Td>{i.id}</Td>
              <Td>{i.customer}</Td>
              <Td className="capitalize">{i.status}</Td>
              <Td right>{formatKES(i.amount)}</Td>
            </tr>
          ))}
        </SimpleTable>
      )}
    </div>
  );
}
