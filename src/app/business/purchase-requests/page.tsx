"use client";

import { useState } from "react";
import { PageHeader } from "@/components/app/page-header";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input, Label } from "@/components/ui/input";
import { useWorkspaceData } from "@/lib/workspace-store";
import { formatKES } from "@/lib/format";

export default function PurchaseRequestsPage() {
  const { purchases, addPurchase } = useWorkspaceData();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(5000);
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Purchase requests"
        description="Submit requests in KES — approve from the Approvals inbox."
        action={
          <Button href="/business/approvals" size="sm">
            Open approvals
          </Button>
        }
      />
      <form
        className="flex flex-wrap gap-3 rounded-xl border border-border bg-bg-surface p-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim() || !(amount > 0)) return;
          addPurchase(title.trim(), amount, "You");
          setTitle("");
        }}
      >
        <div>
          <Label>Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Figma seats"
            required
          />
        </div>
        <div>
          <Label>Amount (KES)</Label>
          <Input
            type="number"
            className="money"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>
        <Button type="submit" className="self-end">
          Create request
        </Button>
      </form>
      {purchases.length === 0 ? (
        <EmptyState
          title="No purchase requests"
          description="Create a request above, then approve or reject it in Approvals."
        />
      ) : (
        <SimpleTable headers={["Request", "Requester", "Status", "Amount"]}>
          {purchases.map((p) => (
            <tr key={p.id}>
              <Td>{p.title}</Td>
              <Td>{p.requester}</Td>
              <Td className="capitalize">{p.status}</Td>
              <Td right>{formatKES(p.amount)}</Td>
            </tr>
          ))}
        </SimpleTable>
      )}
    </div>
  );
}
