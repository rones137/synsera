"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { formatKES, formatShortDate } from "@/lib/format";
import { cn } from "@/lib/cn";

const TABS = [
  "overview",
  "history",
  "analytics",
  "reminders",
  "documents",
  "cancellation",
  "activity",
] as const;

export default function SubscriptionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { expenses, requestCancelExpense, archiveExpense, activity } = useApp();
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]>("overview");
  const expense = expenses.find((e) => e.id === id);

  const history = useMemo(() => expense?.history || [], [expense]);

  if (!expense) {
    return (
      <div className="mx-auto max-w-3xl py-16 text-center">
        <p className="text-text-secondary">Expense not found.</p>
        <Link href="/app/subscriptions" className="mt-4 inline-block text-brand">
          Back to subscriptions
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href="/app/subscriptions"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft size={16} /> Subscriptions
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Badge tone="sample" className="mb-2">
              Illustrative sample
            </Badge>
            <h1 className="text-2xl font-semibold tracking-tight">{expense.name}</h1>
            <p className="mt-1 text-sm text-text-secondary">
              {expense.merchant} · {expense.paymentMethod}
            </p>
          </div>
          <StatusBadge status={expense.status} />
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto rounded-lg border border-border bg-bg-surface p-1">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "shrink-0 rounded-md px-3 py-2 text-xs font-medium capitalize",
              tab === t
                ? "bg-red-tint text-brand"
                : "text-text-secondary hover:text-text-primary",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-bg-surface p-5">
        {tab === "overview" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-text-secondary">Amount</p>
              <p className="money text-2xl font-semibold">{formatKES(expense.amount)}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary">Next billing</p>
              <p className="text-lg font-medium">{formatShortDate(expense.nextBillingDate)}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary">Cycle</p>
              <p className="capitalize">{expense.cycle}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary">Category</p>
              <p>{expense.category}</p>
            </div>
            {expense.notes && (
              <div className="sm:col-span-2">
                <p className="text-xs text-text-secondary">Notes</p>
                <p className="text-sm">{expense.notes}</p>
              </div>
            )}
          </div>
        )}

        {tab === "history" && (
          <ul className="space-y-3">
            {history.length === 0 && (
              <p className="text-sm text-text-secondary">No payment history yet.</p>
            )}
            {history.map((h, i) => (
              <li key={i} className="flex justify-between text-sm border-b border-border/60 pb-2">
                <span>{formatShortDate(h.date)}</span>
                <span className="money font-medium">{formatKES(h.amount)}</span>
              </li>
            ))}
          </ul>
        )}

        {tab === "analytics" && (
          <p className="text-sm text-text-secondary leading-relaxed">
            Annualized estimate:{" "}
            <span className="money text-text-primary font-semibold">
              {formatKES(
                expense.cycle === "yearly"
                  ? expense.amount
                  : expense.cycle === "weekly"
                    ? expense.amount * 52
                    : expense.amount * 12,
              )}
            </span>
            . Charts deepen when more history lands.
          </p>
        )}

        {tab === "reminders" && (
          <p className="text-sm text-text-secondary">
            Default reminder: 7 days before {formatShortDate(expense.nextBillingDate)}. Adjust in
            Settings → notifications.
          </p>
        )}

        {tab === "documents" && (
          <p className="text-sm text-text-secondary">
            No documents attached. Receipt uploads from AI Detective can link here later.
          </p>
        )}

        {tab === "cancellation" && (
          <div className="space-y-4">
            <p className="text-sm text-text-secondary leading-relaxed">
              Synsera helps you request and verify cancellation. We never claim “cancelled for
              you” without verification.
            </p>
            {expense.status === "cancellation_pending" ? (
              <Badge tone="warning">Verification pending</Badge>
            ) : (
              <Button
                variant="danger"
                onClick={() => {
                  requestCancelExpense(expense.id);
                  setTab("cancellation");
                }}
              >
                Request cancellation
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={() => {
                archiveExpense(expense.id);
                router.push("/app/subscriptions");
              }}
            >
              Archive expense
            </Button>
          </div>
        )}

        {tab === "activity" && (
          <ul className="space-y-3">
            {activity.slice(0, 8).map((a) => (
              <li key={a.id} className="text-sm border-b border-border/60 pb-2">
                <p className="font-medium">{a.title}</p>
                <p className="text-xs text-text-secondary">{a.detail}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
