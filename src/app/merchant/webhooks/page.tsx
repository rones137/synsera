"use client";
import { PageHeader } from "@/components/app/page-header";
import { SimpleTable, Td } from "@/components/app/simple-table";
export default function Page() {
  return (<div className="mx-auto max-w-6xl space-y-6"><PageHeader title="Webhooks" description="Endpoint demo list." />
  <SimpleTable headers={["Endpoint","Events","Status"]}><tr><Td>https://api.example.com/hooks/synsera</Td><Td>invoice.paid, payment.failed</Td><Td right>Active</Td></tr></SimpleTable></div>);
}
