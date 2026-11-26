"use client";

import Link from "next/link";
import { Plus, Receipt } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useApp } from "@/lib/store";
import { formatKES, formatShortDate } from "@/lib/format";

export default function ExpensesPage() {
  const { expenses, archiveExpense } = useApp();
  const list = expenses.filter(
    (e) => e.workspace === "personal" && e.status !== "archived",
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Expenses"
        description="All personal recurring commitments — add, open, archive."
        action={
          <div className="flex gap-2">
            <Link href="/app/import">
              <Button variant="secondary" size="sm">
                Import CSV
              </Button>
            </Link>
            <Link href="/app/expenses/new">
              <Button size="sm">
                <Plus size={16} /> Add
              </Button>
            </Link>
          </div>
        }
      />

      {list.length === 0 ? (
        <EmptyState
          icon={<Receipt size={22} />}
          title="No expenses yet"
          description="Add a recurring expense or import a CSV."
          action={
            <Link href="/app/expenses/new">
              <Button>Add expense</Button>
            </Link>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-[11px] uppercase tracking-[0.06em] text-text-secondary">
                  <th className="px-5 py-3 font-medium">Expense</th>
                  <th className="px-3 py-3 font-medium">Category</th>
                  <th className="px-3 py-3 font-medium">Next</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 text-right font-medium">Amount</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((e) => (
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
                      <p className="text-xs text-text-secondary">
                        {e.confirmed ? "Confirmed" : "Suspected"} · {e.cycle}
                      </p>
                    </td>
                    <td className="px-3 py-3 text-text-secondary">{e.category}</td>
                    <td className="px-3 py-3 text-text-secondary">
                      {formatShortDate(e.nextBillingDate)}
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={e.status} />
                    </td>
                    <td className="money px-3 py-3 text-right font-semibold">
                      {formatKES(e.amount)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/app/expenses/${e.id}/edit`}
                        className="mr-2 text-xs text-brand hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="text-xs text-text-secondary hover:text-brand"
                        onClick={() => archiveExpense(e.id)}
                      >
                        Archive
                      </button>
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
