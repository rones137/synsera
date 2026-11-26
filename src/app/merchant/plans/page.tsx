"use client";
import { useState } from "react";
import { PageHeader } from "@/components/app/page-header";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useWorkspaceData } from "@/lib/workspace-store";
import { formatKES } from "@/lib/format";

export default function PlansPage() {
  const { plans, addPlan, togglePlan } = useWorkspaceData();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(1499);
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Plans" description="Plan builder — create and activate/deactivate. Demo only." />
      <form className="flex flex-wrap gap-3 rounded-xl border border-border bg-bg-surface p-4" onSubmit={e=>{e.preventDefault(); addPlan(name, price); setName("");}}>
        <div><Label>Plan name</Label><Input value={name} onChange={e=>setName(e.target.value)} required /></div>
        <div><Label>Price KES/mo</Label><Input type="number" className="money" value={price} onChange={e=>setPrice(Number(e.target.value))} /></div>
        <Button type="submit" className="self-end">Add plan</Button>
      </form>
      <SimpleTable headers={["Plan","Price","Subscribers","Status","Actions"]}>
        {plans.map(p=>(
          <tr key={p.id}>
            <Td>{p.name}</Td>
            <Td>{formatKES(p.price)}/{p.interval}</Td>
            <Td>{p.subscribers}</Td>
            <Td>{p.active?"Active":"Off"}</Td>
            <Td right><Button size="sm" variant="secondary" onClick={()=>togglePlan(p.id)}>{p.active?"Deactivate":"Activate"}</Button></Td>
          </tr>
        ))}
      </SimpleTable>
    </div>
  );
}
