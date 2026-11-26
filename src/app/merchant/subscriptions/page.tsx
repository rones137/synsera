"use client";
import { PageHeader } from "@/components/app/page-header";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { MERCHANT_CUSTOMERS } from "@/lib/demo-data";
import { formatKES } from "@/lib/format";
export default function Page() {
  return (<div className="mx-auto max-w-6xl space-y-6"><PageHeader title="Subscriptions" description="Active customer subscriptions." />
  <SimpleTable headers={["Customer","Plan","Status","MRR"]}>{MERCHANT_CUSTOMERS.map(c=>(<tr key={c.id}><Td>{c.name}</Td><Td>{c.plan}</Td><Td>{c.status}</Td><Td right>{formatKES(c.mrr)}</Td></tr>))}</SimpleTable></div>);
}
