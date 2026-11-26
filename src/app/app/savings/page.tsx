"use client";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatKES } from "@/lib/format";
import { useWorkspaceData } from "@/lib/workspace-store";
import { useApp } from "@/lib/store";
import { monthlyEquivalent } from "@/lib/demo-data";
import Link from "next/link";

export default function SavingsPage() {
  const { graveyard, emergencyMode, setEmergencyMode } = useWorkspaceData();
  const { expenses, requestCancelExpense } = useApp();
  const personal = expenses.filter(e => e.workspace==="personal" && !["cancelled","archived"].includes(e.status));
  const ideas = personal.filter(e => ["cancellation_pending","trial","price_changed"].includes(e.status));
  const est = ideas.reduce((s,e)=>s+monthlyEquivalent(e),0);
  const graveyardTotal = graveyard.reduce((s,g)=>s+g.amount,0);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Savings Vault" description="Estimates, emergency pause signals, and Subscription Graveyard."
        action={<Button variant={emergencyMode?"danger":"secondary"} size="sm" onClick={()=>setEmergencyMode(!emergencyMode)}>{emergencyMode?"Exit emergency mode":"Emergency mode"}</Button>} />
      {emergencyMode && (
        <div className="rounded-xl border border-brand bg-red-tint p-4 text-sm text-brand">
          Emergency mode on — prioritise failed payments and near renewals. No auto-cancels.
        </div>
      )}
      <div className="rounded-xl border border-brand/30 bg-red-tint/40 p-6">
        <Badge tone="sample">Estimate</Badge>
        <p className="money mt-3 text-3xl font-semibold text-brand">{formatKES(est)}</p>
        <p className="mt-1 text-sm text-text-secondary">Open actions this month</p>
      </div>
      <section className="space-y-3">
        <h2 className="font-semibold">Open opportunities</h2>
        {ideas.map(e => (
          <div key={e.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-bg-surface p-4">
            <div>
              <p className="font-medium">{e.name}</p>
              <p className="text-xs text-text-secondary">{e.status.replaceAll("_"," ")} · {formatKES(monthlyEquivalent(e))}/mo</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/app/subscriptions/${e.id}`}><Button size="sm" variant="secondary">Open</Button></Link>
              {e.status !== "cancellation_pending" && e.status !== "cancelled" && (
                <Link href={`/app/subscriptions/${e.id}`}>
                  <Button size="sm" variant="danger" onClick={() => requestCancelExpense(e.id)}>
                    Open cancel assistant
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </section>
      <section className="space-y-3">
        <h2 className="font-semibold">Subscription Graveyard</h2>
        <p className="text-sm text-text-secondary">Confirmed cancellations &amp; retired spend · {formatKES(graveyardTotal)} historical</p>
        <ul className="space-y-2">
          {graveyard.map(g => (
            <li key={g.id} className="flex justify-between rounded-lg border border-border bg-bg-surface px-4 py-3 text-sm">
              <span>{g.name}</span>
              <span className="text-text-secondary">{g.cancelledAt}</span>
              <span className="money font-medium">{formatKES(g.amount)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
