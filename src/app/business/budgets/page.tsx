"use client";

import { FormEvent, useState } from "react";
import { PageHeader } from "@/components/app/page-header";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input, Label } from "@/components/ui/input";
import { useWorkspaceData } from "@/lib/workspace-store";
import { formatKES } from "@/lib/format";

export default function BudgetsPage() {
  const { budgets, addBudget } = useWorkspaceData();
  const [open, setOpen] = useState(false);

  function onAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const dept = String(fd.get("dept") || "").trim();
    const limit = Number(fd.get("limit"));
    const spent = Number(fd.get("spent") || 0);
    if (!dept || !(limit > 0)) return;
    addBudget({ dept, limit, spent });
    setOpen(false);
    e.currentTarget.reset();
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Budgets"
        description="Department spend vs limits in KES."
        action={
          <Button size="sm" onClick={() => setOpen((v) => !v)}>
            {open ? "Close" : "Add budget"}
          </Button>
        }
      />

      {open && (
        <form
          onSubmit={onAdd}
          className="grid gap-3 rounded-xl border border-border bg-bg-surface p-5 sm:grid-cols-3"
        >
          <div>
            <Label htmlFor="dept">Department</Label>
            <Input id="dept" name="dept" required placeholder="Engineering" />
          </div>
          <div>
            <Label htmlFor="limit">Monthly limit (KES)</Label>
            <Input id="limit" name="limit" type="number" className="money" min={1} required />
          </div>
          <div>
            <Label htmlFor="spent">Spent so far (KES)</Label>
            <Input id="spent" name="spent" type="number" className="money" min={0} defaultValue={0} />
          </div>
          <div className="sm:col-span-3">
            <Button type="submit">Save budget</Button>
          </div>
        </form>
      )}

      {budgets.length === 0 ? (
        <EmptyState
          title="No budgets yet"
          description="Set department caps so overspend shows up before month-end."
          action={<Button onClick={() => setOpen(true)}>Add budget</Button>}
        />
      ) : (
        <SimpleTable
          headers={["Department", "Limit", "Spent", "Remaining", "Utilisation"]}
        >
          {budgets.map((b) => {
            const pct = b.limit ? Math.round((b.spent / b.limit) * 100) : 0;
            return (
              <tr key={b.id}>
                <Td>{b.dept}</Td>
                <Td>{formatKES(b.limit)}</Td>
                <Td>{formatKES(b.spent)}</Td>
                <Td right>{formatKES(b.limit - b.spent)}</Td>
                <Td right>{pct}%</Td>
              </tr>
            );
          })}
        </SimpleTable>
      )}
    </div>
  );
}
