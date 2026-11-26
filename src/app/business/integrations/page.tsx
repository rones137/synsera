"use client";
import { useState } from "react";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";

const items = [
  { id: "email", name: "Work email", detail: "Invoice & renewal detection" },
  { id: "erp", name: "Accounting export", detail: "CSV / QuickBooks-ready" },
  { id: "sso", name: "SSO (demo)", detail: "Illustrative enterprise login" },
];

export default function BusinessIntegrationsPage() {
  const [on, setOn] = useState<Record<string, boolean>>({ email: true });
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Integrations" description="Connect sources — demo toggles. No bank passwords." />
      <div className="space-y-3">
        {items.map((i) => (
          <div key={i.id} className="flex items-center justify-between rounded-xl border border-border bg-bg-surface p-4">
            <div>
              <p className="font-medium">{i.name}</p>
              <p className="text-xs text-text-secondary">{i.detail}</p>
            </div>
            <Button size="sm" variant={on[i.id] ? "secondary" : "primary"} onClick={() => setOn((s) => ({ ...s, [i.id]: !s[i.id] }))}>
              {on[i.id] ? "Connected" : "Connect"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
