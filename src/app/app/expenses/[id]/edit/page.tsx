"use client";

import { FormEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { useApp } from "@/lib/store";
import type { BillingCycle, ExpenseStatus } from "@/lib/types";

export default function EditExpensePage() {
  const { id } = useParams<{ id: string }>();
  const { expenses, updateExpense } = useApp();
  const router = useRouter();
  const expense = expenses.find((e) => e.id === id);

  if (!expense) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center text-text-secondary">
        Expense not found.{" "}
        <Link href="/app/expenses" className="text-brand">
          Back
        </Link>
      </div>
    );
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    updateExpense(id, {
      name: String(fd.get("name")),
      merchant: String(fd.get("merchant")),
      amount: Number(fd.get("amount")),
      cycle: String(fd.get("cycle")) as BillingCycle,
      nextBillingDate: String(fd.get("nextBillingDate")),
      category: String(fd.get("category")),
      paymentMethod: String(fd.get("paymentMethod")),
      status: String(fd.get("status")) as ExpenseStatus,
      notes: String(fd.get("notes") || "") || undefined,
    });
    router.push("/app/expenses");
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Link
        href="/app/expenses"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft size={16} /> Back
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">Edit expense</h1>
      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-xl border border-border bg-bg-surface p-5"
      >
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={expense.name} required />
        </div>
        <div>
          <Label htmlFor="merchant">Merchant</Label>
          <Input id="merchant" name="merchant" defaultValue={expense.merchant} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="amount">Amount (KES)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              className="money"
              defaultValue={expense.amount}
              required
            />
          </div>
          <div>
            <Label htmlFor="cycle">Cycle</Label>
            <Select id="cycle" name="cycle" defaultValue={expense.cycle}>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="weekly">Weekly</option>
              <option value="custom">Custom</option>
            </Select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="nextBillingDate">Next billing</Label>
            <Input
              id="nextBillingDate"
              name="nextBillingDate"
              type="date"
              defaultValue={expense.nextBillingDate}
              required
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select id="status" name="status" defaultValue={expense.status}>
              <option value="active">Active</option>
              <option value="trial">Trial</option>
              <option value="upcoming">Upcoming</option>
              <option value="price_changed">Price changed</option>
              <option value="failed">Failed</option>
              <option value="cancellation_pending">Cancel pending</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select id="category" name="category" defaultValue={expense.category}>
            <option>Entertainment</option>
            <option>Software</option>
            <option>Utilities</option>
            <option>Health</option>
            <option>Other</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="paymentMethod">Payment method</Label>
          <Input
            id="paymentMethod"
            name="paymentMethod"
            defaultValue={expense.paymentMethod}
          />
        </div>
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" name="notes" defaultValue={expense.notes || ""} />
        </div>
        <div className="flex gap-2">
          <Button type="submit">Save changes</Button>
          <Link href="/app/expenses">
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
