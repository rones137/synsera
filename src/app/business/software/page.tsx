"use client";
import Link from "next/link";
import { PageHeader } from "@/components/app/page-header";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { formatKES } from "@/lib/format";

export default function SoftwarePage() {
  const { expenses } = useApp();
  const rows = expenses.filter(
    (e) =>
      e.workspace === "business" &&
      ["Software", "Cloud"].includes(e.category) &&
      !["cancelled", "archived"].includes(e.status),
  );
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Software"
        description="SaaS tools for your company — live from workspace expenses."
        action={
          <Link href="/business/expenses">
            <Button size="sm" variant="secondary">
              All expenses
            </Button>
          </Link>
        }
      />
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
    </div>
  );
}
