"use client";

import Link from "next/link";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";

const items = [
  {
    name: "CSV / expense import",
    status: "Ready" as const,
    href: "/app/import",
    detail: "Bring software spend into Synsera as recurring expenses.",
  },
  {
    name: "Receipts",
    status: "Ready" as const,
    href: "/app/receipts",
    detail: "Attach invoices and confirm KES amounts.",
  },
  {
    name: "SSO",
    status: "Planned" as const,
    detail: "Enterprise login for teams — not connected yet.",
  },
  {
    name: "Accounting export",
    status: "Soon" as const,
    detail: "Push approved spend snapshots to your books.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Integrations"
        description="Connect sources without bank passwords or M-PESA PINs."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.name}
            className="rounded-xl border border-border bg-bg-surface p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium">{item.name}</p>
              <span
                className={`text-[11px] font-medium ${
                  item.status === "Ready" ? "text-brand" : "text-text-secondary"
                }`}
              >
                {item.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-text-secondary">{item.detail}</p>
            {item.href && (
              <Link
                href={item.href}
                className="mt-4 inline-block text-sm font-medium text-brand hover:underline"
              >
                Open →
              </Link>
            )}
          </div>
        ))}
      </div>
      <Button href="/business/vendors" variant="secondary">
        Manage vendors
      </Button>
    </div>
  );
}
