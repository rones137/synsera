"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { useApp } from "@/lib/store";
import { useWorkspaceData } from "@/lib/workspace-store";
import { useTheme, type ThemeMode } from "@/components/theme/theme-provider";
import type { ThemeMode as ProfileTheme } from "@/lib/types";

function BlacklistPanel() {
  const { blacklist, addBlacklist, removeBlacklist } = useWorkspaceData();
  const [merchant, setMerchant] = useState("");
  const [reason, setReason] = useState("");
  return (
    <div className="rounded-xl border border-border bg-bg-surface p-5 space-y-4">
      <h2 className="font-semibold">Merchant blacklist</h2>
      <p className="text-sm text-text-secondary">
        Flag merchants you do not want to resubscribe to. Local demo only.
      </p>
      <ul className="space-y-2">
        {blacklist.map((b) => (
          <li
            key={b.id}
            className="flex items-center justify-between gap-3 text-sm border-b border-border/60 pb-2"
          >
            <span>
              <span className="font-medium">{b.merchant}</span>
              <span className="text-text-secondary"> · {b.reason}</span>
            </span>
            <Button size="sm" variant="ghost" onClick={() => removeBlacklist(b.id)}>
              Remove
            </Button>
          </li>
        ))}
      </ul>
      <form
        className="flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!merchant.trim()) return;
          addBlacklist(merchant.trim(), reason.trim() || "Blacklisted");
          setMerchant("");
          setReason("");
        }}
      >
        <Input
          value={merchant}
          onChange={(e) => setMerchant(e.target.value)}
          placeholder="Merchant"
          className="max-w-[160px]"
        />
        <Input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason"
          className="max-w-[180px]"
        />
        <Button type="submit" size="sm">
          Add
        </Button>
      </form>
    </div>
  );
}

export default function SettingsPage() {
  const { user, updateProfile, logout, deleteAccount, expenses, resetDemoData } =
    useApp();
  const { setTheme } = useTheme();
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const theme = String(fd.get("theme")) as ProfileTheme;
    updateProfile({
      name: String(fd.get("name")),
      email: String(fd.get("email")),
      currency: String(fd.get("currency")) as "KES",
      timezone: String(fd.get("timezone")),
      theme,
      notifications: {
        email: fd.get("emailNotif") === "on",
        push: fd.get("pushNotif") === "on",
        renewalDays: Number(fd.get("renewalDays") || 7),
        quietHoursStart: String(fd.get("quietStart") || "22:00"),
        quietHoursEnd: String(fd.get("quietEnd") || "07:00"),
      },
    });
    setTheme(theme as ThemeMode);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  function exportData() {
    const blob = new Blob(
      [JSON.stringify({ user, expenses, exportedAt: new Date().toISOString() }, null, 2)],
      { type: "application/json" },
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "synsera-export.json";
    a.click();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Settings"
        description="Profile, theme, notifications, currency, export, and account."
        sample={false}
      />

      <form onSubmit={save} className="space-y-5 rounded-xl border border-border bg-bg-surface p-5">
        <h2 className="font-semibold">Profile</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={user.name} required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" defaultValue={user.email} required />
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select id="currency" name="currency" defaultValue={user.currency}>
              <option value="KES">KES</option>
              <option value="UGX">UGX</option>
              <option value="TZS">TZS</option>
              <option value="RWF">RWF</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="timezone">Timezone</Label>
            <Select id="timezone" name="timezone" defaultValue={user.timezone}>
              <option value="Africa/Nairobi">Africa/Nairobi</option>
              <option value="Africa/Kampala">Africa/Kampala</option>
              <option value="Africa/Dar_es_Salaam">Africa/Dar_es_Salaam</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="theme">Theme</Label>
            <Select id="theme" name="theme" defaultValue={user.theme}>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="renewalDays">Renewal reminder (days)</Label>
            <Input
              id="renewalDays"
              name="renewalDays"
              type="number"
              min={1}
              max={30}
              defaultValue={user.notifications.renewalDays}
            />
          </div>
        </div>

        <h2 className="font-semibold pt-2">Notifications</h2>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="emailNotif"
              defaultChecked={user.notifications.email}
            />
            Email
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="pushNotif"
              defaultChecked={user.notifications.push}
            />
            Push
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="quietStart">Quiet hours start</Label>
            <Input
              id="quietStart"
              name="quietStart"
              type="time"
              defaultValue={user.notifications.quietHoursStart}
            />
          </div>
          <div>
            <Label htmlFor="quietEnd">Quiet hours end</Label>
            <Input
              id="quietEnd"
              name="quietEnd"
              type="time"
              defaultValue={user.notifications.quietHoursEnd}
            />
          </div>
        </div>

        <Button type="submit">{saved ? "Saved" : "Save settings"}</Button>
      </form>

      <BlacklistPanel />

      <div className="rounded-xl border border-border bg-bg-surface p-5 space-y-3">
        <h2 className="font-semibold">Data</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={exportData}>
            Export JSON
          </Button>
          <Button variant="secondary" onClick={resetDemoData}>
            Reset demo data
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              logout();
              router.push("/login");
            }}
          >
            Log out
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-brand/30 bg-red-tint/30 p-5 space-y-3">
        <h2 className="font-semibold text-brand">Delete account</h2>
        <p className="text-sm text-text-secondary">
          Clears local Synsera data on this device. Confirm to proceed.
        </p>
        {!confirmDelete ? (
          <Button variant="danger" onClick={() => setConfirmDelete(true)}>
            Delete account…
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="danger"
              onClick={() => {
                deleteAccount();
                router.push("/");
              }}
            >
              Confirm delete
            </Button>
            <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
