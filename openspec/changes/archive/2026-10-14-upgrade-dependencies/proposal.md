## Why

Dependencies are moderately behind their published versions (e.g. `next` 16.2.6→16.4.0, `react`/`react-dom` 19.2.4→19.3.0, `zod` 4.4.3→4.6.7, `@base-ui/react` 1.5.0→1.9.0, `@supabase/ssr` 0.10.3→0.12.7, plus routine bumps across the rest of the dependency tree). The project previously had conflicting lockfiles (`package-lock.json` and `pnpm-lock.yaml`); pnpm has now been established as the single source of truth and `node_modules` installed from it. Bumping now, in a controlled way, keeps the gap from widening and picks up bug fixes already reviewed for breaking-change risk (see investigation below) before it grows into a riskier jump.

## What Changes

- Bump all dependencies in `package.json`/`pnpm-lock.yaml` to their current latest versions, grouped by risk tier:
  - **Tier 1 (mechanical)**: `lucide-react`, `shadcn` (CLI), `drizzle-orm`, `drizzle-kit`, `postgres`, `tailwind-merge`, `clsx`, `cmdk`, `@supabase/supabase-js`, `supabase` (CLI), `@types/node`, `@types/react`, `@types/react-dom`, `eslint`, `eslint-config-next`, `tailwindcss`, `@tailwindcss/postcss`, `typescript`, `vitest`
  - **Tier 2 (framework)**: `next`, `react`, `react-dom`
  - **Tier 3 (previously flagged, now re-verified low-risk)**: `@base-ui/react`, `@supabase/ssr`, `zod`
- No application code changes are expected; this is a dependency-version bump plus manual verification of the specific surfaces each tier touches.
- Manual verification pass: a shadcn/base-ui component page, the email OTP login/auth flow (cookie refresh via `src/proxy.ts` and `src/lib/supabase/server.ts`), and app/config boot (`src/config.ts` Zod parsing), in addition to `npm run lint`, `npx tsc --noEmit`, and `npm test`.

## Capabilities

### New Capabilities
- `dependency-management`: the project uses a single, unambiguous package manager (pnpm) with one committed lockfile, and direct dependencies are kept current rather than allowed to drift indefinitely.

### Modified Capabilities
(none — this is a dependency version bump with no intended change to observable application behavior or requirements)

## Impact

- `package.json`, `pnpm-lock.yaml`
- `src/config.ts` (Zod schema/parsing — verify behavior unchanged after `zod` bump)
- `src/lib/supabase/server.ts`, `src/proxy.ts` (cookie-based session refresh — verify behavior unchanged after `@supabase/ssr` bump)
- `src/components/ui/*` (shadcn/base-ui primitives — verify rendering/interaction unchanged after `@base-ui/react` bump)
- No API, schema, or user-facing behavior changes are intended; risk is regression, not requirement change.
