"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  PiggyBank,
  Plus,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/badge";
import {
  DEMO_ACTIVITY,
  DEMO_ATTENTION,
  DEMO_USER,
  getDashboardStats,
} from "@/lib/demo-data";
import { useExpenses } from "@/lib/expenses-store";
import { formatKES, formatShortDate } from "@/lib/format";

export default function DashboardPage() {
  const { expenses } = useExpenses();
  const stats = getDashboardStats(expenses);
  const now = new Date("2026-11-26");
  const in7 = new Date(now);
  in7.setDate(in7.getDate() + 7);

  const upcoming = [...expenses]
    .filter((e) => e.status !== "cancelled")
    .sort(
      (a, b) =>
        new Date(a.nextBillingDate).getTime() -
        new Date(b.nextBillingDate).getTime(),
    )
    .slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge tone="sample">Sample data · illustrative only</Badge>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Welcome back, {DEMO_USER.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
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
        <StatCard
          label="Monthly recurring"
          value={formatKES(stats.monthlyRecurring)}
          hint="Active commitments · this month · KES"
          icon={<Wallet size={18} />}
        />
        <StatCard
          label="Next 7 days"
          value={formatKES(stats.next7)}
          hint="Due between 26 Nov – 3 Dec"
          icon={<CalendarClock size={18} />}
        />
        <StatCard
          label="Annualized"
          value={formatKES(stats.annualized)}
          hint="Current monthly × 12 · projection"
          icon={<TrendingUp size={18} />}
        />
        <StatCard
          label="Potential savings"
          value={formatKES(stats.potentialSavings)}
          hint="Unused / overlap hypotheses"
          estimate
          icon={<PiggyBank size={18} />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-xl border border-border bg-bg-surface">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-semibold">Upcoming payments</h2>
            <Link
              href="/app/expenses"
              className="text-sm text-brand hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[540px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-text-secondary">
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
                    className="border-b border-border/70 last:border-0 hover:bg-bg-raised/40"
                  >
                    <td className="px-5 py-3">
                      <p className="font-medium text-text-primary">{e.name}</p>
                      <p className="text-xs text-text-secondary">
                        {e.paymentMethod}
                      </p>
                    </td>
                    <td className="px-3 py-3 text-text-secondary">
                      {formatShortDate(e.nextBillingDate)}
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={e.status} />
                    </td>
                    <td className="money px-5 py-3 text-right font-medium">
                      {formatKES(e.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-bg-surface">
          <div className="flex items-center gap-2 border-b border-border px-5 py-4">
            <AlertTriangle size={16} className="text-warning" />
            <h2 className="font-semibold">Attention required</h2>
          </div>
          <ul className="divide-y divide-border">
            {DEMO_ATTENTION.map((a) => (
              <li key={a.id} className="px-5 py-4">
                <p
                  className={`text-sm font-medium ${
                    a.severity === "danger"
                      ? "text-brand"
                      : a.severity === "warning"
                        ? "text-warning"
                        : "text-text-primary"
                  }`}
                >
                  {a.title}
                </p>
                <p className="mt-1 text-xs text-text-secondary">{a.detail}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-border bg-bg-surface lg:col-span-2">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-semibold">Recent activity</h2>
          </div>
          <ul className="divide-y divide-border">
            {DEMO_ACTIVITY.map((a) => (
              <li
                key={a.id}
                className="flex items-start justify-between gap-4 px-5 py-3.5"
              >
                <div>
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-text-secondary">{a.detail}</p>
                </div>
                <time className="shrink-0 text-xs text-text-secondary">
                  {formatShortDate(a.at)}
                </time>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-bg-surface p-5">
          <h2 className="font-semibold">Quick actions</h2>
          <div className="mt-4 space-y-2">
            <Link href="/app/expenses/new" className="block">
              <Button variant="secondary" className="w-full justify-between">
                Add recurring expense
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/app/subscriptions" className="block">
              <Button variant="secondary" className="w-full justify-between">
                Review subscriptions
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/app/expenses" className="block">
              <Button variant="secondary" className="w-full justify-between">
                Browse all expenses
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
          <div className="mt-6 rounded-lg border border-dashed border-border bg-bg-app p-4">
            <p className="text-sm font-medium">AI recommendations</p>
            <p className="mt-1 text-xs text-text-secondary">
              Placeholder for AI Detective. No invented savings — suggestions will
              carry confidence labels when enabled.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
