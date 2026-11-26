"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { useApp } from "@/lib/store";
import type { WorkspaceKind } from "@/lib/types";

const steps = ["workspace", "currency", "notifications", "first-expense"] as const;

const HOME: Record<WorkspaceKind, string> = {
  personal: "/app",
  business: "/business",
  merchant: "/merchant",
};

export default function OnboardingPage() {
  const { user, completeOnboarding, addExpense, setWorkspace: setAppWorkspace, ready } =
    useApp();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [workspace, setWorkspace] = useState<WorkspaceKind>("personal");

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/register");
      return;
    }
    if (user.onboardingComplete) {
      router.replace("/app");
    }
  }, [ready, user, router]);

  if (!ready || !user || user.onboardingComplete) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-text-secondary">
        Loading…
      </div>
    );
  }

  function next() {
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function finish(e?: FormEvent<HTMLFormElement>) {
    e?.preventDefault();
    if (e) {
      const fd = new FormData(e.currentTarget);
      const amount = Number(fd.get("amount"));
      if (amount > 0 && workspace === "personal") {
        const nextBilling =
          String(fd.get("nextBillingDate") || "") ||
          new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
        addExpense({
          name: String(fd.get("name") || "Recurring expense"),
          merchant: String(fd.get("merchant") || String(fd.get("name") || "Merchant")),
          amount,
          cycle: "monthly",
          nextBillingDate: nextBilling,
          category: String(fd.get("category") || "Other"),
          paymentMethod: String(fd.get("paymentMethod") || "Manual"),
          workspace: "personal",
        });
      }
    }
    setAppWorkspace(workspace);
    completeOnboarding({
      workspacesEnabled: ["personal", "business", "merchant"],
      currency: "KES",
      country: user!.country || "KE",
    });
    router.push(HOME[workspace]);
  }

  return (
    <AuthShell
      title="Set up Synsera"
      subtitle={`Step ${step + 1} of ${steps.length} — Your Money. Your Rules.`}
    >
      {step === 0 && (
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Choose your primary workspace. You can switch anytime from the sidebar.
          </p>
          <div className="grid gap-2">
            {(
              [
                ["personal", "Personal — household recurring"],
                ["business", "Business — freelancers & SMEs"],
                ["merchant", "Merchant — plans & billing"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setWorkspace(id)}
                className={`rounded-lg border px-4 py-3 text-left text-sm ${
                  workspace === id
                    ? "border-brand bg-red-tint text-brand"
                    : "border-border text-text-secondary"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <Button className="w-full" onClick={next}>
            Continue
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <Label>Country / currency</Label>
            <Select defaultValue="KE" disabled>
              <option value="KE">Kenya · KES</option>
            </Select>
            <p className="mt-2 text-xs text-text-secondary">
              Defaults to KES for Kenya &amp; East Africa. Change later in Settings.
            </p>
          </div>
          <Button className="w-full" onClick={next}>
            Continue
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Renewal reminders 7 days ahead. Quiet hours 22:00–07:00 Africa/Nairobi.
            Adjust anytime in Settings. We never ask for M-PESA PIN or bank passwords.
          </p>
          <Button className="w-full" onClick={next}>
            Looks good
          </Button>
        </div>
      )}

      {step === 3 && workspace === "personal" && (
        <form onSubmit={finish} className="space-y-4">
          <p className="text-sm text-text-secondary">
            Optionally add your first recurring expense in KES — or skip and start empty.
          </p>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="e.g. Internet fibre" />
          </div>
          <div>
            <Label htmlFor="merchant">Merchant</Label>
            <Input id="merchant" name="merchant" placeholder="e.g. Safaricom" />
          </div>
          <div>
            <Label htmlFor="amount">Amount (KES)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              min={0}
              placeholder="0"
              className="money"
            />
          </div>
          <div>
            <Label htmlFor="nextBillingDate">Next billing</Label>
            <Input id="nextBillingDate" name="nextBillingDate" type="date" />
          </div>
          <input type="hidden" name="category" value="Other" />
          <input type="hidden" name="paymentMethod" value="Manual" />
          <Button type="submit" className="w-full">
            Go to Personal
          </Button>
          <button
            type="button"
            className="w-full text-center text-sm text-text-secondary hover:text-brand"
            onClick={() => finish()}
          >
            Skip — empty workspace
          </button>
        </form>
      )}

      {step === 3 && workspace !== "personal" && (
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            You&apos;ll land in {workspace === "business" ? "Business" : "Merchant"} with an
            empty workspace. Add vendors, plans, or expenses when you&apos;re ready.
          </p>
          <Button className="w-full" onClick={() => finish()}>
            Open {workspace === "business" ? "Business" : "Merchant"}
          </Button>
        </div>
      )}
    </AuthShell>
  );
}
