"use client";
import { useState } from "react";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function MerchantSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [brand, setBrand] = useState("Synsera Demo Shop");
  const [support, setSupport] = useState("billing@synsera.app");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Merchant settings" description="Checkout brand, support contact, and adapters." sample={false} />
      <form
        className="space-y-5 rounded-xl border border-border bg-bg-surface p-5"
        onSubmit={(e) => {
          e.preventDefault();
          setSaved(true);
          window.setTimeout(() => setSaved(false), 2000);
        }}
      >
        <Badge tone="sample">Demo — no real charges</Badge>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="brand">Checkout brand</Label>
            <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="support">Support email</Label>
            <Input id="support" type="email" value={support} onChange={(e) => setSupport(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="adapter">Primary adapter</Label>
            <Select id="adapter" defaultValue="intasend">
              <option value="intasend">IntaSend (demo)</option>
              <option value="daraja">Daraja / Ratiba (demo)</option>
              <option value="stripe">Stripe (eligibility demo)</option>
            </Select>
          </div>
        </div>
        <p className="text-xs text-text-secondary">
          Synsera Billing uses payment-provider adapters. We never store raw cards or hold funds.
        </p>
        <Button type="submit">{saved ? "Saved" : "Save settings"}</Button>
      </form>
    </div>
  );
}
