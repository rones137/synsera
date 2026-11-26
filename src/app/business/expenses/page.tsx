"use client";

import { PageHeader } from "@/components/app/page-header";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { formatKES } from "@/lib/format";
import { Receipt } from "lucide-react";

export default function BusinessExpensesPage() {
  const { expenses } = useApp();
  const rows = expenses.filter(
    (e) => e.workspace === "business" && !["cancelled", "archived"].includes(e.status),
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Business expenses"
        description="Company recurring spend in KES — tag expenses as Business when adding."
        action={
          <div className="flex gap-2">
            <Button href="/app/expenses/new" size="sm">
              Add expense
            </Button>
            <Button href="/business/vendors" size="sm" variant="secondary">
              Vendors
            </Button>
          </div>
        }
      />
      {rows.length === 0 ? (
        <EmptyState
          icon={<Receipt size={22} />}
          title="No business expenses"
          description="Add an expense and set workspace to Business, or track vendors and purchase requests."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button href="/app/expenses/new" size="sm">
                Add expense
              </Button>
              <Button href="/business/purchase-requests" size="sm" variant="secondary">
                Purchase request
              </Button>
            </div>
          }
        />
      ) : (
        <SimpleTable headers={["Name", "Category", "Status", "Amount"]}>
          {rows.map((e) => (
            <tr key={e.id}>
              <Td>{e.name}</Td>
              <Td>{e.category}</Td>
              <Td>
                <StatusBadge status={e.status} />
              </Td>
              <Td right>{formatKES(e.amount)}</Td>
            </tr>
          ))}
        </SimpleTable>
      )}
    </div>
  );
}
