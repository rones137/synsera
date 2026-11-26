"use client";
import { useState } from "react";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const adapters = [
  { id: "intasend", name: "IntaSend", region: "Kenya / EA" },
  { id: "daraja", name: "Daraja / Ratiba", region: "M-PESA schedules" },
  { id: "paysasa", name: "Paysasa", region: "Kenya" },
  { id: "stripe", name: "Stripe", region: "Eligibility check" },
];

export default function MerchantIntegrationsPage() {
  const [on, setOn] = useState<Record<string, boolean>>({ intasend: true });
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader title="Integrations" description="Payment-provider adapters — connect demo toggles only." />
      <div className="grid gap-4 sm:grid-cols-2">
        {adapters.map((a) => (
          <div key={a.id} className="rounded-xl border border-border bg-bg-surface p-5 flex justify-between gap-3">
            <div>
              <p className="font-medium">{a.name}</p>
              <p className="text-xs text-text-secondary mt-1">{a.region}</p>
              <Badge tone="sample" className="mt-2">
                Adapter · no funds held
              </Badge>
            </div>
            <Button
              size="sm"
              variant={on[a.id] ? "secondary" : "primary"}
              onClick={() => setOn((s) => ({ ...s, [a.id]: !s[a.id] }))}
            >
              {on[a.id] ? "Connected" : "Connect"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
