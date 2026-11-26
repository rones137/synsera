"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { GoogleAuthButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useApp } from "@/lib/store";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { login, user, ready, backend } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const next = params.get("next") || "/app";

  useEffect(() => {
    if (!ready) return;
    if (user?.onboardingComplete) {
      router.replace(next);
    } else if (user && !user.onboardingComplete) {
      router.replace("/onboarding");
    }
  }, [ready, user, router, next]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");
    if (!email || !password) {
      setError("Enter email and password.");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      router.push(next.startsWith("/") ? next : "/app");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to your Synsera workspace."
      footer={
        <>
          New to Synsera?{" "}
          <Link href="/register" className="font-medium text-brand hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <div className="space-y-4">
        <GoogleAuthButton mode="login" next={next} />
        <div className="flex items-center gap-3 text-xs text-text-secondary">
          <span className="h-px flex-1 bg-border" />
          or email
          <span className="h-px flex-1 bg-border" />
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
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
            <div className="mb-1.5 flex items-center justify-between">
              <Label htmlFor="password" className="mb-0">
                Password
              </Label>
              <Link href="/reset-password" className="text-xs text-brand hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-sm text-brand">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Log in"}
          </Button>
          <p className="text-center text-xs text-text-secondary">
            Auth: {backend === "supabase" ? "Supabase" : "local empty workspace"}.
            Password auth kept · Google when configured.
          </p>
          <Link
            href="/app"
            className="block text-center text-sm font-medium text-brand hover:underline"
            onClick={() => {
              try {
                localStorage.setItem("synsera-skip-auth", "1");
              } catch {
                /* ignore */
              }
            }}
          >
            Skip — open empty workspace
          </Link>
        </form>
      </div>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-sm text-text-secondary">Loading…</div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
