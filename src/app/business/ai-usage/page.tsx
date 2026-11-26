"use client";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { formatKES } from "@/lib/format";

const rows = [
  { model: "GPT extraction", tokens: "1.2M", cost: 4200 },
  { model: "OCR receipts", tokens: "340k", cost: 1100 },
  { model: "Contract parse", tokens: "890k", cost: 2800 },
];

export default function AIUsagePage() {
  const total = rows.reduce((s,r)=>s+r.cost,0);
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="AI usage" description="Illustrative AI/API cost monitoring for the company." />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="This month" value={formatKES(total)} emphasize hint="KES · demo meters" />
        <StatCard label="Jobs" value="128" hint="Extractions run" />
        <StatCard label="Budget" value={formatKES(15000)} hint="Soft cap" />
      </div>
      <SimpleTable headers={["Workload","Tokens","Cost"]}>
        {rows.map(r=>(<tr key={r.model}><Td>{r.model}</Td><Td>{r.tokens}</Td><Td right>{formatKES(r.cost)}</Td></tr>))}
      </SimpleTable>
    </div>
  );
}
