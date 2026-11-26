"use client";
import { PageHeader } from "@/components/app/page-header";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { BUSINESS_PURCHASES } from "@/lib/demo-data";
import { formatKES } from "@/lib/format";
export default function Page() {
  return (<div className="mx-auto max-w-6xl space-y-6"><PageHeader title="Approvals" description="Pending and decided requests." />
  <SimpleTable headers={["Request","Requester","Status","Amount"]}>{BUSINESS_PURCHASES.map(p=>(<tr key={p.id}><Td>{p.title}</Td><Td>{p.requester}</Td><Td className="capitalize">{p.status}</Td><Td right>{formatKES(p.amount)}</Td></tr>))}</SimpleTable></div>);
}
