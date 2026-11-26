"use client";
import { PageHeader } from "@/components/app/page-header";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWorkspaceData } from "@/lib/workspace-store";
import { formatKES } from "@/lib/format";

export default function ContractsPage() {
  const { contracts, updateContract } = useWorkspaceData();
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Contracts" description="Renewal dates, notice windows — mark notice or active." />
      <SimpleTable headers={["Contract","Vendor","Renews","Notice","Status","Value","Actions"]}>
        {contracts.map(c => (
          <tr key={c.id}>
            <Td>{c.name}</Td>
            <Td>{c.vendor}</Td>
            <Td>{c.renews}</Td>
            <Td>{c.noticeDays}d</Td>
            <Td><Badge tone={c.status==="notice_window"?"warning":"neutral"}>{c.status.replace("_"," ")}</Badge></Td>
            <Td right>{formatKES(c.value)}</Td>
            <Td right>
              <Button size="sm" variant="secondary" onClick={()=>updateContract(c.id,{status: c.status==="notice_window"?"active":"notice_window"})}>
                Toggle notice
              </Button>
            </Td>
          </tr>
        ))}
      </SimpleTable>
    </div>
  );
}
