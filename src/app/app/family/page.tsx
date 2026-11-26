"use client";

import { PageHeader } from "@/components/app/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Family"
        description="Share visibility with household members. Demo seats — invite flow ships with backend."
      />
      
      <div className="grid gap-4 sm:grid-cols-3">
        {["You (Owner)","Amina (Viewer)","Seat open"].map((m,i)=>(
          <div key={m} className="rounded-xl border border-border bg-bg-surface p-5">
            <p className="font-medium">{m}</p>
            <p className="text-xs text-text-secondary mt-1">{i===2?"Invite when ready":"Personal workspace"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
