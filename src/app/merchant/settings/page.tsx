"use client";
import { PageHeader } from "@/components/app/page-header";
export default function Page() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Merchant settings" description="Billing brand and preferences." />
      <div className="rounded-xl border border-border bg-bg-surface p-6 text-sm text-text-secondary">
        Merchant Merchant settings demo — UI only, no payment processor.
      </div>
    </div>
  );
}
