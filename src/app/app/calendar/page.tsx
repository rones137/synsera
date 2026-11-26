"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { formatKES, formatShortDate } from "@/lib/format";
import { cn } from "@/lib/cn";

type View = "month" | "week" | "day";

export default function CalendarPage() {
  const { expenses } = useApp();
  const [view, setView] = useState<View>("month");
  const personal = expenses.filter(
    (e) => e.workspace === "personal" && !["cancelled", "archived"].includes(e.status),
  );

  const anchor = useMemo(() => new Date(2026, 10, 26), []); // Nov 26, 2026

  const daysInMonth = useMemo(() => {
    const y = anchor.getFullYear();
    const m = anchor.getMonth();
    const first = new Date(y, m, 1);
    const startPad = first.getDay();
    const days = new Date(y, m + 1, 0).getDate();
    const cells: { date: Date | null; items: typeof personal }[] = [];
    for (let i = 0; i < startPad; i++) cells.push({ date: null, items: [] });
    for (let d = 1; d <= days; d++) {
      const date = new Date(y, m, d);
      const key = date.toISOString().slice(0, 10);
      cells.push({
        date,
        items: personal.filter((e) => e.nextBillingDate === key),
      });
    }
    return cells;
  }, [anchor, personal]);

  const weekItems = personal.filter((e) => {
    const d = new Date(e.nextBillingDate);
    const start = new Date(2026, 10, 23);
    const end = new Date(2026, 10, 29);
    return d >= start && d <= end;
  });

  const dayItems = personal.filter((e) => e.nextBillingDate === "2026-11-26");

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Calendar"
        description="Renewals on a day / week / month view — KES demo dates."
        action={
          <div className="flex gap-1 rounded-lg border border-border p-1">
            {(["month", "week", "day"] as View[]).map((v) => (
              <Button
                key={v}
                size="sm"
                variant={view === v ? "primary" : "ghost"}
                onClick={() => setView(v)}
                className="capitalize"
              >
                {v}
              </Button>
            ))}
          </div>
        }
      />

      {view === "month" && (
        <div className="overflow-hidden rounded-xl border border-border bg-bg-surface">
          <div className="border-b border-border px-4 py-3 text-sm font-medium">
            November 2026
          </div>
          <div className="grid grid-cols-7 border-b border-border text-center text-[11px] uppercase tracking-wide text-text-secondary">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="py-2">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {daysInMonth.map((cell, i) => (
              <div
                key={i}
                className={cn(
                  "min-h-[88px] border-b border-r border-border/60 p-1.5",
                  cell.date?.toDateString() === anchor.toDateString() && "bg-red-tint/30",
                )}
              >
                {cell.date && (
                  <>
                    <p className="text-xs text-text-secondary">{cell.date.getDate()}</p>
                    <div className="mt-1 space-y-0.5">
                      {cell.items.slice(0, 2).map((e) => (
                        <p
                          key={e.id}
                          className="truncate rounded bg-brand/15 px-1 py-0.5 text-[10px] text-brand"
                          title={e.name}
                        >
                          {e.name}
                        </p>
                      ))}
                      {cell.items.length > 2 && (
                        <p className="text-[10px] text-text-secondary">
                          +{cell.items.length - 2}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "week" && (
        <ul className="space-y-2 rounded-xl border border-border bg-bg-surface p-4">
          {weekItems.length === 0 && (
            <p className="text-sm text-text-secondary">No renewals this week.</p>
          )}
          {weekItems.map((e) => (
            <li
              key={e.id}
              className="flex items-center justify-between rounded-lg bg-bg-app px-3 py-2.5 text-sm"
            >
              <span>{e.name}</span>
              <span className="text-text-secondary">{formatShortDate(e.nextBillingDate)}</span>
              <span className="money font-medium">{formatKES(e.amount)}</span>
            </li>
          ))}
        </ul>
      )}

      {view === "day" && (
        <div className="rounded-xl border border-border bg-bg-surface p-5">
          <p className="mb-4 text-sm font-medium">Thursday 26 Nov 2026</p>
          {dayItems.length === 0 ? (
            <p className="text-sm text-text-secondary">
              No payments due today. Upcoming items appear on their billing dates.
            </p>
          ) : (
            <ul className="space-y-2">
              {dayItems.map((e) => (
                <li key={e.id} className="flex justify-between text-sm">
                  <span>{e.name}</span>
                  <span className="money font-medium">{formatKES(e.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
