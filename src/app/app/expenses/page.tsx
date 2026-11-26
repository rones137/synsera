"use client";

import Link from "next/link";
import { Plus, Receipt } from "lucide-react";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useExpenses } from "@/lib/expenses-store";
import { formatKES, formatShortDate } from "@/lib/format";

export default function ExpensesPage() {
  const { expenses } = useExpenses();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge tone="sample" className="mb-2">
            Sample data · local demo state
          </Badge>
          <h1 className="text-2xl font-semibold tracking-tight">Expenses</h1>
          <p className="mt-1 text-sm text-text-secondary">
            All recurring commitments — utilities, software, health, and more.
          </p>
        </div>
        <Link href="/app/expenses/new">
          <Button>
            <Plus size={16} />
            Add expense
          </Button>
        </Link>
      </div>

      {expenses.length === 0 ? (
        <EmptyState
          icon={<Receipt size={22} />}
          title="No expenses yet"
          description="Add a recurring expense to see it on your dashboard and calendar."
          action={
            <Link href="/app/expenses/new">
              <Button>Add expense</Button>
            </Link>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-text-secondary">
                  <th className="px-5 py-3 font-medium">Expense</th>
                  <th className="px-3 py-3 font-medium">Category</th>
                  <th className="px-3 py-3 font-medium">Method</th>
                  <th className="px-3 py-3 font-medium">Next</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((e) => (
                  <tr
                    key={e.id}
                    className="border-b border-border/70 last:border-0 hover:bg-bg-raised/40"
                  >
                    <td className="px-5 py-3">
                      <p className="font-medium">{e.name}</p>
                      <p className="text-xs text-text-secondary">
                        {e.confirmed ? "Confirmed" : "Suspected"} · {e.cycle}
                      </p>
                    </td>
                    <td className="px-3 py-3 text-text-secondary">{e.category}</td>
                    <td className="px-3 py-3 text-text-secondary">
                      {e.paymentMethod}
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
