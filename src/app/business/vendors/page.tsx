"use client";
import { PageHeader } from "@/components/app/page-header";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { BUSINESS_VENDORS } from "@/lib/demo-data";
import { formatKES } from "@/lib/format";
export default function Page() {
  return (<div className="mx-auto max-w-6xl space-y-6"><PageHeader title="Vendors" description="Supplier directory with monthly spend." />
  <SimpleTable headers={["Vendor","Category","Owner","Monthly"]}>{BUSINESS_VENDORS.map(v=>(<tr key={v.id}><Td>{v.name}</Td><Td>{v.category}</Td><Td>{v.owner}</Td><Td right>{formatKES(v.spend)}</Td></tr>))}</SimpleTable></div>);
}
