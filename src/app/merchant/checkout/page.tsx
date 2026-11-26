"use client";
import { useState } from "react";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWorkspaceData } from "@/lib/workspace-store";
import { formatKES } from "@/lib/format";

export default function CheckoutPage() {
  const { plans, addCustomer } = useWorkspaceData();
  const [picked, setPicked] = useState(plans.find(p=>p.name==="Growth")?.id || plans[0]?.id);
  const [done, setDone] = useState(false);
  const plan = plans.find(p=>p.id===picked);
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Checkout" description="Hosted checkout preview — adapters only, never holds funds or raw cards." />
      <div className="grid gap-4 sm:grid-cols-3">
        {plans.filter(p=>p.active).map(p=>(
          <button key={p.id} type="button" onClick={()=>setPicked(p.id)} className={`rounded-xl border p-5 text-left ${picked===p.id?"border-brand bg-red-tint/40":"border-border bg-bg-surface"}`}>
            <p className="font-medium">{p.name}</p>
            <p className="money mt-2 text-2xl font-semibold">{formatKES(p.price)}<span className="text-sm text-text-secondary">/mo</span></p>
          </button>
        ))}
      </div>
      <div className="rounded-xl border border-border bg-bg-surface p-8 max-w-md">
        <Badge tone="sample" className="mb-4">Demo checkout · no real charges</Badge>
        <h2 className="text-xl font-semibold">{plan?.name} plan</h2>
        <p className="money text-3xl font-semibold mt-2">{formatKES(plan?.price||0)}<span className="text-sm text-text-secondary">/mo</span></p>
        {!done ? (
          <Button className="mt-6 w-full" onClick={()=>{addCustomer("Demo checkout customer", plan?.name||"Starter", "demo@synsera.app"); setDone(true);}}>
            Subscribe (demo)
          </Button>
        ) : (
          <p className="mt-6 text-sm text-success">Demo subscription created under Customers. No payment processor called.</p>
        )}
        <p className="mt-3 text-xs text-text-secondary">Synsera never stores raw cards or holds funds.</p>
      </div>
    </div>
  );
}
