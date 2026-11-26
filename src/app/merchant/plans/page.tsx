"use client";

import { useState } from "react";
import { PageHeader } from "@/components/app/page-header";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input, Label } from "@/components/ui/input";
import { useWorkspaceData } from "@/lib/workspace-store";
import { formatKES } from "@/lib/format";

export default function PlansPage() {
  const { plans, addPlan, togglePlan } = useWorkspaceData();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(1499);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Plans"
        description="Create KES subscription plans. No charges until a payment adapter is connected."
      />
      <form
        className="flex flex-wrap gap-3 rounded-xl border border-border bg-bg-surface p-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim() || !(price > 0)) return;
          addPlan(name.trim(), price);
          setName("");
        }}
      >
        <div>
          <Label>Plan name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Starter"
            required
          />
        </div>
        <div>
          <Label>Price KES/mo</Label>
          <Input
            type="number"
            className="money"
            value={price}
            min={1}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>
        <Button type="submit" className="self-end">
          Add plan
        </Button>
      </form>

      {plans.length === 0 ? (
        <EmptyState
          title="No plans yet"
          description="Create your first plan, then test checkout without real charges."
        />
      ) : (
        <SimpleTable
          headers={["Plan", "Price", "Subscribers", "Status", "Actions"]}
        >
          {plans.map((p) => (
            <tr key={p.id}>
              <Td>{p.name}</Td>
              <Td>
                {formatKES(p.price)}/{p.interval}
              </Td>
              <Td>{p.subscribers}</Td>
              <Td>{p.active ? "Active" : "Off"}</Td>
              <Td right>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => togglePlan(p.id)}
                >
                  {p.active ? "Deactivate" : "Activate"}
                </Button>
              </Td>
            </tr>
          ))}
        </SimpleTable>
      )}
    </div>
  );
}
