"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { useTheme, type ThemeMode } from "@/components/theme/theme-provider";

const KEY = "synsera-merchant-settings";

type MerchSettings = {
  brand: string;
  supportEmail: string;
};

function load(): MerchSettings {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as MerchSettings;
  } catch {
    /* ignore */
  }
  return { brand: "", supportEmail: "" };
}

export default function MerchantSettingsPage() {
  const { theme, setTheme } = useTheme();
  const [saved, setSaved] = useState(false);
  const [brand, setBrand] = useState("");
  const [supportEmail, setSupportEmail] = useState("");

  useEffect(() => {
    const s = load();
    setBrand(s.brand);
    setSupportEmail(s.supportEmail);
  }, []);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Merchant settings"
        description="Brand and support details for checkout. No payment secrets stored here."
      />
      <form
        className="space-y-5 rounded-xl border border-border bg-bg-surface p-5"
        onSubmit={(e) => {
          e.preventDefault();
          localStorage.setItem(
            KEY,
            JSON.stringify({ brand, supportEmail } satisfies MerchSettings),
          );
          setSaved(true);
          window.setTimeout(() => setSaved(false), 2000);
        }}
      >
        <div>
          <Label htmlFor="brand">Brand name</Label>
          <Input
            id="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Your shop"
          />
        </div>
        <div>
          <Label htmlFor="email">Support email</Label>
          <Input
            id="email"
            type="email"
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
            placeholder="billing@yourshop.co.ke"
          />
        </div>
        <div>
          <Label htmlFor="theme">Theme</Label>
          <Select
            id="theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value as ThemeMode)}
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="system">System</option>
          </Select>
        </div>
        <p className="text-xs text-text-secondary">
          Payment adapters connect later — Synsera never holds funds or raw cards.
        </p>
        <Button type="submit">{saved ? "Saved" : "Save settings"}</Button>
      </form>
    </div>
  );
}
