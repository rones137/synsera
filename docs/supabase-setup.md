# Synsera — Supabase + Google Auth setup

## 1. Create a Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. Copy **Project URL** and **anon public** key into `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## 2. Apply schema

Run `supabase/schema.sql` in the Supabase SQL editor (profiles, expenses, vendors, contracts, alerts, merchant tables, RLS).

## 3. Enable Google provider

1. Google Cloud Console → OAuth 2.0 Client (Web).
2. Add authorized redirect: `https://<PROJECT_REF>.supabase.co/auth/v1/callback`
3. Supabase → Authentication → Providers → Google → paste **Client ID** + **Client Secret**.
4. Add site redirect URLs: `http://localhost:3000/auth/callback` and your production `/auth/callback`.

## 4. Email auth

Email/password works via the same Supabase Auth project once schema + env are set. Confirm email templates if you require verification.

## 5. Without env vars

Synsera runs in **local** mode: empty workspaces, password login, and **Continue with Google** completes a local demo session (no fake Netflix/Adobe seeds).
