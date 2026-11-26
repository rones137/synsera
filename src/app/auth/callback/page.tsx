"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { SynseraLogo } from "@/components/ui/logo";

function CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setError("Supabase is not configured on this deploy.");
      return;
    }
    let cancelled = false;
    (async () => {
      const { error: err } = await supabase.auth.exchangeCodeForSession(
        window.location.href,
      );
      if (cancelled) return;
      if (err) {
        // Hash-based sessions also work via detectSessionInUrl
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          setError(err.message);
          return;
        }
      }
      const next = params.get("next") || "/app";
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarding_complete")
          .eq("id", user.id)
          .maybeSingle();
        router.replace(
          profile?.onboarding_complete === false ? "/onboarding" : next,
        );
      } else {
        router.replace("/login");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router, params]);

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4 bg-bg-app px-4">
      <SynseraLogo href="/" />
      <p className="text-sm text-text-secondary">
        {error || "Finishing Google sign-in…"}
      </p>
      {error && (
        <a href="/login" className="text-sm text-brand hover:underline">
          Back to login
        </a>
      )}
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full items-center justify-center bg-bg-app text-sm text-text-secondary">
          Loading…
        </div>
      }
    >
      <CallbackInner />
    </Suspense>
  );
}
