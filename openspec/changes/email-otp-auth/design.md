## Context

The app currently has Supabase clients wired up (browser + server) and a middleware that refreshes the session on every request. There is no login UI and no route-level auth enforcement. The existing `supabase-auth` spec described email+password auth; that is being replaced wholesale.

Supabase Auth supports OTP natively via `signInWithOtp()` (sends the email) and `verifyOtp()` (validates the token). No additional packages are needed.

## Goals / Non-Goals

**Goals:**
- Replace `page.tsx` with a two-step login UI (email input → OTP input) using local React state
- Enforce auth in middleware: unauthenticated → `/`, authenticated on `/` → `/dashboard`
- Stub `/dashboard` page as the post-login landing point
- Seamless first-use account creation via Supabase OTP (no separate register flow)

**Non-Goals:**
- Magic link (click-to-login) emails — OTP code entry only
- Social/OAuth login
- Dashboard functionality (stub only)
- Email template customisation (handled in Supabase dashboard)

## Decisions

### 1. Single-page two-step UI over two routes

The login lives at `/` with a local `step` state variable (`'email' | 'verify'`). The email address is held in component state and passed to the verify step — no query params, no route change.

**Why over `/login/verify?email=...`**: avoids exposing the email in the URL (even base64-encoded) and removes the need to handle stale/missing query params on direct navigation. The tradeoff is that a hard refresh during the verify step returns to step 1, which is acceptable — the user just re-submits their email.

### 2. Client-side OTP actions (not Server Actions)

`signInWithOtp` and `verifyOtp` are called directly from the browser via `createBrowserClient`. The `@supabase/ssr` library writes the session cookie automatically on successful verification.

**Why over Server Actions**: a Server Action for auth would require forwarding cookies from the action response back to the browser — that's exactly what `@supabase/ssr` does transparently when called client-side. Adding a server layer gains nothing here and adds indirection.

### 3. Middleware enforces auth at the route level

`src/middleware.ts` already exists for session refresh. It is extended to:
- Redirect `/` → `/dashboard` when the user is authenticated
- Redirect `/dashboard/*` → `/` when the user is unauthenticated

All other public assets (static files, favicon) are already excluded via the existing matcher.

### 4. Replace `supabase-auth` spec entirely

The existing spec defined password-based requirements. Rather than layering a delta on top, the spec is replaced to reflect the actual system behaviour. The old requirements (sign-up with password, sign-in with password) are formally REMOVED with a migration note.

## Risks / Trade-offs

- **OTP email delivery delay** → Supabase's default SMTP has rate limits in development. Use a custom SMTP provider in production. Mitigation: document in local dev setup.
- **Hard refresh during verify step loses email state** → User re-enters email. Acceptable UX tradeoff vs. URL exposure.
- **Supabase OTP expiry (default 1 hour)** → User should be informed if code entry fails due to expiry. The `verifyOtp` error response distinguishes expired vs. invalid tokens.
- **`shouldCreateUser: true` auto-creates accounts** → Any email address can create an account. For a private app this may need restricting later (e.g., email allowlist), but is correct for current scope.
