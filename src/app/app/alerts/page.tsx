"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/cn";
import { formatShortDate } from "@/lib/format";

const FILTERS = ["all", "unread", "payment", "price", "trial", "renewal", "system"] as const;

export default function AlertsPage() {
  const { alerts, markAlertRead, markAllAlertsRead } = useApp();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");

  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      if (filter === "all") return true;
      if (filter === "unread") return !a.read;
      return a.category === filter;
    });
  }, [alerts, filter]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Alerts"
        description="Renewals, failures, price changes, and trials — filter and mark read."
        action={
          <Button variant="secondary" size="sm" onClick={markAllAlertsRead}>
            Mark all read
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-xs font-medium capitalize",
              filter === f
                ? "border-brand bg-red-tint text-brand"
                : "border-border text-text-secondary hover:text-text-primary",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-bg-surface">
        {filtered.length === 0 && (
          <li className="px-5 py-10 text-center text-sm text-text-secondary">
            No alerts for this filter.
          </li>
        )}
        {filtered.map((a) => (
          <li
            key={a.id}
            className={cn(
              "flex items-start justify-between gap-4 px-5 py-4",
              !a.read && "bg-red-tint/20",
            )}
          >
            <div>
              <p
                className={cn(
                  "text-sm font-medium",
                  a.severity === "danger"
                    ? "text-brand"
                    : a.severity === "warning"
                      ? "text-warning"
                      : "text-text-primary",
                )}
              >
                {a.title}
              </p>
              <p className="mt-1 text-xs text-text-secondary">{a.detail}</p>
              <p className="mt-2 text-[11px] text-text-secondary">
                {formatShortDate(a.createdAt)} · {a.category}
              </p>
            </div>
            {!a.read && (
              <Button size="sm" variant="ghost" onClick={() => markAlertRead(a.id)}>
                Mark read
              </Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
