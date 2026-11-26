"use client";
import { useState } from "react";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { useTheme, type ThemeMode } from "@/components/theme/theme-provider";

export default function BusinessSettingsPage() {
  const { theme, setTheme } = useTheme();
  const [saved, setSaved] = useState(false);
  const [company, setCompany] = useState("Rolys Ventures Ltd");
  const [tin, setTin] = useState("P051234567X");
  const [approvals, setApprovals] = useState(true);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Business settings" description="Company profile, approval policy, and display." sample={false} />
      <form
        className="space-y-5 rounded-xl border border-border bg-bg-surface p-5"
        onSubmit={(e) => {
          e.preventDefault();
          setSaved(true);
          window.setTimeout(() => setSaved(false), 2000);
        }}
      >
        <h2 className="font-semibold">Company</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="company">Legal name</Label>
            <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="tin">KRA PIN</Label>
            <Input id="tin" value={tin} onChange={(e) => setTin(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="currency">Reporting currency</Label>
            <Select id="currency" defaultValue="KES">
              <option value="KES">KES</option>
              <option value="USD">USD</option>
            </Select>
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
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={approvals}
            onChange={(e) => setApprovals(e.target.checked)}
            className="rounded border-border"
          />
          Require approval for purchases above KSh 5,000
        </label>
        <p className="text-xs text-text-secondary">Synsera never asks for bank passwords or M-PESA PINs.</p>
        <Button type="submit">{saved ? "Saved" : "Save settings"}</Button>
      </form>
    </div>
  );
}
