# Synsera

**Your Money. Your Rules.**

Recurring financial intelligence for Personal, Business, and Merchant — Kenya/EA first.

## Stack

- Next.js (App Router) + TypeScript + Tailwind v4
- Local empty persistence by default
- Supabase Auth + Postgres when `NEXT_PUBLIC_SUPABASE_*` is set
- Google Sign-In via Supabase Google provider (or local Continue with Google demo)

## Run locally

```bash
npm install
cp .env.example .env.local   # optional — fill Supabase keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase + Google

See [docs/supabase-setup.md](docs/supabase-setup.md). Apply `supabase/schema.sql`, then set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Google Client ID/Secret in the Supabase Auth dashboard

## Brand

Synsera only. Never ask for M-PESA PIN or bank passwords. First load has **no seeded expenses** — empty states until you add data.
