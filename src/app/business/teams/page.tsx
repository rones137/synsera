"use client";
import { PageHeader } from "@/components/app/page-header";
import { useWorkspaceData } from "@/lib/workspace-store";

export default function TeamsPage() {
  const { teams } = useWorkspaceData();
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Teams" description="Departments and owners." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {teams.map(t => (
          <div key={t.id} className="rounded-xl border border-border bg-bg-surface p-5">
            <p className="font-medium">{t.name}</p>
            <p className="text-xs text-text-secondary mt-1">{t.role} · {t.dept}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
