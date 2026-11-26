"use client";

import Link from "next/link";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Sparkles } from "lucide-react";
import { useApp } from "@/lib/store";
import { monthlyEquivalent } from "@/lib/demo-data";
import { formatKES } from "@/lib/format";

type Signal = {
  title: string;
  detail: string;
  confidence: "confirmed" | "likely" | "probable";
  evidence: string[];
  href: string;
};

function buildSignals(
  expenses: ReturnType<typeof useApp>["expenses"],
): Signal[] {
  const personal = expenses.filter(
    (e) => e.workspace === "personal" && !["cancelled", "archived"].includes(e.status),
  );
  const out: Signal[] = [];

  const byCat: Record<string, typeof personal> = {};
  for (const e of personal) {
    byCat[e.category] = byCat[e.category] || [];
    byCat[e.category].push(e);
  }
  for (const [cat, list] of Object.entries(byCat)) {
    if (list.length >= 2) {
      out.push({
        title: `Possible overlap in ${cat}`,
        detail: `${list.map((e) => e.name).join(" + ")} both active.`,
        confidence: "probable",
        evidence: [`${list.length} in ${cat}`, "same category"],
        href: `/app/subscriptions/${list[0].id}`,
      });
    }
  }

  for (const e of personal.filter((x) => x.status === "price_changed")) {
    const prev = e.history?.[e.history.length - 2];
    out.push({
      title: `Price change · ${e.name}`,
      detail: prev
        ? `${formatKES(prev.amount)} → ${formatKES(e.amount)}`
        : `Now ${formatKES(e.amount)}/${e.cycle}`,
      confidence: "confirmed",
      evidence: ["status=price_changed", e.merchant],
      href: `/app/subscriptions/${e.id}`,
    });
  }

  for (const e of personal.filter((x) => x.status === "trial")) {
    out.push({
      title: `Trial converting · ${e.name}`,
      detail: `Trial ends around ${e.nextBillingDate}.`,
      confidence: "likely",
      evidence: ["status=trial", `~${formatKES(monthlyEquivalent(e))}/mo`],
      href: `/app/subscriptions/${e.id}`,
    });
  }

  for (const e of personal.filter((x) => x.status === "failed")) {
    out.push({
      title: `Failed payment · ${e.name}`,
      detail: `${e.paymentMethod} declined.`,
      confidence: "confirmed",
      evidence: ["status=failed", e.paymentMethod],
      href: `/app/subscriptions/${e.id}`,
    });
  }

  for (const e of personal.filter((x) => !x.confirmed)) {
    out.push({
      title: `Unconfirmed · ${e.name}`,
      detail: "Suspected commitment — confirm or dismiss.",
      confidence: "probable",
      evidence: ["confirmed=false"],
      href: `/app/subscriptions/${e.id}`,
    });
  }

  return out;
}

export default function AIDetectivePage() {
  const { expenses } = useApp();
  const suspected = expenses.filter((e) => e.workspace === "personal" && !e.confirmed);
  const signals = buildSignals(expenses);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="AI Detective"
        description="AI extracts signals. Deterministic rules own money. Confidence + evidence on every card."
        action={
          <div className="flex gap-2">
            <Button href="/app/receipts" variant="secondary" size="sm">
              Upload receipt
            </Button>
            <Button href="/app/import" size="sm">
              Import CSV
            </Button>
          </div>
        }
      />
      <div className="rounded-xl border border-border bg-bg-surface p-5 flex gap-3">
        <Sparkles className="text-brand shrink-0" size={20} />
        <div>
          <p className="font-medium">How Synsera uses AI</p>
          <p className="mt-1 text-sm text-text-secondary leading-relaxed">
            Extraction suggests merchants/amounts from your data. You confirm. No invented savings.
            Suspected items: {suspected.length}.
          </p>
        </div>
      </div>
      {signals.length === 0 ? (
        <EmptyState
          icon={<Sparkles size={22} />}
          title="No signals yet"
          description="Add or import expenses — Detective only surfaces evidence from your real data."
          action={<Button href="/app/expenses/new" size="sm">Add expense</Button>}
        />
      ) : (
        <ul className="space-y-3">
          {signals.map((r) => (
            <li key={r.title + r.href} className="rounded-xl border border-border bg-bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{r.title}</p>
                  <p className="mt-1 text-sm text-text-secondary">{r.detail}</p>
                  <p className="mt-2 text-xs text-text-secondary">
                    Evidence: {r.evidence.join(" · ")}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge tone={r.confidence === "confirmed" ? "brand" : "neutral"}>
                    Confidence: {r.confidence}
                  </Badge>
                  <Link href={r.href}>
                    <Button size="sm" variant="secondary">
                      Review
                    </Button>
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
