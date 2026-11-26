"use client";
import { PageHeader } from "@/components/app/page-header";
import { useWorkspaceData } from "@/lib/workspace-store";
import { formatShortDate } from "@/lib/format";

export default function AuditPage() {
  const { audit } = useWorkspaceData();
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Audit log" description="Who changed what — updates as you approve/reclaim." />
      <ul className="divide-y divide-border rounded-xl border border-border bg-bg-surface">
        {audit.map(a => (
          <li key={a.id} className="flex justify-between gap-4 px-5 py-3.5 text-sm">
            <div><p className="font-medium">{a.action}</p><p className="text-xs text-text-secondary">{a.actor}</p></div>
            <time className="text-xs text-text-secondary">{formatShortDate(a.at)}</time>
          </li>
        ))}
      </ul>
    </div>
  );
}
