"use client";

import { PageHeader } from "@/components/app/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Integrations"
        description="Future connectors — email, CSV, receipts first. Never M-PESA PIN or bank passwords."
      />
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ["CSV import","Ready","/app/import"],
          ["Receipt upload","Ready","/app/receipts"],
          ["Email detection","Soon","#"],
          ["M-PESA (scoped)","Planned","#"],
          ["Bank CSV","Planned","#"],
          ["Calendar sync","Soon","#"],
        ].map(([n,s,h])=>(
          <a key={n} href={h} className="rounded-xl border border-border bg-bg-surface p-5 hover:border-brand/30 block">
            <p className="font-medium">{n}</p>
            <p className="text-xs text-text-secondary mt-1">{s}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
