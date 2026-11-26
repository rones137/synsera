"use client";

import { FormEvent, useState } from "react";
import { PageHeader } from "@/components/app/page-header";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input, Label } from "@/components/ui/input";
import { useWorkspaceData } from "@/lib/workspace-store";

export default function LicensesPage() {
  const { licenses, addLicense, reclaimLicense } = useWorkspaceData();
  const [open, setOpen] = useState(false);

  function onAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const total = Number(fd.get("total"));
    const used = Number(fd.get("used"));
    if (!name || !(total > 0)) return;
    const waste = Math.max(0, total - used);
    addLicense({ name, total, used: Math.min(used, total), waste });
    setOpen(false);
    e.currentTarget.reset();
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Licenses"
        description="Seat utilisation — reclaim unused seats."
        action={
          <Button size="sm" onClick={() => setOpen((v) => !v)}>
            {open ? "Close" : "Add license"}
          </Button>
        }
      />

      {open && (
        <form
          onSubmit={onAdd}
          className="grid gap-3 rounded-xl border border-border bg-bg-surface p-5 sm:grid-cols-4"
        >
          <div className="sm:col-span-2">
            <Label htmlFor="name">Product</Label>
            <Input id="name" name="name" required placeholder="Adobe Creative Cloud" />
          </div>
          <div>
            <Label htmlFor="total">Total seats</Label>
            <Input id="total" name="total" type="number" min={1} required />
          </div>
          <div>
            <Label htmlFor="used">Used</Label>
            <Input id="used" name="used" type="number" min={0} defaultValue={0} />
          </div>
          <div className="sm:col-span-4">
            <Button type="submit">Save license</Button>
          </div>
        </form>
      )}

      {licenses.length === 0 ? (
        <EmptyState
          title="No licenses tracked"
          description="Add software seats to spot waste before renewal."
          action={<Button onClick={() => setOpen(true)}>Add license</Button>}
        />
      ) : (
        <SimpleTable headers={["License", "Total", "Used", "Waste", "Actions"]}>
          {licenses.map((l) => (
            <tr key={l.id}>
              <Td>{l.name}</Td>
              <Td>{l.total}</Td>
              <Td>{l.used}</Td>
              <Td right>{l.waste}</Td>
              <Td right>
                <Button
                  size="sm"
                  disabled={l.waste === 0}
                  onClick={() => reclaimLicense(l.id)}
                >
                  Reclaim waste
                </Button>
              </Td>
            </tr>
          ))}
        </SimpleTable>
      )}
    </div>
  );
}
