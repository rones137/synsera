"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { useWorkspaceData } from "@/lib/workspace-store";
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

type CancelStep = "idle" | "requested" | "merchant_contacted" | "verified";

function UsageDiary({ expenseId }: { expenseId: string }) {
  const key = `synsera-usage-${expenseId}`;
  const [entries, setEntries] = useState<{ at: string; note: string }[]>([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      queueMicrotask(() => setEntries(raw ? JSON.parse(raw) : []));
    } catch {
      /* ignore */
    }
  }, [key]);

  return (
    <div className="rounded-xl border border-border bg-bg-app p-4 space-y-3">
      <h3 className="text-sm font-semibold">Usage diary</h3>
      <p className="text-xs text-text-secondary">
        Log whether you actually used this — feeds cancel decisions later.
      </p>
      <ul className="space-y-2">
        {entries.length === 0 && (
          <li className="text-xs text-text-secondary">No entries yet.</li>
        )}
        {entries.map((e, i) => (
          <li key={i} className="text-sm border-b border-border/60 pb-2">
            <span className="text-xs text-text-secondary">{e.at.slice(0, 10)}</span>
            <p>{e.note}</p>
          </li>
        ))}
      </ul>
      <form
        className="flex flex-wrap gap-2"
        onSubmit={(ev) => {
          ev.preventDefault();
          if (!note.trim()) return;
          const next = [{ at: new Date().toISOString(), note: note.trim() }, ...entries];
          setEntries(next);
          localStorage.setItem(key, JSON.stringify(next));
          setNote("");
        }}
      >
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Used 2× this week"
          className="h-10 flex-1 min-w-[180px] rounded-lg border border-border bg-bg-surface px-3 text-sm"
        />
        <Button type="submit" size="sm">
          Log use
        </Button>
      </form>
    </div>
  );
}

export default function SubscriptionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const {
    expenses,
    requestCancelExpense,
    confirmCancelExpense,
    archiveExpense,
    activity,
  } = useApp();
  const { addToGraveyard } = useWorkspaceData();
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]>("overview");
  const [localStep, setLocalStep] = useState<CancelStep | null>(null);
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

  const step: CancelStep =
    localStep ||
    (expense.status === "cancelled"
      ? "verified"
      : expense.status === "cancellation_pending"
        ? "requested"
        : "idle");

  const steps = [
    { key: "idle", label: "Not started" },
    { key: "requested", label: "Request recorded" },
    { key: "merchant_contacted", label: "Merchant contacted" },
    { key: "verified", label: "Verified cancelled" },
  ] as const;

  const stepIndex = steps.findIndex((s) => s.key === step);

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
          <div className="space-y-5">
            {expense.status === "failed" && (
              <div className="rounded-xl border border-brand bg-red-tint p-4 text-sm">
                <p className="font-medium text-brand">Failed payment help</p>
                <p className="mt-1 text-text-secondary leading-relaxed">
                  Card or M-PESA declined. Update the payment method with the merchant, then mark
                  the expense active once charged successfully. Synsera never stores raw cards or
                  PINs.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => setTab("cancellation")}>
                    Consider cancelling
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      /* keep local — user edits via edit page */
                    }}
                  >
                    Review method: {expense.paymentMethod}
                  </Button>
                </div>
              </div>
            )}
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
            <UsageDiary expenseId={expense.id} />
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
          <div className="space-y-5">
            <p className="text-sm text-text-secondary leading-relaxed">
              Synsera cancellation assistant records your request and tracks verification. We never
              claim “cancelled for you” without your confirmation.
            </p>

            <ol className="space-y-3">
              {steps.map((s, i) => {
                const done = i <= stepIndex && step !== "idle";
                const current = s.key === step;
                return (
                  <li key={s.key} className="flex items-center gap-3 text-sm">
                    {done || current ? (
                      <CheckCircle2
                        size={18}
                        className={current ? "text-brand" : "text-success"}
                      />
                    ) : (
                      <Circle size={18} className="text-text-secondary/40" />
                    )}
                    <span
                      className={cn(
                        current && "font-medium text-brand",
                        done && !current && "text-text-primary",
                        !done && !current && "text-text-secondary",
                      )}
                    >
                      {s.label}
                    </span>
                  </li>
                );
              })}
            </ol>

            <div className="flex flex-wrap gap-2">
              {step === "idle" && (
                <Button
                  variant="danger"
                  onClick={() => {
                    requestCancelExpense(expense.id);
                    setLocalStep("requested");
                  }}
                >
                  Request cancellation
                </Button>
              )}
              {step === "requested" && (
                <Button
                  onClick={() => setLocalStep("merchant_contacted")}
                >
                  Mark merchant contacted
                </Button>
              )}
              {step === "merchant_contacted" && (
                <Button
                  onClick={() => {
                    confirmCancelExpense(expense.id);
                    addToGraveyard(expense.name, expense.amount);
                    setLocalStep("verified");
                  }}
                >
                  Confirm verified cancelled
                </Button>
              )}
              {step === "verified" && (
                <Badge tone="success">Verified — in Subscription Graveyard</Badge>
              )}
              {expense.status !== "archived" && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    archiveExpense(expense.id);
                    router.push("/app/subscriptions");
                  }}
                >
                  Archive expense
                </Button>
              )}
            </div>
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
