"use client";
import { PageHeader } from "@/components/app/page-header";
export default function Page() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Renewal calendar" description="Upcoming business renewals." />
      <div className="rounded-xl border border-border bg-bg-surface p-6 text-sm text-text-secondary leading-relaxed">
        Working Renewal calendar demo in Synsera Business. Illustrative sample data for Kenya/KES. No bank passwords required.
      </div>
    </div>
  );
}
