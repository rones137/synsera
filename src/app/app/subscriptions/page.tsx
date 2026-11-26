"use client";

import Link from "next/link";
import { Plus, CreditCard } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useApp } from "@/lib/store";
import { formatKES, formatShortDate } from "@/lib/format";

export default function SubscriptionsPage() {
  const { expenses } = useApp();
  const subs = expenses.filter(
    (e) =>
      e.workspace === "personal" &&
      ["Entertainment", "Software"].includes(e.category) &&
      e.status !== "archived",
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Subscriptions"
        description="Software & entertainment recurrings — open any row for detail tabs."
        action={
          <Link href="/app/expenses/new">
            <Button size="sm">
              <Plus size={16} /> Add
            </Button>
          </Link>
        }
      />

      {subs.length === 0 ? (
        <EmptyState
          icon={<CreditCard size={22} />}
          title="No subscriptions yet"
          description="Add Showmax, Spotify, Microsoft 365, or any recurring software — amounts in KES."
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
                <tr className="border-b border-border text-[11px] uppercase tracking-[0.06em] text-text-secondary">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-3 py-3 font-medium">Category</th>
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
                      <Link
                        href={`/app/subscriptions/${e.id}`}
                        className="font-medium hover:text-brand"
                      >
                        {e.name}
                      </Link>
                      <p className="text-xs text-text-secondary">{e.merchant}</p>
                    </td>
                    <td className="px-3 py-3 text-text-secondary">{e.category}</td>
                    <td className="px-3 py-3 text-text-secondary">
                      {formatShortDate(e.nextBillingDate)}
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={e.status} />
                    </td>
                    <td className="money px-5 py-3 text-right font-semibold">
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
