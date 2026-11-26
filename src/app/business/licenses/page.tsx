"use client";
import { PageHeader } from "@/components/app/page-header";
import { SimpleTable, Td } from "@/components/app/simple-table";
import { Button } from "@/components/ui/button";
import { useWorkspaceData } from "@/lib/workspace-store";

export default function LicensesPage() {
  const { licenses, reclaimLicense } = useWorkspaceData();
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Licenses" description="Seat utilisation — reclaim waste (demo)." />
      <SimpleTable headers={["License","Total","Used","Waste","Actions"]}>
        {licenses.map(l => (
          <tr key={l.id}>
            <Td>{l.name}</Td>
            <Td>{l.total}</Td>
            <Td>{l.used}</Td>
            <Td right>{l.waste}</Td>
            <Td right>
              <Button size="sm" disabled={l.waste===0} onClick={()=>reclaimLicense(l.id)}>Reclaim waste</Button>
            </Td>
          </tr>
        ))}
      </SimpleTable>
    </div>
  );
}
