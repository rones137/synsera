"use client";
import { PageHeader } from "@/components/app/page-header";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { Button } from "@/components/ui/button";
import { useWorkspaceData } from "@/lib/workspace-store";
import { formatKES } from "@/lib/format";

export default function InvoicesPage() {
  const { invoices, retryInvoice } = useWorkspaceData();
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Invoices" description="Issued invoices — retry failed ones in-demo." />
      <SimpleTable headers={["Invoice", "Customer", "Status", "Amount", "Actions"]}>
        {invoices.map((i) => (
          <tr key={i.id}>
            <Td>{i.id}</Td>
            <Td>{i.customer}</Td>
            <Td className="capitalize">{i.status}</Td>
            <Td right>{formatKES(i.amount)}</Td>
            <Td right>
              {i.status === "failed" ? (
                <Button size="sm" onClick={() => retryInvoice(i.id)}>
                  Mark paid (demo)
                </Button>
              ) : (
                "—"
              )}
            </Td>
          </tr>
        ))}
      </SimpleTable>
    </div>
  );
}
