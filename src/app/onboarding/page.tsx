"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { useApp } from "@/lib/store";
import type { WorkspaceKind } from "@/lib/types";

const steps = ["workspace", "currency", "notifications", "first-expense"] as const;

export default function OnboardingPage() {
  const { user, completeOnboarding, addExpense, ready } = useApp();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [workspace, setWorkspace] = useState<WorkspaceKind>("personal");

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-text-secondary">
        Loading…
      </div>
    );
  }

  if (!user) {
    router.replace("/register");
    return null;
  }

  if (user.onboardingComplete) {
    router.replace("/app");
    return null;
  }

  function next() {
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function finishFirstExpense(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const amount = Number(fd.get("amount"));
    if (amount > 0) {
      addExpense({
        name: String(fd.get("name") || "My first expense"),
        merchant: String(fd.get("merchant") || "Manual"),
        amount,
        cycle: "monthly",
        nextBillingDate: String(fd.get("nextBillingDate") || "2026-12-20"),
        category: String(fd.get("category") || "Other"),
        paymentMethod: String(fd.get("paymentMethod") || "Manual"),
        workspace: "personal",
      });
    }
    completeOnboarding({
      workspacesEnabled: ["personal", "business", "merchant"],
      currency: "KES",
      country: user!.country || "KE",
    });
    router.push("/app");
  }

  return (
    <AuthShell
      title="Set up Synsera"
      subtitle={`Step ${step + 1} of ${steps.length} — Your Money. Your Rules.`}
    >
      {step === 0 && (
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Choose your primary workspace. You can switch later.
          </p>
          <div className="grid gap-2">
            {(
              [
                ["personal", "Personal — household recurring"],
                ["business", "Business — freelancers & SMEs"],
                ["merchant", "Merchant — billing (demo)"],
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
              Stage 1 defaults to KES for Kenya/EA. Change later in Settings.
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

      {step === 3 && (
        <form onSubmit={finishFirstExpense} className="space-y-4">
          <p className="text-sm text-text-secondary">
            Add your first recurring expense (or skip with a demo amount).
          </p>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue="Netflix Premium" required />
          </div>
          <div>
            <Label htmlFor="amount">Amount (KES)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              defaultValue={1400}
              min={1}
              className="money"
              required
            />
          </div>
          <div>
            <Label htmlFor="nextBillingDate">Next billing</Label>
            <Input
              id="nextBillingDate"
              name="nextBillingDate"
              type="date"
              defaultValue="2026-12-01"
            />
          </div>
          <input type="hidden" name="merchant" value="Netflix" />
          <input type="hidden" name="category" value="Entertainment" />
          <input type="hidden" name="paymentMethod" value="Card ···· 4281" />
          <Button type="submit" className="w-full">
            Go to dashboard
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
