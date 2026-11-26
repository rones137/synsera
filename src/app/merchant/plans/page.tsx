"use client";
import { PageHeader } from "@/components/app/page-header";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { MERCHANT_PLANS } from "@/lib/demo-data";
import { formatKES } from "@/lib/format";
export default function Page() {
  return (<div className="mx-auto max-w-6xl space-y-6"><PageHeader title="Plans" description="Subscription plans you offer customers." />
  <SimpleTable headers={["Plan","Price","Subscribers","Status"]}>{MERCHANT_PLANS.map(p=>(<tr key={p.id}><Td>{p.name}</Td><Td>{formatKES(p.price)}/{p.interval}</Td><Td>{p.subscribers}</Td><Td right>{p.active?"Active":"Off"}</Td></tr>))}</SimpleTable></div>);
}
