"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useExpenses } from "@/lib/expenses-store";
import { formatKES, formatShortDate } from "@/lib/format";
import { CreditCard } from "lucide-react";

export default function SubscriptionsPage() {
  const { expenses } = useExpenses();
  const subs = expenses.filter((e) =>
    ["Entertainment", "Software"].includes(e.category),
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge tone="sample" className="mb-2">
            Sample data
          </Badge>
          <h1 className="text-2xl font-semibold tracking-tight">Subscriptions</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Software & entertainment recurrings in your Personal workspace.
          </p>
        </div>
        <Link href="/app/expenses/new">
          <Button>
            <Plus size={16} />
            Add subscription
          </Button>
        </Link>
      </div>

      {subs.length === 0 ? (
        <EmptyState
          icon={<CreditCard size={22} />}
          title="No subscriptions yet"
          description="Add Netflix, Adobe, Showmax, or any recurring software to start tracking."
          action={
            <Link href="/app/expenses/new">
              <Button>Add your first</Button>
            </Link>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-text-secondary">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-3 py-3 font-medium">Category</th>
                  <th className="px-3 py-3 font-medium">Cycle</th>
                  <th className="px-3 py-3 font-medium">Next bill</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {subs.map((e) => (
                  <tr
                    key={e.id}
                    className="border-b border-border/70 last:border-0 hover:bg-bg-raised/40"
                  >
                    <td className="px-5 py-3">
                      <p className="font-medium">{e.name}</p>
                      <p className="text-xs text-text-secondary">{e.merchant}</p>
                    </td>
                    <td className="px-3 py-3 text-text-secondary">{e.category}</td>
                    <td className="px-3 py-3 capitalize text-text-secondary">
                      {e.cycle}
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
        </div>
      )}
    </div>
  );
}
