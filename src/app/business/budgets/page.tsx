"use client";
import { PageHeader } from "@/components/app/page-header";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { useWorkspaceData } from "@/lib/workspace-store";
import { formatKES } from "@/lib/format";

export default function BudgetsPage() {
  const { budgets } = useWorkspaceData();
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Budgets" description="Department spend vs limits." />
      <SimpleTable headers={["Department","Limit","Spent","Remaining","Utilisation"]}>
        {budgets.map(b => {
          const pct = Math.round((b.spent/b.limit)*100);
          return (<tr key={b.id}><Td>{b.dept}</Td><Td>{formatKES(b.limit)}</Td><Td>{formatKES(b.spent)}</Td><Td right>{formatKES(b.limit-b.spent)}</Td><Td right>{pct}%</Td></tr>);
        })}
      </SimpleTable>
    </div>
  );
}
