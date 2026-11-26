"use client";
import { useState } from "react";
import { PageHeader } from "@/components/app/page-header";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { useWorkspaceData } from "@/lib/workspace-store";
import { formatKES } from "@/lib/format";

export default function CustomersPage() {
  const { customers, plans, addCustomer } = useWorkspaceData();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState(plans[0]?.name || "Starter");
  const [filter, setFilter] = useState("all");
  const rows = filter==="all"?customers:customers.filter(c=>c.status===filter);
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Customers" description="Merchant customer directory — filter and add (demo)." />
      <div className="flex flex-wrap gap-2">
        {["all","active","past_due","trialing","cancelled"].map(f=>(
          <button key={f} type="button" onClick={()=>setFilter(f)} className={`rounded-lg border px-3 py-1.5 text-xs capitalize ${filter===f?"border-brand text-brand bg-red-tint":"border-border"}`}>{f.replace("_"," ")}</button>
        ))}
      </div>
      <form className="grid gap-3 rounded-xl border border-border bg-bg-surface p-4 sm:grid-cols-4" onSubmit={e=>{e.preventDefault(); addCustomer(name, plan, email); setName(""); setEmail("");}}>
        <div><Label>Name</Label><Input value={name} onChange={e=>setName(e.target.value)} required /></div>
        <div><Label>Email</Label><Input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
        <div><Label>Plan</Label><Select value={plan} onChange={e=>setPlan(e.target.value)}>{plans.map(p=><option key={p.id}>{p.name}</option>)}</Select></div>
        <Button type="submit" className="self-end">Add customer</Button>
      </form>
      <SimpleTable headers={["Customer","Plan","Status","MRR"]}>
        {rows.map(c=>(<tr key={c.id}><Td><div>{c.name}<p className="text-xs text-text-secondary">{c.email}</p></div></Td><Td>{c.plan}</Td><Td>{c.status}</Td><Td right>{formatKES(c.mrr)}</Td></tr>))}
      </SimpleTable>
    </div>
  );
}
