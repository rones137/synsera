# Synsera — Connect Google Client ID (step-by-step)

**Open this host only (Supabase env baked in):**  
**https://rapid-acacia-kec2oie.tmp.now**

If you see “Demo Google sign-in (local)” or “GOOGLE_CLIENT_ID”, you are on an **old URL**. Close it and use the host above.

Supabase project: `https://btwtdelbyzbfhaeqylhc.supabase.co`

| Role | Exact value |
|---|---|
| Synsera callback path | `/auth/callback` |
| Google Console redirect URI | `https://btwtdelbyzbfhaeqylhc.supabase.co/auth/v1/callback` |

---

## Blaise must confirm in Supabase → Authentication → URL Configuration

Set **exactly**:

**Site URL**
```
https://rapid-acacia-kec2oie.tmp.now
```

**Redirect URLs** (add both)
```
https://rapid-acacia-kec2oie.tmp.now/auth/callback
http://localhost:3000/auth/callback
```

Also in **Google Cloud → OAuth Web client → Authorized JavaScript origins**:
```
https://rapid-acacia-kec2oie.tmp.now
http://localhost:3000
```

Google **Authorized redirect URIs** stays:
```
https://btwtdelbyzbfhaeqylhc.supabase.co/auth/v1/callback
```

---

## Run schema (SQL Editor)

1. [SQL Editor](https://supabase.com/dashboard/project/btwtdelbyzbfhaeqylhc/sql/new)
2. Paste/run `supabase/schema.sql` from the repo  
   (`public.profiles` was missing earlier — required for durable profiles.)

---

## Google provider

- Client ID: `707769106160-qmmbn0gf0tes9nk44a18quq7gucublgu.apps.googleusercontent.com`
- Client Secret: Supabase → Authentication → Providers → Google only (then rotate if shared in chat)
- Consent screen **Test users** must include Blaise’s Google email while status is Testing

---

## What we fixed in code

1. `/auth/callback` now calls `exchangeCodeForSession(code)` with the PKCE **code**, not the full URL (that was bouncing people back to `/login` with no session).
2. `redirectTo` is path-clean: `https://<host>/auth/callback` (next path stored in sessionStorage).
3. App store hydrates via `onAuthStateChange` so the workspace sees the Google session.
4. AuthGate no longer auto-seeds a demo user when Supabase is configured.
5. Register/Login hide GOOGLE_CLIENT_ID demo copy on configured builds.

---

## Verify

1. Open **https://rapid-acacia-kec2oie.tmp.now/register** (or `/login`)
2. You should **not** see demo/GOOGLE_CLIENT_ID copy; footer can say Auth: Supabase
3. Continue with Google → Google picker → land on `/onboarding` or `/app` with a session
