"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/store";
import type { BillingCycle } from "@/lib/types";

export default function ReceiptsPage() {
  const { addExpense } = useApp();
  const router = useRouter();
  const [fileName, setFileName] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [draft, setDraft] = useState<{
    name: string;
    merchant: string;
    amount: number;
    cycle: BillingCycle;
    nextBillingDate: string;
    category: string;
    paymentMethod: string;
  } | null>(null);

  function onFile(file: File | null) {
    if (!file) return;
    setFileName(file.name);
    setExtracting(true);
    // Mock AI extraction — deterministic demo draft
    window.setTimeout(() => {
      setDraft({
        name: "GitHub Team",
        merchant: "GitHub",
        amount: 2200,
        cycle: "monthly",
        nextBillingDate: "2026-12-18",
        category: "Software",
        paymentMethod: "Card ···· 4281",
      });
      setExtracting(false);
    }, 900);
  }

  function confirmDraft() {
    if (!draft) return;
    addExpense({
      ...draft,
      confirmed: true,
      notes: `Extracted from receipt: ${fileName || "upload"} (mock AI)`,
      workspace: "personal",
    });
    router.push("/app/expenses");
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <PageHeader
        title="Receipt upload"
        description="Upload a receipt image/PDF — mock AI fills a draft for you to confirm."
      />

      <div className="rounded-xl border border-dashed border-border bg-bg-surface p-6">
        <Label htmlFor="receipt">Receipt file</Label>
        <Input
          id="receipt"
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => onFile(e.target.files?.[0] || null)}
        />
        {fileName && (
          <p className="mt-2 text-xs text-text-secondary">Selected: {fileName}</p>
        )}
        {extracting && (
          <p className="mt-4 text-sm text-brand animate-pulse">Extracting fields…</p>
        )}
      </div>

      {draft && (
        <div className="rounded-xl border border-border bg-bg-surface p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Draft expense</h2>
            <Badge tone="sample">Mock AI · confirm required</Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Name</Label>
              <Input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Merchant</Label>
              <Input
                value={draft.merchant}
                onChange={(e) => setDraft({ ...draft, merchant: e.target.value })}
              />
            </div>
            <div>
              <Label>Amount (KES)</Label>
              <Input
                type="number"
                className="money"
                value={draft.amount}
                onChange={(e) =>
                  setDraft({ ...draft, amount: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <Label>Cycle</Label>
              <Select
                value={draft.cycle}
                onChange={(e) =>
                  setDraft({ ...draft, cycle: e.target.value as BillingCycle })
                }
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="weekly">Weekly</option>
              </Select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={confirmDraft}>Confirm &amp; save</Button>
            <Button variant="secondary" onClick={() => setDraft(null)}>
              Discard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
