"use client";
import { PageHeader } from "@/components/app/page-header";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { useWorkspaceData } from "@/lib/workspace-store";
import { formatKES } from "@/lib/format";

export default function MerchantSubsPage() {
  const { customers } = useWorkspaceData();
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Subscriptions" description="Active merchant subscriptions from Customers." />
      <SimpleTable headers={["Customer", "Plan", "Status", "MRR"]}>
        {customers.map((c) => (
          <tr key={c.id}>
            <Td>
              <div>
                {c.name}
                <p className="text-xs text-text-secondary">{c.email}</p>
              </div>
            </Td>
            <Td>{c.plan}</Td>
            <Td className="capitalize">{c.status.replace("_", " ")}</Td>
            <Td right>{formatKES(c.mrr)}</Td>
          </tr>
        ))}
      </SimpleTable>
    </div>
  );
}
