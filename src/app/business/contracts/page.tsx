"use client";
import { PageHeader } from "@/components/app/page-header";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { BUSINESS_CONTRACTS } from "@/lib/demo-data";
import { formatKES } from "@/lib/format";
export default function Page() {
  return (<div className="mx-auto max-w-6xl space-y-6"><PageHeader title="Contracts" description="Renewal dates and notice windows." />
  <SimpleTable headers={["Contract","Vendor","Renews","Notice","Value"]}>{BUSINESS_CONTRACTS.map(c=>(<tr key={c.id}><Td>{c.name}</Td><Td>{c.vendor}</Td><Td>{c.renews}</Td><Td>{c.noticeDays}d</Td><Td right>{formatKES(c.value)}</Td></tr>))}</SimpleTable></div>);
}
