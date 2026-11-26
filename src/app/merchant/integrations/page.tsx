"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";

const KEY = "synsera-merchant-adapters";

type Adapter = { id: string; name: string; detail: string; connected: boolean };

const DEFAULTS: Adapter[] = [
  {
    id: "intasend",
    name: "IntaSend",
    detail: "KES cards & M-PESA collections (adapter).",
    connected: false,
  },
  {
    id: "stripe",
    name: "Stripe",
    detail: "Card billing via Stripe Connect (adapter).",
    connected: false,
  },
  {
    id: "paystack",
    name: "Paystack",
    detail: "Regional card & transfer adapters.",
    connected: false,
  },
];

export default function Page() {
  const [adapters, setAdapters] = useState<Adapter[]>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setAdapters(JSON.parse(raw) as Adapter[]);
    } catch {
      /* ignore */
    }
  }, []);

  function toggle(id: string) {
    setAdapters((prev) => {
      const next = prev.map((a) =>
        a.id === id ? { ...a, connected: !a.connected } : a,
      );
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Integrations"
        description="Payment-provider adapters — toggles are local preferences until live keys are connected. Synsera never holds funds or raw cards."
      />
      <div className="space-y-3">
        {adapters.map((a) => (
          <div
            key={a.id}
            className="flex flex-col gap-3 rounded-xl border border-border bg-bg-surface p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium">{a.name}</p>
              <p className="text-sm text-text-secondary">{a.detail}</p>
            </div>
            <Button
              variant={a.connected ? "secondary" : "primary"}
              size="sm"
              onClick={() => toggle(a.id)}
            >
              {a.connected ? "Marked connected" : "Mark for setup"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
