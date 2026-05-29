## 1. Middleware Auth Enforcement

- [x] 1.1 Update `src/middleware.ts` to redirect unauthenticated requests to `/dashboard` → `/`
- [x] 1.2 Update `src/middleware.ts` to redirect authenticated requests at `/` → `/dashboard`
- [x] 1.3 Verify existing session-refresh logic is preserved

## 2. Login Page UI

- [x] 2.1 Replace `src/app/page.tsx` with a client component containing `step` state (`'email' | 'verify'`)
- [x] 2.2 Implement the email step: email input + "Send code" button, calls `signInWithOtp({ email, options: { shouldCreateUser: true } })`
- [x] 2.3 Implement the verify step: OTP input + "Verify" button + "Back" link, calls `verifyOtp({ email, token, type: 'email' })`
- [x] 2.4 On successful verification redirect to `/dashboard` using `useRouter`
- [x] 2.5 Display inline error messages for invalid OTP, expired OTP, and network errors
- [x] 2.6 Use shadcn/ui components (`Input`, `Button`, `Label`, `Card`) for all form elements

## 3. Dashboard Stub

- [x] 3.1 Create `src/app/dashboard/page.tsx` as a server component that reads the current user and renders their email
- [x] 3.2 Add a sign-out button that calls `supabase.auth.signOut()` and redirects to `/`

## 4. Lint & Typecheck

- [x] 4.1 Run `npm run lint` and resolve any errors
- [x] 4.2 Run `npx tsc --noEmit` and resolve any type errors
