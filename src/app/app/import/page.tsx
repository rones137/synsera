"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { parseExpenseCsv } from "@/lib/csv";
import { SAMPLE_CSV } from "@/lib/demo-data";
import { useApp } from "@/lib/store";

export default function ImportPage() {
  const { importExpenses } = useApp();
  const router = useRouter();
  const [text, setText] = useState("");
  const [msg, setMsg] = useState("");

  function onImport() {
    const items = parseExpenseCsv(text);
    if (!items.length) {
      setMsg(
        "No valid rows. Headers: name,merchant,amount,cycle,nextBillingDate,category,paymentMethod",
      );
      return;
    }
    const n = importExpenses(items);
    setMsg(`Imported ${n} expenses into Personal workspace.`);
    window.setTimeout(() => router.push("/app/expenses"), 600);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="CSV import"
        description="Paste your recurring expenses in KES. Rows persist to your account (local or Supabase)."
      />
      <div className="space-y-4 rounded-xl border border-border bg-bg-surface p-5">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`name,merchant,amount,cycle,nextBillingDate,category,paymentMethod\nInternet,Safaricom,4500,monthly,2026-12-01,Utilities,M-PESA`}
          className="min-h-[220px] font-mono text-xs"
        />
        <div className="flex flex-wrap gap-2">
          <Button onClick={onImport} disabled={!text.trim()}>
            Import expenses
          </Button>
          <Button
            variant="secondary"
            onClick={() => setText(SAMPLE_CSV.trim())}
          >
            Load example CSV
          </Button>
          {text && (
            <Button variant="ghost" onClick={() => setText("")}>
              Clear
            </Button>
          )}
        </div>
        {msg && <p className="text-sm text-brand">{msg}</p>}
        <p className="text-xs text-text-secondary">
          Example also at <code className="text-text-primary">/samples/expenses.csv</code>.
          We never ask for bank passwords.
        </p>
      </div>
    </div>
  );
}
