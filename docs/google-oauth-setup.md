# Synsera — Connect Google Client ID (step-by-step)

Current temporary deploy (expires ~1h unless claimed):  
**https://zippy-magenta-hi6yzt6.tmp.now**

App callback path (Synsera code): `/auth/callback`  
Supabase callback path (paste into Google): `/auth/v1/callback`

---

## A. Google Cloud Console — create OAuth client

1. Open [Google Cloud Console](https://console.cloud.google.com/) → select or create a project (e.g. `Synsera`).
2. **APIs & Services → OAuth consent screen**
   - User type: **External** (unless you have a Workspace org).
   - App name: **Synsera**
   - User support email: yours
   - Developer contact: yours
   - Save. Add yourself as a **Test user** while the app is in Testing.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**
   - Application type: **Web application**
   - Name: `Synsera Web`
4. **Authorized JavaScript origins** (add each host you use):
   - `http://localhost:3000`
   - `https://zippy-magenta-hi6yzt6.tmp.now` ← current temp deploy
   - Your lasting production host once claimed/custom domain (e.g. `https://synsera.vercel.app`)
5. **Authorized redirect URIs** — add **only** the Supabase Auth callback (not the Next.js URL):
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```
   Find `YOUR_PROJECT_REF` in Supabase → Project Settings → API → Project URL  
   (e..g. `https://abcdefgh.supabase.co` → redirect = `https://abcdefgh.supabase.co/auth/v1/callback`).
6. Create → copy **Client ID** and **Client Secret**.

---

## B. Paste Client ID / Secret in Supabase (not in Next.js)

1. Supabase Dashboard → your project → **Authentication → Providers → Google**.
2. Enable Google.
3. Paste:
   - **Client ID** = Google Client ID
   - **Client Secret** = Google Client Secret
4. Save.

Google’s secret stays in Supabase. Synsera’s browser client never needs `GOOGLE_CLIENT_SECRET`.

---

## C. Supabase redirect allow-list (Synsera’s `/auth/callback`)

Supabase → **Authentication → URL Configuration**:

| Setting | Value |
|---|---|
| Site URL | `https://zippy-magenta-hi6yzt6.tmp.now` (or localhost while developing) |
| Redirect URLs | one per line / entry: |

```
http://localhost:3000/auth/callback
https://zippy-magenta-hi6yzt6.tmp.now/auth/callback
```

When you claim the Vercel deploy or move to a stable domain, add that host’s `/auth/callback` too and update Site URL.

---

## D. Env vars for Synsera (Next.js)

Create `.env.local` (local) and the same names in Vercel / Cursor app secrets for the hosted app:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your_anon_public_key...
```

Copy both from Supabase → **Project Settings → API**:
- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Redeploy after setting secrets (temp Vercel deploys need a fresh `vercel deploy` with env, or claim + project env).

Without these two vars, **Continue with Google** falls back to a local demo session (no real Google).

---

## E. Apply schema (once)

In Supabase → **SQL Editor**, run the full file `supabase/schema.sql` from the repo, then confirm tables exist (`profiles`, `expenses`, etc.).

---

## F. Verify “Continue with Google”

1. Open https://zippy-magenta-hi6yzt6.tmp.now/login (or localhost:3000/login).
2. Click **Continue with Google**.
3. Expect: Google account picker → redirect through `….supabase.co/auth/v1/callback` → land on Synsera `/auth/callback` → then `/app` or `/onboarding`.
4. Failures to check:
   - `redirect_uri_mismatch` → Google redirect URI must be exactly `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`.
   - Stuck on Synsera with demo session → `NEXT_PUBLIC_SUPABASE_*` missing on that host.
   - Supabase “redirect not allowed” → add `https://<host>/auth/callback` under URL Configuration.

---

## Quick checklist

- [ ] Google OAuth Web client created  
- [ ] Google redirect URI = Supabase `/auth/v1/callback` only  
- [ ] JS origins include localhost + Vercel URL  
- [ ] Client ID + Secret in Supabase Google provider  
- [ ] Supabase Redirect URLs include `/auth/callback` for each Synsera host  
- [ ] `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` set + redeployed  
- [ ] `schema.sql` applied  
- [ ] Continue with Google reaches `/app` or `/onboarding`
