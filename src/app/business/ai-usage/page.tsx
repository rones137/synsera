"use client";

import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Brain } from "lucide-react";

export default function AIUsagePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="AI usage"
        description="AI/API cost monitoring for the company — meters appear when extraction jobs run."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="This month" value="KSh 0" emphasize hint="KES · no jobs yet" />
        <StatCard label="Jobs" value="0" hint="Extractions run" />
        <StatCard label="Budget" value="—" hint="Set a soft cap when you connect billing" />
      </div>
      <EmptyState
        icon={<Brain size={22} />}
        title="No AI usage yet"
        description="Usage rows will appear when receipt OCR, contract parse, or extraction jobs execute. Nothing is fabricated."
      />
    </div>
  );
}
