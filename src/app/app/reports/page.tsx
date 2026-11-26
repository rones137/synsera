"use client";

import { PageHeader } from "@/components/app/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Reports"
        description="Exportable summaries of recurring spend. Demo export uses your local data."
      />
      
      <div className="space-y-3">
        <button type="button" className="w-full rounded-xl border border-border bg-bg-surface p-4 text-left hover:border-brand/30" onClick={()=>{
          const blob = new Blob([JSON.stringify({exportedAt:new Date().toISOString(),note:"Synsera demo export"},null,2)],{type:"application/json"});
          const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="synsera-report.json"; a.click();
        }}>
          <p className="font-medium">Download JSON summary</p>
          <p className="text-xs text-text-secondary mt-1">Includes metadata only in this demo click — full export in Settings</p>
        </button>
      </div>
    </div>
  );
}
