"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/lib/store";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { ready, user, login } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!ready) return;
    // Demo convenience: seed a session so workspace routes work for preview/screenshots
    if (!user) {
      const demo = localStorage.getItem("synsera-skip-auth");
      if (demo === "1" || pathname.startsWith("/app") || pathname.startsWith("/business") || pathname.startsWith("/merchant")) {
        login("blaise@synsera.app", "demo", "Blaise Rolys");
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
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-app text-sm text-text-secondary">
        Loading Synsera…
      </div>
    );
  }

  if (!user) return null;
  if (!user.onboardingComplete && !pathname.startsWith("/onboarding")) return null;

  return <>{children}</>;
}
