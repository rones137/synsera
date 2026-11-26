"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/lib/store";

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
 * Never returns null (avoids blank UI / dropped Cache Component segments).
 * Auto-seeds a demo session for workspace routes.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const { ready, user, login } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const seeded = useRef(false);

  useEffect(() => {
    if (!ready) return;

    if (!user) {
      const skip =
        typeof window !== "undefined" &&
        localStorage.getItem("synsera-skip-auth") === "1";
      if (skip || isWorkspacePath(pathname)) {
        if (!seeded.current) {
          seeded.current = true;
          login("blaise@synsera.app", "demo", "Blaise Rolys");
        }
        return;
      }
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!user.onboardingComplete && !pathname.startsWith("/onboarding")) {
      router.replace("/onboarding");
    }
  }, [ready, user, router, pathname, login]);

  if (!ready) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <LoadingScreen
        label={
          isWorkspacePath(pathname)
            ? "Opening Synsera demo…"
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
