# Synsera — Connect Google Client ID (step-by-step)

Latest deploy URL is updated when we redeploy — check the agent reply for the exact host.  
Supabase project: `https://btwtdelbyzbfhaeqylhc.supabase.co`

If you still see “Demo Google sign-in (local)”, you are on an **old host** without `NEXT_PUBLIC_SUPABASE_*` baked in. Use only the latest URL from the agent.

| Role | Path |
|---|---|
| Synsera app callback | `/auth/callback` |
| Google → Supabase redirect (only URI for Google Console) | `/auth/v1/callback` |

---

## Run schema (Blaise — SQL Editor)

If tables are not created yet:

1. Open [Supabase SQL Editor](https://supabase.com/dashboard/project/btwtdelbyzbfhaeqylhc/sql/new)
2. Paste the full contents of `supabase/schema.sql` from the repo
3. Run → confirm tables (`profiles`, `expenses`, vendors, etc.)

Agents cannot apply this without Supabase dashboard/MCP access.

---

## Blaise’s Google OAuth Web client (public)

**Client ID** (safe to keep in docs / frontend config):

```
707769106160-qmmbn0gf0tes9nk44a18quq7gucublgu.apps.googleusercontent.com
```

**Client Secret:** paste **only** in Supabase → Authentication → Providers → Google.  
Never put the secret in the Synsera repo, `.env`, Vercel env, chat logs, or commits.  
After Google sign-in works once, **rotate the Client Secret** in Google Cloud Console and update the new value in Supabase only.

---

## Consent screen — Test users (required while Testing)

While the OAuth consent screen is in **Testing**, only listed emails can sign in:

1. Google Cloud Console → **APIs & Services → OAuth consent screen**
2. Under **Test users** → **Add users**
3. Add Blaise’s Google account (and any teammate who should try Continue with Google)

Without this, Google shows “app has not completed Google verification” / access blocked for other accounts.

---

## Exact redirects for `fleet-xenon-2wg8531.tmp.now`

### Google Cloud → Credentials → your Web client

**Authorized JavaScript origins**

```
http://localhost:3000
https://fleet-xenon-2wg8531.tmp.now
```

**Authorized redirect URIs** (Supabase only)

```
https://btwtdelbyzbfhaeqylhc.supabase.co/auth/v1/callback
```

Do **not** add the Synsera `/auth/callback` URL in Google Console. Google talks to Supabase; Synsera receives the session afterward.

### Supabase → Authentication → URL Configuration

| Setting | Value |
|---|---|
| Site URL | `https://fleet-xenon-2wg8531.tmp.now` |
| Redirect URLs | see below |

```
http://localhost:3000/auth/callback
https://fleet-xenon-2wg8531.tmp.now/auth/callback
```

Update these whenever the temp host changes or you claim a lasting domain.

---

## Paste Client ID + Secret in Supabase

1. Supabase → **Authentication → Providers → Google** → Enable
2. **Client ID** = `707769106160-qmmbn0gf0tes9nk44a18quq7gucublgu.apps.googleusercontent.com`
3. **Client Secret** = the value from Google (dashboard only — never in git)
4. Save → then rotate the Google secret after first successful login

Synsera never reads `GOOGLE_CLIENT_SECRET`. The login button calls `supabase.auth.signInWithOAuth({ provider: "google" })` when `NEXT_PUBLIC_SUPABASE_*` are set.

---

## Env vars (set on current deploy)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://btwtdelbyzbfhaeqylhc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon JWT — local .env.local / Vercel build env only, not committed>
```

`.env.local` is gitignored. Redeploy after rotating keys.

---

## Verify

1. Test user email on consent screen  
2. Client ID + Secret in Supabase Google provider  
3. Redirects above match **fleet-xenon** (or your latest host)  
4. Schema applied  
5. Open https://fleet-xenon-2wg8531.tmp.now/login → **Continue with Google**  
6. Expect: Google picker → `btwtdelbyzbfhaeqylhc.supabase.co/auth/v1/callback` → Synsera `/auth/callback` → `/app` or `/onboarding`

---

## Quick checklist

- [x] Google OAuth Web client created  
- [x] `NEXT_PUBLIC_SUPABASE_URL` + anon key on fleet-xenon deploy  
- [ ] Client Secret in Supabase Google provider only (then rotate if shared in chat)  
- [ ] Consent screen **Test users** includes Blaise  
- [ ] Google redirect = `https://btwtdelbyzbfhaeqylhc.supabase.co/auth/v1/callback`  
- [ ] Supabase Redirect URLs include `https://fleet-xenon-2wg8531.tmp.now/auth/callback`  
- [ ] `schema.sql` run in SQL Editor  
- [ ] Continue with Google verified on fleet-xenon
