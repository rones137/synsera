"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { googleOAuthReady, googleSetupHint, startGoogleOAuth } from "@/lib/auth/google";
import { authMode } from "@/lib/supabase/client";

export function GoogleAuthButton({
  mode,
  next = "/app",
}: {
  mode: "login" | "register";
  next?: string;
}) {
  const router = useRouter();
  const { loginWithGoogleDemo } = useApp();
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState(false);
  const configured = googleOAuthReady();

  async function onClick() {
    setLoading(true);
    try {
      if (configured) {
        const started = await startGoogleOAuth(mode === "register" ? "/onboarding" : next);
        if (started) return;
      }
      // Local / demo path when Supabase Google is not configured
      setHint(true);
      loginWithGoogleDemo(mode === "login");
      router.push(mode === "register" ? "/onboarding" : next);
    } catch (e) {
      console.error(e);
      setHint(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="secondary"
        className="w-full"
        disabled={loading}
        onClick={onClick}
      >
        <GoogleGlyph />
        {loading ? "Connecting…" : "Continue with Google"}
      </Button>
      {!configured && (
        <p className="text-xs leading-relaxed text-text-secondary">
          {authMode() === "local"
            ? "Demo Google sign-in (local). For production: "
            : "Google provider not enabled yet. "}
          <button
            type="button"
            className="text-brand hover:underline"
            onClick={() => setHint((v) => !v)}
          >
            connect GOOGLE_CLIENT_ID / Supabase
          </button>
          .
        </p>
      )}
      {hint && !configured && (
        <p className="rounded-lg border border-border bg-bg-raised/50 px-3 py-2 text-xs text-text-secondary">
          {googleSetupHint()}
        </p>
      )}
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.3 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.2-3.5 5.7-6.5 7.1l.1.1 6.2 5.2C37.3 38.4 44 33 44 24c0-1.3-.1-2.5-.4-3.5z"
      />
    </svg>
  );
}
