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
 * Seeds at most once per mount (ref) to avoid remount storms that detach sidebar links.
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
    // Intentionally omit `login` from deps — stable enough; including it remounted shells.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, user, router, pathname]);

  if (!ready) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <LoadingScreen
        label={
          isWorkspacePath(pathname)
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
