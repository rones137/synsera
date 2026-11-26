"use client";
import { useState } from "react";
import { PageHeader } from "@/components/app/page-header";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { useWorkspaceData } from "@/lib/workspace-store";
import { formatKES } from "@/lib/format";

export default function VendorsPage() {
  const { vendors, addVendor } = useWorkspaceData();
  const [filter, setFilter] = useState("all");
  const [name, setName] = useState("");
  const [spend, setSpend] = useState(5000);
  const [category, setCategory] = useState("Software");
  const rows = filter==="all" ? vendors : vendors.filter(v=>v.category===filter);
  const cats = Array.from(new Set(vendors.map(v=>v.category)));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Vendors" description="Supplier directory — filter, add, track monthly spend." />
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={()=>setFilter("all")} className={`rounded-lg border px-3 py-1.5 text-xs ${filter==="all"?"border-brand text-brand bg-red-tint":"border-border"}`}>All</button>
        {cats.map(c=>(
          <button key={c} type="button" onClick={()=>setFilter(c)} className={`rounded-lg border px-3 py-1.5 text-xs ${filter===c?"border-brand text-brand bg-red-tint":"border-border"}`}>{c}</button>
        ))}
      </div>
      <form className="grid gap-3 rounded-xl border border-border bg-bg-surface p-4 sm:grid-cols-4" onSubmit={e=>{e.preventDefault(); if(!name) return; addVendor({name, category, spend, owner:"Ops"}); setName("");}}>
        <div><Label>Name</Label><Input value={name} onChange={e=>setName(e.target.value)} /></div>
        <div><Label>Category</Label><Select value={category} onChange={e=>setCategory(e.target.value)}><option>Software</option><option>Cloud</option><option>Telecom</option><option>Facilities</option></Select></div>
        <div><Label>Monthly KES</Label><Input type="number" className="money" value={spend} onChange={e=>setSpend(Number(e.target.value))} /></div>
        <Button type="submit" className="self-end">Add vendor</Button>
      </form>
      <SimpleTable headers={["Vendor","Category","Owner","Monthly"]}>
        {rows.map(v=>(<tr key={v.id}><Td>{v.name}</Td><Td>{v.category}</Td><Td>{v.owner}</Td><Td right>{formatKES(v.spend)}</Td></tr>))}
      </SimpleTable>
    </div>
  );
}
