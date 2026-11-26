"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { useApp } from "@/lib/store";
import type { BillingCycle } from "@/lib/types";

export default function NewExpensePage() {
  const router = useRouter();
  const { addExpense } = useApp();
  const [loading, setLoading] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const amount = Number(fd.get("amount"));
    if (!amount || amount <= 0) return;
    setLoading(true);
    addExpense({
      name: String(fd.get("name")),
      merchant: String(fd.get("merchant") || fd.get("name")),
      amount,
      cycle: String(fd.get("cycle")) as BillingCycle,
      nextBillingDate: String(fd.get("nextBillingDate")),
      category: String(fd.get("category")),
      paymentMethod: String(fd.get("paymentMethod")),
      notes: String(fd.get("notes") || "") || undefined,
      workspace: (String(fd.get("workspace") || "personal") as
        | "personal"
        | "business"
        | "merchant"),
    });
    router.push(
      String(fd.get("workspace")) === "business" ? "/business/expenses" : "/app/expenses",
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <Link
          href="/app/expenses"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft size={16} />
          Back to expenses
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Add expense</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Saves to your Synsera workspace (local or Supabase). Never enter M-PESA PIN or bank
          passwords.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-xl border border-border bg-bg-surface p-5 sm:p-6"
      >
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" placeholder="e.g. Internet fibre" required />
        </div>
        <div>
          <Label htmlFor="merchant">Merchant</Label>
          <Input id="merchant" name="merchant" placeholder="e.g. Safaricom" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="amount">Amount (KES)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              min={1}
              placeholder="4500"
              required
              className="money"
            />
          </div>
          <div>
            <Label htmlFor="cycle">Billing cycle</Label>
            <Select id="cycle" name="cycle" defaultValue="monthly">
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="weekly">Weekly</option>
              <option value="custom">Custom</option>
            </Select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="nextBillingDate">Next billing date</Label>
            <Input
              id="nextBillingDate"
              name="nextBillingDate"
              type="date"
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select id="category" name="category" defaultValue="Utilities">
              <option>Entertainment</option>
              <option>Software</option>
              <option>Utilities</option>
              <option>Health</option>
              <option>Other</option>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="workspace">Workspace</Label>
          <Select id="workspace" name="workspace" defaultValue="personal">
            <option value="personal">Personal</option>
            <option value="business">Business</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="paymentMethod">Payment method</Label>
          <Select id="paymentMethod" name="paymentMethod" defaultValue="M-PESA AutoPay">
            <option>M-PESA AutoPay</option>
            <option>M-PESA Till</option>
            <option>Card</option>
            <option>Bank transfer</option>
            <option>Manual</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea id="notes" name="notes" placeholder="Optional context" />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Saving…" : "Save expense"}
          </Button>
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
