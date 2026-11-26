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
  const [text, setText] = useState(SAMPLE_CSV.trim());
  const [msg, setMsg] = useState("");

  function onImport() {
    const items = parseExpenseCsv(text);
    if (!items.length) {
      setMsg("No valid rows found. Check headers: name,merchant,amount,cycle,nextBillingDate,category,paymentMethod");
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
        description="Paste or edit sample CSV — rows become recurring expenses (local persistence)."
      />
      <div className="rounded-xl border border-border bg-bg-surface p-5 space-y-4">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[220px] font-mono text-xs"
        />
        <div className="flex gap-2">
          <Button onClick={onImport}>Import expenses</Button>
          <Button variant="secondary" onClick={() => setText(SAMPLE_CSV.trim())}>
            Reset sample
          </Button>
        </div>
        {msg && <p className="text-sm text-brand">{msg}</p>}
        <p className="text-xs text-text-secondary">
          Sample file also at <code className="text-text-primary">/samples/expenses.csv</code>.
          No bank passwords required.
        </p>
      </div>
    </div>
  );
}
