"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { useApp } from "@/lib/store";
import type { BillingCycle } from "@/lib/types";

function guessFromFileName(fileName: string) {
  const base = fileName.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim();
  const today = new Date();
  today.setDate(today.getDate() + 30);
  return {
    name: base || "Receipt expense",
    merchant: base.split(" ")[0] || "Merchant",
    amount: 0,
    cycle: "monthly" as BillingCycle,
    nextBillingDate: today.toISOString().slice(0, 10),
    category: "Other",
    paymentMethod: "Manual",
  };
}

export default function ReceiptsPage() {
  const { addExpense } = useApp();
  const router = useRouter();
  const [fileName, setFileName] = useState("");
  const [draft, setDraft] = useState<ReturnType<typeof guessFromFileName> | null>(
    null,
  );

  function onFile(file: File | null) {
    if (!file) return;
    setFileName(file.name);
    // No OCR yet — prefill editable draft from filename; user confirms amounts.
    setDraft(guessFromFileName(file.name));
  }

  function confirmDraft() {
    if (!draft || !draft.amount || draft.amount <= 0) return;
    addExpense({
      ...draft,
      confirmed: true,
      notes: fileName ? `From receipt upload: ${fileName}` : undefined,
      workspace: "personal",
    });
    router.push("/app/expenses");
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <PageHeader
        title="Receipt upload"
        description="Attach a receipt, fill the KES amount, and save a recurring expense. OCR comes later — you confirm every field."
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
        {!draft && (
          <p className="mt-4 text-sm text-text-secondary">
            Or{" "}
            <button
              type="button"
              className="text-brand hover:underline"
              onClick={() => setDraft(guessFromFileName("Manual entry"))}
            >
              enter without a file
            </button>
            .
          </p>
        )}
      </div>

      {draft && (
        <div className="space-y-4 rounded-xl border border-border bg-bg-surface p-5">
          <h2 className="font-semibold">Confirm expense</h2>
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
                min={1}
                value={draft.amount || ""}
                placeholder="0"
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
            <div className="sm:col-span-2">
              <Label>Next billing</Label>
              <Input
                type="date"
                value={draft.nextBillingDate}
                onChange={(e) =>
                  setDraft({ ...draft, nextBillingDate: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={confirmDraft} disabled={!draft.amount}>
              Confirm &amp; save
            </Button>
            <Button variant="secondary" onClick={() => setDraft(null)}>
              Discard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
