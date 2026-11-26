"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  Info,
  PiggyBank,
  Plus,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard, StatCardSkeleton } from "@/components/ui/stat-card";
import { TableSkeleton } from "@/components/ui/skeleton";
import { getDashboardStats } from "@/lib/demo-data";
import { useApp } from "@/lib/store";
import { formatKES, formatShortDate } from "@/lib/format";
import { cn } from "@/lib/cn";

export default function DashboardPage() {
  const { expenses, alerts, activity, user, setWorkspace } = useApp();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setWorkspace("personal");
    const t = window.setTimeout(() => setReady(true), 280);
    return () => window.clearTimeout(t);
  }, [setWorkspace]);

  const personal = expenses.filter(
    (e) => e.workspace === "personal" && !["cancelled", "archived"].includes(e.status),
  );
  const stats = getDashboardStats(personal);
  const attention = alerts.filter((a) => !a.read).slice(0, 3);

  const upcoming = [...personal]
    .sort(
      (a, b) =>
        new Date(a.nextBillingDate).getTime() -
        new Date(b.nextBillingDate).getTime(),
    )
    .slice(0, 6);

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="mx-auto max-w-6xl space-y-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge tone="sample" className="mb-3">
            Illustrative sample data
          </Badge>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-[1.75rem]">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1.5 text-sm text-text-secondary">
            Personal workspace · Your money. Your rules. ·{" "}
            {formatShortDate("2026-11-26")}
          </p>
        </div>
        <Link href="/app/expenses/new">
          <Button>
            <Plus size={16} />
            Add expense
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {!ready ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              label="Monthly recurring"
              value={formatKES(stats.monthlyRecurring)}
              hint="Active commitments · this month · KES"
              icon={<Wallet size={18} strokeWidth={1.75} />}
              emphasize
            />
            <StatCard
              label="Next 7 days"
              value={formatKES(stats.next7)}
              hint="Due 26 Nov – 3 Dec"
              icon={<CalendarClock size={18} strokeWidth={1.75} />}
            />
            <StatCard
              label="Annualized"
              value={formatKES(stats.annualized)}
              hint="Current monthly × 12 · projection"
              icon={<TrendingUp size={18} strokeWidth={1.75} />}
            />
            <StatCard
              label="Potential savings"
              value={formatKES(stats.potentialSavings)}
              hint="Unused / overlap hypotheses"
              estimate
              icon={<PiggyBank size={18} strokeWidth={1.75} />}
            />
          </>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <section className="overflow-hidden rounded-xl border border-border bg-bg-surface lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-[15px] font-semibold tracking-tight">
              Upcoming payments
            </h2>
            <Link href="/app/expenses" className="text-sm font-medium text-brand hover:underline">
              View all
            </Link>
          </div>
          {!ready ? (
            <TableSkeleton rows={5} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[540px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-[11px] uppercase tracking-[0.06em] text-text-secondary">
                    <th className="px-5 py-3 font-medium">Expense</th>
                    <th className="px-3 py-3 font-medium">Due</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {upcoming.map((e) => (
                    <tr
                      key={e.id}
                      className="border-b border-border/60 last:border-0 transition-colors hover:bg-bg-raised/35"
                    >
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/app/subscriptions/${e.id}`}
                          className="font-medium text-text-primary hover:text-brand"
                        >
                          {e.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-text-secondary">
                          {e.paymentMethod}
                        </p>
                      </td>
                      <td className="px-3 py-3.5 tabular text-text-secondary">
                        {formatShortDate(e.nextBillingDate)}
                      </td>
                      <td className="px-3 py-3.5">
                        <StatusBadge status={e.status} />
                      </td>
                      <td className="money px-5 py-3.5 text-right text-[15px] font-semibold tracking-tight">
                        {formatKES(e.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-xl border border-border bg-bg-surface">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <AlertTriangle size={15} className="text-brand" strokeWidth={2} />
              <h2 className="text-[15px] font-semibold tracking-tight">
                Attention required
              </h2>
            </div>
            <Link href="/app/alerts" className="text-xs text-brand hover:underline">
              Alerts
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {attention.map((a) => (
              <li key={a.id} className="px-5 py-4">
                <div className="flex items-start gap-2.5">
                  {a.severity === "danger" ? (
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  ) : a.severity === "warning" ? (
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                  ) : (
                    <Info size={14} className="mt-0.5 shrink-0 text-text-secondary" />
                  )}
                  <div>
                    <p
                      className={cn(
                        "text-sm font-medium leading-snug",
                        a.severity === "danger"
                          ? "text-brand"
                          : a.severity === "warning"
                            ? "text-warning"
                            : "text-text-primary",
                      )}
                    >
                      {a.title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                      {a.detail}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <section className="overflow-hidden rounded-xl border border-border bg-bg-surface lg:col-span-2">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-[15px] font-semibold tracking-tight">Recent activity</h2>
          </div>
          <ul className="divide-y divide-border">
            {activity.slice(0, 5).map((a) => (
              <li
                key={a.id}
                className="flex items-start justify-between gap-4 px-5 py-3.5"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="mt-0.5 text-xs text-text-secondary">{a.detail}</p>
                </div>
                <time className="shrink-0 tabular text-xs text-text-secondary">
                  {formatShortDate(a.at)}
                </time>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-bg-surface p-5">
          <h2 className="text-[15px] font-semibold tracking-tight">Quick actions</h2>
          <div className="mt-4 space-y-2">
            {[
              ["/app/expenses/new", "Add recurring expense"],
              ["/app/import", "Import CSV"],
              ["/app/receipts", "Upload receipt"],
              ["/app/calendar", "Open calendar"],
              ["/business", "Switch to Business"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="block">
                <Button variant="secondary" className="w-full justify-between">
                  {label}
                  <ArrowRight size={16} />
                </Button>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
