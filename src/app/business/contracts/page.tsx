"use client";

import { FormEvent, useState } from "react";
import { PageHeader } from "@/components/app/page-header";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Input, Label } from "@/components/ui/input";
import { useWorkspaceData } from "@/lib/workspace-store";
import { formatKES } from "@/lib/format";

export default function ContractsPage() {
  const { contracts, vendors, addContract, updateContract } = useWorkspaceData();
  const [open, setOpen] = useState(false);

  function onAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const value = Number(fd.get("value"));
    const name = String(fd.get("name") || "").trim();
    const vendor = String(fd.get("vendor") || "").trim();
    if (!name || !vendor || !(value > 0)) return;
    addContract({
      name,
      vendor,
      renews: String(fd.get("renews") || new Date().toISOString().slice(0, 10)),
      noticeDays: Number(fd.get("noticeDays") || 30),
      value,
    });
    setOpen(false);
    e.currentTarget.reset();
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Contracts"
        description="Renewal dates and notice windows in KES."
        action={
          <Button size="sm" onClick={() => setOpen((v) => !v)}>
            {open ? "Close" : "Add contract"}
          </Button>
        }
      />

      {open && (
        <form
          onSubmit={onAdd}
          className="grid gap-3 rounded-xl border border-border bg-bg-surface p-5 sm:grid-cols-2"
        >
          <div>
            <Label htmlFor="name">Contract</Label>
            <Input id="name" name="name" required placeholder="Microsoft 365 annual" />
          </div>
          <div>
            <Label htmlFor="vendor">Vendor</Label>
            <Input
              id="vendor"
              name="vendor"
              required
              list="vendor-list"
              placeholder="Vendor name"
            />
            <datalist id="vendor-list">
              {vendors.map((v) => (
                <option key={v.id} value={v.name} />
              ))}
            </datalist>
          </div>
          <div>
            <Label htmlFor="renews">Renews</Label>
            <Input id="renews" name="renews" type="date" required />
          </div>
          <div>
            <Label htmlFor="noticeDays">Notice (days)</Label>
            <Input id="noticeDays" name="noticeDays" type="number" defaultValue={30} min={1} />
          </div>
          <div>
            <Label htmlFor="value">Annual value (KES)</Label>
            <Input id="value" name="value" type="number" className="money" min={1} required />
          </div>
          <div className="flex items-end">
            <Button type="submit">Save contract</Button>
          </div>
        </form>
      )}

      {contracts.length === 0 ? (
        <EmptyState
          title="No contracts yet"
          description="Track renewals and notice windows so you never miss a KES renewal."
          action={
            <Button onClick={() => setOpen(true)}>Add first contract</Button>
          }
        />
      ) : (
        <SimpleTable
          headers={["Contract", "Vendor", "Renews", "Notice", "Status", "Value", "Actions"]}
        >
          {contracts.map((c) => (
            <tr key={c.id}>
              <Td>{c.name}</Td>
              <Td>{c.vendor}</Td>
              <Td>{c.renews}</Td>
              <Td>{c.noticeDays}d</Td>
              <Td>
                <Badge tone={c.status === "notice_window" ? "warning" : "neutral"}>
                  {c.status.replace("_", " ")}
                </Badge>
              </Td>
              <Td right>{formatKES(c.value)}</Td>
              <Td right>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    updateContract(c.id, {
                      status:
                        c.status === "notice_window" ? "active" : "notice_window",
                    })
                  }
                >
                  Toggle notice
                </Button>
              </Td>
            </tr>
          ))}
        </SimpleTable>
      )}
    </div>
  );
}
