"use client";
import { PageHeader } from "@/components/app/page-header";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { formatKES } from "@/lib/format";
export default function Page() {
  return (<div className="mx-auto max-w-6xl space-y-6"><PageHeader title="Discounts" description="Coupons and promo codes." />
  <SimpleTable headers={["Code","Type","Value","Uses"]}><tr><Td>LAUNCH20</Td><Td>Percent</Td><Td>20%</Td><Td right>42</Td></tr><tr><Td>KEFOUNDER</Td><Td>Fixed</Td><Td>{formatKES(500)}</Td><Td right>18</Td></tr></SimpleTable></div>);
}
