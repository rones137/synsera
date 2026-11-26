"use client";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { useApp } from "@/lib/store";
import { useWorkspaceData } from "@/lib/workspace-store";
import { getDashboardStats } from "@/lib/demo-data";
import { formatKES } from "@/lib/format";

export default function ReportsPage() {
  const { expenses, user } = useApp();
  const { graveyard, healthScore } = useWorkspaceData();
  const personal = expenses.filter(
    (e) => e.workspace === "personal" && !["cancelled", "archived"].includes(e.status),
  );
  const stats = getDashboardStats(personal);
  const graveyardTotal = graveyard.reduce((s, g) => s + g.amount, 0);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Reports" description="Exportable summaries of recurring spend from your local Synsera data." />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Monthly recurring" value={formatKES(stats.monthlyRecurring)} emphasize />
        <StatCard label="Health score" value={String(healthScore)} />
        <StatCard label="Graveyard" value={formatKES(graveyardTotal)} hint="Verified cancellations" />
      </div>
      <Button
        onClick={() => {
          const blob = new Blob(
            [
              JSON.stringify(
                {
                  exportedAt: new Date().toISOString(),
                  user: user?.email,
                  monthlyRecurring: stats.monthlyRecurring,
                  annualized: stats.annualized,
                  healthScore,
                  graveyard,
                  expenseCount: personal.length,
                  brand: "Synsera",
                },
                null,
                2,
              ),
            ],
            { type: "application/json" },
          );
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = "synsera-personal-report.json";
          a.click();
        }}
      >
        Download JSON summary
      </Button>
    </div>
  );
}
