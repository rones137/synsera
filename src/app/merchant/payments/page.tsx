"use client";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { useWorkspaceData } from "@/lib/workspace-store";
import { formatKES } from "@/lib/format";

export default function PaymentsPage() {
  const { invoices } = useWorkspaceData();
  const paid = invoices.filter((i) => i.status === "paid");
  const failed = invoices.filter((i) => i.status === "failed");
  const volume = paid.reduce((s, i) => s + i.amount, 0);
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Payments" description="Adapter settlements — illustrative only." />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Settled volume" value={formatKES(volume)} emphasize hint="Paid invoices" />
        <StatCard label="Paid" value={String(paid.length)} />
        <StatCard label="Failed" value={String(failed.length)} hint="Open Failed payments to retry" />
      </div>
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
    </div>
  );
}
