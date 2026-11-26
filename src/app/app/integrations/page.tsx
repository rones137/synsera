"use client";

import Link from "next/link";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";

const items: {
  name: string;
  status: "Ready" | "Soon" | "Planned";
  href?: string;
  detail: string;
}[] = [
  {
    name: "CSV import",
    status: "Ready",
    href: "/app/import",
    detail: "Paste or upload recurring expense rows in KES.",
  },
  {
    name: "Receipt upload",
    status: "Ready",
    href: "/app/receipts",
    detail: "Attach a receipt and confirm the draft expense.",
  },
  {
    name: "Email detection",
    status: "Soon",
    detail: "Forward renewal emails — scoped mailbox access only.",
  },
  {
    name: "M-PESA statements",
    status: "Planned",
    detail: "Revocable, scoped permissions. Never your PIN.",
  },
  {
    name: "Bank CSV",
    status: "Planned",
    detail: "File import only — no bank login.",
  },
  {
    name: "Calendar sync",
    status: "Soon",
    detail: "Push renewal dates to your calendar.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Integrations"
        description="Connect sources without handing over M-PESA PINs or bank passwords."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const inner = (
            <>
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
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                {item.detail}
              </p>
              {item.href && (
                <span className="mt-4 inline-block text-sm font-medium text-brand">
                  Open →
                </span>
              )}
            </>
          );
          return item.href ? (
            <Link
              key={item.name}
              href={item.href}
              className="rounded-xl border border-border bg-bg-surface p-5 hover:border-brand/30"
            >
              {inner}
            </Link>
          ) : (
            <div
              key={item.name}
              className="rounded-xl border border-border bg-bg-surface/70 p-5 opacity-90"
            >
              {inner}
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-border bg-bg-surface p-5 text-sm text-text-secondary">
        Need something sooner?{" "}
        <Link href="/contact" className="font-medium text-brand hover:underline">
          Tell us which connector
        </Link>
        . Meanwhile use{" "}
        <Button href="/app/import" variant="secondary" size="sm" className="mx-1">
          CSV import
        </Button>
        or{" "}
        <Button href="/app/expenses/new" size="sm" className="mx-1">
          Add expense
        </Button>
        .
      </div>
    </div>
  );
}
