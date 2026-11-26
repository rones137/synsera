"use client";
import { PageHeader } from "@/components/app/page-header";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { BUSINESS_LICENSES } from "@/lib/demo-data";
export default function Page() {
  return (<div className="mx-auto max-w-6xl space-y-6"><PageHeader title="Licenses" description="Seat utilisation and waste signals." />
  <SimpleTable headers={["License","Total","Used","Waste"]}>{BUSINESS_LICENSES.map(l=>(<tr key={l.id}><Td>{l.name}</Td><Td>{l.total}</Td><Td>{l.used}</Td><Td right>{l.waste}</Td></tr>))}</SimpleTable></div>);
}
