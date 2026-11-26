"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "");
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      sessionStorage.setItem(
        "synsera-session",
        JSON.stringify({ name, email, at: Date.now() }),
      );
      setLoading(false);
      router.push("/app");
    }, 700);
  }

  return (
    <AuthShell
      title="Create your Synsera account"
      subtitle="Start with Personal. Add Business when you’re ready."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-brand hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" autoComplete="name" placeholder="Blaise Rolys" required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            minLength={8}
            required
          />
        </div>
        <div>
          <Label htmlFor="workspace">Primary workspace</Label>
          <Select id="workspace" name="workspace" defaultValue="personal">
            <option value="personal">Personal</option>
            <option value="business">Business (coming soon)</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="country">Country / currency</Label>
          <Select id="country" name="country" defaultValue="KE">
            <option value="KE">Kenya · KES</option>
            <option value="UG">Uganda · UGX</option>
            <option value="TZ">Tanzania · TZS</option>
            <option value="RW">Rwanda · RWF</option>
          </Select>
        </div>
        {error && <p className="text-sm text-brand">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating…" : "Create account"}
        </Button>
        <p className="text-xs text-text-secondary">
          By continuing you agree that Synsera will never request M-PESA PINs or bank
          passwords. Auth is mock/client-ready for MVP — Supabase can be wired next.
        </p>
      </form>
    </AuthShell>
  );
}
