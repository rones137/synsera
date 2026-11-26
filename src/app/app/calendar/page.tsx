"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useApp } from "@/lib/store";
import { formatKES, formatShortDate } from "@/lib/format";
import { cn } from "@/lib/cn";

type View = "month" | "week" | "day";

export default function CalendarPage() {
  const { expenses } = useApp();
  const [view, setView] = useState<View>("month");
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const personal = expenses.filter(
    (e) => e.workspace === "personal" && !["cancelled", "archived"].includes(e.status),
  );

  const y = cursor.getFullYear();
  const m = cursor.getMonth();
  const monthLabel = cursor.toLocaleString("en-KE", { month: "long", year: "numeric" });

  const daysInMonth = useMemo(() => {
    const first = new Date(y, m, 1);
    const startPad = first.getDay();
    const days = new Date(y, m + 1, 0).getDate();
    const cells: { date: Date | null; items: typeof personal }[] = [];
    for (let i = 0; i < startPad; i++) cells.push({ date: null, items: [] });
    for (let d = 1; d <= days; d++) {
      const date = new Date(y, m, d);
      const key = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({
        date,
        items: personal.filter((e) => e.nextBillingDate === key),
      });
    }
    return cells;
  }, [y, m, personal]);

  const todayKey = new Date().toISOString().slice(0, 10);
  const weekStart = (() => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    return d;
  })();
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const weekItems = personal.filter((e) => {
    const d = new Date(e.nextBillingDate);
    return d >= weekStart && d <= weekEnd;
  });
  const dayItems = personal.filter((e) => e.nextBillingDate === todayKey);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Calendar"
        description="Renewals by day, week, and month — amounts in KES."
        action={
          <div className="flex flex-wrap items-center gap-2">
            {view === "month" && (
              <>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setCursor(new Date(y, m - 1, 1))}
                >
                  Prev
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setCursor(new Date(y, m + 1, 1))}
                >
                  Next
                </Button>
              </>
            )}
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
          </div>
        }
      />

      {personal.length === 0 && (
        <EmptyState
          title="No renewals to show"
          description="Add a recurring expense to populate this calendar."
          action={<Button href="/app/expenses/new">Add expense</Button>}
        />
      )}

      {personal.length > 0 && view === "month" && (
        <div className="overflow-hidden rounded-xl border border-border bg-bg-surface">
          <div className="border-b border-border px-4 py-3 text-sm font-medium">
            {monthLabel}
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
                  "min-h-[88px] border-b border-r border-border p-1.5 text-xs",
                  !cell.date && "bg-bg-app/40",
                )}
              >
                {cell.date && (
                  <>
                    <p className="mb-1 font-medium text-text-secondary">
                      {cell.date.getDate()}
                    </p>
                    <ul className="space-y-1">
                      {cell.items.slice(0, 3).map((e) => (
                        <li
                          key={e.id}
                          className="truncate rounded bg-red-tint px-1 py-0.5 text-[10px] text-brand"
                          title={`${e.name} · ${formatKES(e.amount)}`}
                        >
                          {e.name}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {personal.length > 0 && view === "week" && (
        <div className="rounded-xl border border-border bg-bg-surface p-5">
          <p className="mb-4 text-sm font-medium">This week</p>
          {weekItems.length === 0 ? (
            <p className="text-sm text-text-secondary">No renewals this week.</p>
          ) : (
            <ul className="space-y-2">
              {weekItems.map((e) => (
                <li
                  key={e.id}
                  className="flex justify-between gap-3 rounded-lg bg-bg-app px-3 py-2 text-sm"
                >
                  <span>
                    {e.name} · {formatShortDate(e.nextBillingDate)}
                  </span>
                  <span className="money">{formatKES(e.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {personal.length > 0 && view === "day" && (
        <div className="rounded-xl border border-border bg-bg-surface p-5">
          <p className="mb-4 text-sm font-medium">Today · {formatShortDate(todayKey)}</p>
          {dayItems.length === 0 ? (
            <p className="text-sm text-text-secondary">Nothing due today.</p>
          ) : (
            <ul className="space-y-2">
              {dayItems.map((e) => (
                <li
                  key={e.id}
                  className="flex justify-between gap-3 rounded-lg bg-bg-app px-3 py-2 text-sm"
                >
                  <span>{e.name}</span>
                  <span className="money">{formatKES(e.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
