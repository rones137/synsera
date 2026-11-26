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
        description="Company recurring spend — add via Personal expense form with Business workspace later, or track vendors."
        action={
          <Button href="/business/vendors" size="sm" variant="secondary">
            Vendors
          </Button>
        }
      />
      {rows.length === 0 ? (
        <EmptyState
          icon={<Receipt size={22} />}
          title="No business expenses"
          description="Nothing seeded. Import, add vendors, or create purchase requests to start tracking."
          action={<Button href="/business/purchase-requests" size="sm">New purchase request</Button>}
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
