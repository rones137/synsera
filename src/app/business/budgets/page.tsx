"use client";
import { PageHeader } from "@/components/app/page-header";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { BUSINESS_BUDGETS } from "@/lib/demo-data";
import { formatKES } from "@/lib/format";
export default function Page() {
  return (<div className="mx-auto max-w-6xl space-y-6"><PageHeader title="Budgets" description="Department spend vs limits." />
  <SimpleTable headers={["Department","Limit","Spent","Remaining"]}>{BUSINESS_BUDGETS.map(b=>(<tr key={b.id}><Td>{b.dept}</Td><Td>{formatKES(b.limit)}</Td><Td>{formatKES(b.spent)}</Td><Td right>{formatKES(b.limit-b.spent)}</Td></tr>))}</SimpleTable></div>);
}
