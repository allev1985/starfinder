## 1. Tier 1 — Mechanical bumps

- [x] 1.1 Bump `lucide-react`, `shadcn`, `drizzle-orm`, `drizzle-kit`, `postgres`, `tailwind-merge`, `clsx`, `cmdk`, `@supabase/supabase-js`, `supabase`, `@types/node`, `@types/react`, `@types/react-dom`, `eslint`, `tailwindcss`, `@tailwindcss/postcss`, `vitest` within their existing semver range (`eslint-config-next` deferred to Tier 2 since it's pinned to the `next` version; `typescript`, and the major-version jumps for `eslint`/`vitest`/`@types/node` beyond their current range, are deferred — see note below)
- [x] 1.2 Run `pnpm install` and confirm `pnpm-lock.yaml` updates cleanly
- [x] 1.3 Run `npm run lint` and `npx tsc --noEmit`, fix any failures
- [x] 1.4 Run `npm test`
- [x] 1.5 Spot-check a shadcn-generated page in the browser for visual/behavioral regressions — verified by user

## 2. Tier 2 — Framework bumps

- [x] 2.1 Bump `next`, `react`, `react-dom` to latest in `package.json` (also bumped `eslint-config-next`, pinned to the `next` version)
- [x] 2.2 Run `pnpm install`, confirm lockfile update
- [x] 2.3 Run `npm run lint` and `npx tsc --noEmit`, fix any failures
- [x] 2.4 Run `npm run build` to confirm the production build still succeeds (required starting local Supabase via Docker + `.env.local`, since none existed — build then succeeded cleanly)
- [x] 2.5 Start `npm run dev` and manually click through the main golden-path pages (dashboard, a character sheet) checking for regressions — verified by user

## 3. Tier 3 — Previously-flagged packages

- [x] 3.1 Bump `@base-ui/react`, `@supabase/ssr`, `zod` to latest in `package.json`
- [x] 3.2 Run `pnpm install`, confirm lockfile update
- [x] 3.3 Run `npm run lint` and `npx tsc --noEmit`, fix any failures
- [x] 3.4 Start `npm run dev` and confirm no "Missing or invalid environment variables" error (verifies `src/config.ts` Zod parsing still works) — confirmed: dev server boots clean, `proxy.ts` middleware runs on every request without error, unauthenticated `/dashboard` correctly redirects to `/`
- [x] 3.5 Manually exercise the email OTP login flow end-to-end: sign in, confirm redirect to `/dashboard`, reload and confirm session persists (verifies `@supabase/ssr` cookie refresh in `src/proxy.ts` / `src/lib/supabase/server.ts`) — verified by user
- [x] 3.6 Exercise at least one page using each of `select`, `dialog`, `popover`, `dropdown-menu`, `tabs` in the browser (verifies `@base-ui/react` primitives) — verified by user

## 4. Wrap-up

- [x] 4.1 Run `npm run lint`, `npx tsc --noEmit`, and `npm test` once more against the fully-bumped tree — all clean (lint silent, tsc silent, 40/40 tests pass)
- [x] 4.2 If `npm test` or any build-script-dependent tool (esbuild/vitest, sharp image handling) misbehaves, run `pnpm approve-builds` and re-test before treating it as a real regression — not needed, nothing misbehaved
- [x] 4.3 Review the final `package.json`/`pnpm-lock.yaml` diff for anything unexpected (unintended major bumps, removed packages) — diff reviewed: every bump stays within its existing major version, no packages added/removed, `typescript` unchanged because 5.9.3 was already latest in the `^5` range
