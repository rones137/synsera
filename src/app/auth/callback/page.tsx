"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import {
  ensureProfileRow,
  userProfileFromSupabase,
} from "@/lib/supabase/profile";
import { SynseraLogo } from "@/components/ui/logo";

function readNext(params: URLSearchParams): string {
  const fromQuery = params.get("next");
  if (fromQuery && fromQuery.startsWith("/")) return fromQuery;
  try {
    const stored = sessionStorage.getItem("synsera-auth-next");
    if (stored && stored.startsWith("/")) return stored;
  } catch {
    /* ignore */
  }
  return "/app";
}

function CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setError("Supabase is not configured on this deploy. Open the latest host URL.");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const oauthError =
          params.get("error_description") || params.get("error");
        if (oauthError) {
          setError(oauthError);
          return;
        }

        // PKCE: exchangeCodeForSession expects the `code` string — not the full URL.
        const code = params.get("code");
        if (code) {
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            // detectSessionInUrl may have already exchanged on client init
            const {
              data: { session },
            } = await supabase.auth.getSession();
            if (!session) {
              setError(exchangeError.message);
              return;
            }
          }
        } else {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (!session) {
            setError("No authorization code returned. Check Supabase Redirect URLs.");
            return;
          }
        }

        if (cancelled) return;

        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setError("Signed in with Google, but no user session was created.");
          return;
        }

        const profile = await userProfileFromSupabase(supabase, user);
        await ensureProfileRow(supabase, user, profile);

        // Persist a bridge so AppProvider picks up immediately even before onAuthStateChange
        try {
          sessionStorage.setItem(
            "synsera-auth-bridge",
            JSON.stringify({ at: Date.now(), onboardingComplete: profile.onboardingComplete }),
          );
        } catch {
          /* ignore */
        }

        const next = readNext(params);
        try {
          sessionStorage.removeItem("synsera-auth-next");
        } catch {
          /* ignore */
        }

        router.replace(
          profile.onboardingComplete === false ? "/onboarding" : next,
        );
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Google sign-in failed.");
        }
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
