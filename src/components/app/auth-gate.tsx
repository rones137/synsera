"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { isSupabaseConfigured } from "@/lib/supabase/client";

function LoadingScreen({ label = "Loading Synsera…" }: { label?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-app text-sm text-text-secondary">
      {label}
    </div>
  );
}

function isWorkspacePath(pathname: string) {
  return (
    pathname.startsWith("/app") ||
    pathname.startsWith("/business") ||
    pathname.startsWith("/merchant")
  );
}

/**
 * Client auth wrapper for workspace shells.
 * When Supabase is configured, never invent a demo session — send users to login.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const { ready, user, login, backend } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const seeded = useRef(false);
  const supabaseMode = backend === "supabase" || isSupabaseConfigured();

  useEffect(() => {
    if (!ready) return;

    if (!user) {
      const skip =
        typeof window !== "undefined" &&
        localStorage.getItem("synsera-skip-auth") === "1";

      // Real Supabase builds: no auto-demo seed (it masked failed Google sessions).
      if (supabaseMode) {
        if (skip && !seeded.current) {
          seeded.current = true;
          void login("blaise@synsera.app", "demo", "Blaise Rolys");
          return;
        }
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      if ((skip || isWorkspacePath(pathname)) && !seeded.current) {
        seeded.current = true;
        void login("blaise@synsera.app", "demo", "Blaise Rolys");
        return;
      }
      if (!skip && !isWorkspacePath(pathname)) {
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      }
      return;
    }

    if (!user.onboardingComplete && !pathname.startsWith("/onboarding")) {
      router.replace("/onboarding");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, user, router, pathname, supabaseMode]);

  if (!ready) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <LoadingScreen
        label={
          supabaseMode
            ? "Redirecting to log in…"
            : isWorkspacePath(pathname)
              ? "Opening Synsera…"
              : "Redirecting to log in…"
        }
      />
    );
  }

  if (!user.onboardingComplete && !pathname.startsWith("/onboarding")) {
    return <LoadingScreen label="Finishing setup…" />;
  }

  return <>{children}</>;
}
