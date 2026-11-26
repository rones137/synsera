"use client";
import { PageHeader } from "@/components/app/page-header";
import { useWorkspaceData } from "@/lib/workspace-store";
import { formatKES } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

export default function BusinessCalendarPage() {
  const { contracts } = useWorkspaceData();
  const sorted = [...contracts].sort((a, b) => a.renews.localeCompare(b.renews));
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Renewal calendar" description="Upcoming contract renewals and notice windows." />
      <ul className="space-y-3">
        {sorted.map((c) => (
          <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-bg-surface p-4">
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-xs text-text-secondary mt-1">
                {c.vendor} · renews {c.renews} · {c.noticeDays}d notice
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge tone={c.status === "notice_window" ? "warning" : "neutral"}>
                {c.status.replace("_", " ")}
              </Badge>
              <span className="money text-sm font-semibold">{formatKES(c.value)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
