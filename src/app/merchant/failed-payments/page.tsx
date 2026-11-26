"use client";
import { PageHeader } from "@/components/app/page-header";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { MERCHANT_INVOICES } from "@/lib/demo-data";
import { formatKES } from "@/lib/format";
export default function Page() {
  const rows = MERCHANT_INVOICES.filter(i=>i.status==="failed");
  return (<div className="mx-auto max-w-6xl space-y-6"><PageHeader title="Failed payments" description="Retry and dunning demo queue." />
  <SimpleTable headers={["Invoice","Customer","Status","Amount"]}>{rows.map(i=>(<tr key={i.id}><Td>{i.id}</Td><Td>{i.customer}</Td><Td>{i.status}</Td><Td right>{formatKES(i.amount)}</Td></tr>))}</SimpleTable></div>);
}
