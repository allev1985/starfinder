## Why

The app needs a secure, passwordless login experience. Email OTP eliminates password management overhead and reduces credential-based attack surface while providing a frictionless first-use account creation path.

## What Changes

- **BREAKING**: Remove email+password auth — `supabase-auth` spec is replaced entirely
- The front page (`/`) becomes an email-only login form with two UI states: enter email → enter OTP
- Successful OTP verification establishes an authenticated Supabase session and redirects to `/dashboard`
- The Next.js middleware is updated to enforce route-level auth: unauthenticated users are redirected to `/`, authenticated users on `/` are redirected to `/dashboard`
- A stub `/dashboard` page is introduced as the post-login landing point

## Capabilities

### New Capabilities

- `email-otp-login`: Two-step passwordless login — user enters email, receives a 6-digit OTP via email, enters the code, and receives an authenticated session. Seamless first-use account creation (no explicit register flow).

### Modified Capabilities

- `supabase-auth`: Replace password-based auth requirements with OTP-based auth requirements. The session persistence and middleware refresh requirements remain; sign-up/sign-in/sign-out via password are removed.

## Impact

- `src/app/page.tsx` — replaced with login UI (two-step OTP flow)
- `src/app/dashboard/page.tsx` — new stub page (protected route)
- `src/middleware.ts` — updated to enforce auth redirects
- `openspec/specs/supabase-auth/spec.md` — requirements replaced (no passwords)
- No new npm dependencies required; Supabase JS SDK supports OTP natively
