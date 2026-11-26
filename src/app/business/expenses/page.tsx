"use client";
import { PageHeader } from "@/components/app/page-header";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { DEMO_EXPENSES } from "@/lib/demo-data";
import { formatKES } from "@/lib/format";
export default function Page() {
  const rows = DEMO_EXPENSES.filter(e => e.workspace==="business");
  return (<div className="mx-auto max-w-6xl space-y-6"><PageHeader title="Business expenses" description="Company recurring spend." />
  <SimpleTable headers={["Name","Category","Status","Amount"]}>{rows.map(e=>(<tr key={e.id}><Td>{e.name}</Td><Td>{e.category}</Td><Td>{e.status}</Td><Td right>{formatKES(e.amount)}</Td></tr>))}</SimpleTable></div>);
}
