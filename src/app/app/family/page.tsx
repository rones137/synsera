"use client";
import { useState } from "react";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useWorkspaceData } from "@/lib/workspace-store";
import { formatKES } from "@/lib/format";
import { useApp } from "@/lib/store";
import { getDashboardStats } from "@/lib/demo-data";

export default function FamilyPage() {
  const { familyMembers, inviteFamily, removeFamily } = useWorkspaceData();
  const { expenses } = useApp();
  const [name, setName] = useState("");
  const personal = expenses.filter(e => e.workspace==="personal" && !["cancelled","archived"].includes(e.status));
  const stats = getDashboardStats(personal);
  const share = familyMembers.length ? Math.round(stats.monthlyRecurring / familyMembers.length) : 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Family" description="Share visibility and split recurring bills across household members." />
      <div className="rounded-xl border border-border bg-bg-surface p-5">
        <p className="text-sm text-text-secondary">Suggested equal split of monthly recurring</p>
        <p className="money mt-2 text-2xl font-semibold">{formatKES(share)} <span className="text-sm font-normal text-text-secondary">/ person</span></p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {familyMembers.map(m => (
          <div key={m.id} className="rounded-xl border border-border bg-bg-surface p-5">
            <p className="font-medium">{m.name}</p>
            <p className="text-xs text-text-secondary mt-1">{m.role}</p>
            {m.role !== "Owner" && (
              <Button size="sm" variant="ghost" className="mt-3" onClick={() => removeFamily(m.id)}>Remove</Button>
            )}
          </div>
        ))}
      </div>
      <form className="flex flex-wrap gap-2 rounded-xl border border-border bg-bg-surface p-4" onSubmit={(e)=>{e.preventDefault(); if(!name.trim()) return; inviteFamily(name.trim()); setName("");}}>
        <div className="flex-1 min-w-[180px]">
          <Label htmlFor="invite">Invite member</Label>
          <Input id="invite" value={name} onChange={e=>setName(e.target.value)} placeholder="Name" />
        </div>
        <Button type="submit" className="self-end">Invite</Button>
      </form>
    </div>
  );
}
