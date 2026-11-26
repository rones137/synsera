"use client";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { useWorkspaceData } from "@/lib/workspace-store";

export default function BusinessReportsPage() {
  const data = useWorkspaceData();
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Reports" description="Export vendor, contract, and approval summaries." />
      <Button
        onClick={() => {
          const blob = new Blob(
            [
              JSON.stringify(
                {
                  exportedAt: new Date().toISOString(),
                  vendors: data.vendors.length,
                  contracts: data.contracts.length,
                  purchases: data.purchases,
                  note: "Synsera Business demo export",
                },
                null,
                2,
              ),
            ],
            { type: "application/json" },
          );
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = "synsera-business-report.json";
          a.click();
        }}
      >
        Download JSON report
      </Button>
    </div>
  );
}
