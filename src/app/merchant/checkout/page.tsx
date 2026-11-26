"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input, Label } from "@/components/ui/input";
import { useWorkspaceData } from "@/lib/workspace-store";
import { formatKES } from "@/lib/format";

export default function CheckoutPage() {
  const { plans, addCustomer } = useWorkspaceData();
  const active = plans.filter((p) => p.active);
  const [picked, setPicked] = useState(active[0]?.id || "");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const plan = plans.find((p) => p.id === picked) || active[0];

  function onSubscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!plan) return;
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    if (!name || !email) {
      setError("Customer name and email are required.");
      return;
    }
    addCustomer(name, plan.name, email);
    setDone(true);
    setError("");
  }

  if (active.length === 0) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <PageHeader
          title="Checkout"
          description="Preview subscribe flow — no real charges."
        />
        <EmptyState
          title="Create a plan first"
          description="Checkout needs at least one active plan in KES."
          action={
            <Button href="/merchant/plans">Go to plans</Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Checkout"
        description="Hosted checkout preview — adapters only. Synsera never holds funds or raw cards."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {active.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              setPicked(p.id);
              setDone(false);
            }}
            className={`rounded-xl border p-5 text-left ${
              (picked || active[0].id) === p.id
                ? "border-brand bg-red-tint/40"
                : "border-border bg-bg-surface"
            }`}
          >
            <p className="font-medium">{p.name}</p>
            <p className="money mt-2 text-2xl font-semibold">
              {formatKES(p.price)}
              <span className="text-sm text-text-secondary">/mo</span>
            </p>
          </button>
        ))}
      </div>
      <div className="max-w-md rounded-xl border border-border bg-bg-surface p-8">
        <h2 className="text-xl font-semibold">{plan?.name} plan</h2>
        <p className="money mt-2 text-3xl font-semibold">
          {formatKES(plan?.price || 0)}
          <span className="text-sm text-text-secondary">/mo</span>
        </p>
        {!done ? (
          <form onSubmit={onSubscribe} className="mt-6 space-y-3">
            <div>
              <Label htmlFor="name">Customer name</Label>
              <Input id="name" name="name" required placeholder="Amina Otieno" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="amina@example.com"
              />
            </div>
            {error && <p className="text-sm text-brand">{error}</p>}
            <Button type="submit" className="w-full">
              Create trial subscription
            </Button>
          </form>
        ) : (
          <p className="mt-6 text-sm text-success">
            Subscription + open invoice saved under{" "}
            <Link href="/merchant/customers" className="underline">
              Customers
            </Link>
            . No payment processor called.
          </p>
        )}
        <p className="mt-3 text-xs text-text-secondary">
          Local / adapter preview only — never stores raw cards or holds funds.
        </p>
      </div>
    </div>
  );
}
