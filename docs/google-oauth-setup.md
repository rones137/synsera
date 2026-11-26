# Synsera — Connect Google Client ID (step-by-step)

Current temporary deploy:  
**https://zippy-magenta-hi6yzt6.tmp.now**

| Role | Path |
|---|---|
| Synsera app callback | `/auth/callback` |
| Google → Supabase redirect (only URI for Google Console) | `/auth/v1/callback` |

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

## Exact redirects for `zippy-magenta-hi6yzt6.tmp.now`

### Google Cloud → Credentials → your Web client

**Authorized JavaScript origins**

```
http://localhost:3000
https://zippy-magenta-hi6yzt6.tmp.now
```

**Authorized redirect URIs** (Supabase only — replace `YOUR_PROJECT_REF`)

```
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
```

Do **not** add `https://zippy-magenta-hi6yzt6.tmp.now/auth/callback` here. Google talks to Supabase; Synsera receives the session afterward.

### Supabase → Authentication → URL Configuration

| Setting | Value |
|---|---|
| Site URL | `https://zippy-magenta-hi6yzt6.tmp.now` |
| Redirect URLs | see below |

```
http://localhost:3000/auth/callback
https://zippy-magenta-hi6yzt6.tmp.now/auth/callback
```

---

## Paste Client ID + Secret in Supabase

1. Supabase → **Authentication → Providers → Google** → Enable
2. **Client ID** = `707769106160-qmmbn0gf0tes9nk44a18quq7gucublgu.apps.googleusercontent.com`
3. **Client Secret** = the value from Google (dashboard only — never in git)
4. Save → then rotate the Google secret after first successful login

Synsera never reads `GOOGLE_CLIENT_SECRET`. The login button calls `supabase.auth.signInWithOAuth({ provider: "google" })` when env vars below are set.

---

## Env vars still needed (blocked until Blaise sends them)

Synsera switches **Continue with Google** from local demo → real Supabase OAuth when both exist:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...anon_public_key...
```

From Supabase → **Project Settings → API**.  
Set in `.env.local` for local, and on the host (Vercel project env / fresh deploy) for zippy-magenta. Then rebuild/redeploy.

Without them, the button still works as a **local demo** session (no Google).

Also run `supabase/schema.sql` once in the SQL Editor.

---

## Verify

1. Test user email added on the consent screen  
2. Client ID + Secret saved in Supabase Google provider  
3. Redirects above match  
4. `NEXT_PUBLIC_SUPABASE_*` set + redeployed  
5. Open https://zippy-magenta-hi6yzt6.tmp.now/login → **Continue with Google**  
6. Expect: Google picker → `….supabase.co/auth/v1/callback` → Synsera `/auth/callback` → `/app` or `/onboarding`  
7. Rotate Client Secret in Google → update Supabase → discard any secret that was pasted in chat

---

## Quick checklist

- [x] Google OAuth Web client created (Client ID above)  
- [ ] Client Secret in Supabase Google provider only (then rotate)  
- [ ] Consent screen **Test users** includes Blaise  
- [ ] Google redirect = `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`  
- [ ] JS origins include zippy-magenta + localhost  
- [ ] Supabase Redirect URLs include `https://zippy-magenta-hi6yzt6.tmp.now/auth/callback`  
- [ ] Waiting: `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
- [ ] `schema.sql` applied  
- [ ] Continue with Google verified on zippy-magenta
