"use client";
import { PageHeader } from "@/components/app/page-header";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { Button } from "@/components/ui/button";
import { useWorkspaceData } from "@/lib/workspace-store";

export default function WebhooksPage() {
  const { webhooks, toggleWebhook } = useWorkspaceData();
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Webhooks" description="Endpoint demo list — enable/disable." />
      <SimpleTable headers={["Endpoint","Events","Status","Actions"]}>
        {webhooks.map(w=>(
          <tr key={w.id}>
            <Td>{w.url}</Td><Td>{w.events}</Td><Td>{w.status}</Td>
            <Td right><Button size="sm" variant="secondary" onClick={()=>toggleWebhook(w.id)}>{w.status==="active"?"Disable":"Enable"}</Button></Td>
          </tr>
        ))}
      </SimpleTable>
    </div>
  );
}
