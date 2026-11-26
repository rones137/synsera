"use client";
import { PageHeader } from "@/components/app/page-header";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { MERCHANT_INVOICES } from "@/lib/demo-data";
import { formatKES } from "@/lib/format";
export default function Page() {
  return (<div className="mx-auto max-w-6xl space-y-6"><PageHeader title="Invoices" description="Issued invoices — demo statuses." />
  <SimpleTable headers={["Invoice","Customer","Status","Amount"]}>{MERCHANT_INVOICES.map(i=>(<tr key={i.id}><Td>{i.id}</Td><Td>{i.customer}</Td><Td>{i.status}</Td><Td right>{formatKES(i.amount)}</Td></tr>))}</SimpleTable></div>);
}
