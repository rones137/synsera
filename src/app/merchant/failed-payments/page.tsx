"use client";
import { PageHeader } from "@/components/app/page-header";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { Button } from "@/components/ui/button";
import { useWorkspaceData } from "@/lib/workspace-store";
import { formatKES } from "@/lib/format";

export default function FailedPaymentsPage() {
  const { invoices, retryInvoice } = useWorkspaceData();
  const rows = invoices.filter(i=>i.status==="failed");
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Failed payments" description="Retry demo — marks invoice paid locally. No real charges." />
      <SimpleTable headers={["Invoice","Customer","Status","Amount","Actions"]}>
        {rows.length===0 && <tr><Td>No failed payments</Td><Td>—</Td><Td>—</Td><Td right>—</Td><Td right>—</Td></tr>}
        {rows.map(i=>(
          <tr key={i.id}>
            <Td>{i.id}</Td><Td>{i.customer}</Td><Td>{i.status}</Td><Td right>{formatKES(i.amount)}</Td>
            <Td right><Button size="sm" onClick={()=>retryInvoice(i.id)}>Retry (demo)</Button></Td>
          </tr>
        ))}
      </SimpleTable>
    </div>
  );
}
