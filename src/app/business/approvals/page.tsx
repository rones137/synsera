"use client";
import { useState } from "react";
import { PageHeader } from "@/components/app/page-header";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useWorkspaceData } from "@/lib/workspace-store";
import { formatKES } from "@/lib/format";

export default function ApprovalsPage() {
  const { purchases, decidePurchase, addPurchase } = useWorkspaceData();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(3000);
  const pending = purchases.filter(p=>p.status==="pending");

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Approvals" description="Approve or reject purchase requests — decisions persist locally." />
      <form className="flex flex-wrap gap-3 rounded-xl border border-border bg-bg-surface p-4" onSubmit={e=>{e.preventDefault(); if(!title) return; addPurchase(title, amount, "Blaise"); setTitle("");}}>
        <div><Label>New request</Label><Input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Tool name" /></div>
        <div><Label>Amount KES</Label><Input type="number" className="money" value={amount} onChange={e=>setAmount(Number(e.target.value))} /></div>
        <Button type="submit" className="self-end">Submit</Button>
      </form>
      <p className="text-sm text-text-secondary">{pending.length} pending</p>
      <SimpleTable headers={["Request","Requester","Status","Amount","Actions"]}>
        {purchases.map(p => (
          <tr key={p.id}>
            <Td>{p.title}</Td>
            <Td>{p.requester}</Td>
            <Td className="capitalize">{p.status}</Td>
            <Td right>{formatKES(p.amount)}</Td>
            <Td right>
              {p.status==="pending" ? (
                <span className="inline-flex gap-2">
                  <Button size="sm" onClick={()=>decidePurchase(p.id,"approved")}>Approve</Button>
                  <Button size="sm" variant="danger" onClick={()=>decidePurchase(p.id,"rejected","Not now")}>Reject</Button>
                </span>
              ) : "—"}
            </Td>
          </tr>
        ))}
      </SimpleTable>
    </div>
  );
}
