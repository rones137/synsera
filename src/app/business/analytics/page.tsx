"use client";
import { PageHeader } from "@/components/app/page-header";
export default function Page() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Analytics" description="Business spend analytics demo." />
      <div className="rounded-xl border border-border bg-bg-surface p-6 text-sm text-text-secondary leading-relaxed">
        Working Analytics demo in Synsera Business. Illustrative sample data for Kenya/KES. No bank passwords required.
      </div>
    </div>
  );
}
