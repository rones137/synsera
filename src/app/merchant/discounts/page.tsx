"use client";
import { useState } from "react";
import { PageHeader } from "@/components/app/page-header";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { useWorkspaceData } from "@/lib/workspace-store";
import { formatKES } from "@/lib/format";

export default function DiscountsPage() {
  const { discounts, addDiscount } = useWorkspaceData();
  const [code, setCode] = useState("");
  const [type, setType] = useState<"percent" | "fixed">("percent");
  const [value, setValue] = useState(10);
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Discounts" description="Coupons and promo codes." />
      <form className="flex flex-wrap gap-3 rounded-xl border border-border bg-bg-surface p-4" onSubmit={e=>{e.preventDefault(); addDiscount(code.toUpperCase(), type, value); setCode("");}}>
        <div><Label>Code</Label><Input value={code} onChange={e=>setCode(e.target.value)} required /></div>
        <div><Label>Type</Label><Select value={type} onChange={e=>setType(e.target.value as "percent" | "fixed")}><option value="percent">Percent</option><option value="fixed">Fixed KES</option></Select></div>
        <div><Label>Value</Label><Input type="number" value={value} onChange={e=>setValue(Number(e.target.value))} /></div>
        <Button type="submit" className="self-end">Add</Button>
      </form>
      <SimpleTable headers={["Code","Type","Value","Uses","Active"]}>
        {discounts.map(d=>(
          <tr key={d.id}><Td>{d.code}</Td><Td>{d.type}</Td><Td>{d.type==="percent"?`${d.value}%`:formatKES(d.value)}</Td><Td>{d.uses}</Td><Td right>{d.active?"Yes":"No"}</Td></tr>
        ))}
      </SimpleTable>
    </div>
  );
}
