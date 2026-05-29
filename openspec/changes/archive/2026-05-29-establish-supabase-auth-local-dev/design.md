## Context

The project has Drizzle ORM wired to a Supabase Postgres instance (`istujrzlwhwzxqigbmhd.supabase.co`). Migrations currently output to `drizzle/migrations/` and are applied with `drizzle-kit migrate`. There is no auth layer and no local development stack.

This change adds Supabase Auth (via `@supabase/ssr` for Next.js App Router cookie-based sessions), initializes the Supabase CLI for local development, and unifies migration management under a single store at `supabase/migrations/`.

## Goals / Non-Goals

**Goals:**
- Add user auth (sign-up, sign-in, sign-out, session refresh) using Supabase Auth + `@supabase/ssr`
- Provide typed Supabase client utilities for both server and browser contexts
- Initialize `supabase/` directory so `supabase start` spins up a full local stack
- Redirect Drizzle Kit migration output to `supabase/migrations/` (Option A) — one migration store for both Drizzle and Supabase CLI
- Document the full local dev and Vercel deployment workflow

**Non-Goals:**
- Auth UI pages (sign-in form, etc.) — just the plumbing; UI comes in a future change
- Row Level Security policies — auth bypass in server code is sufficient for now
- OAuth providers — email/password only in this change; providers can be added later
- Custom JWT claims or user metadata schemas

## Decisions

### D1: `@supabase/ssr` over `@supabase/auth-helpers-nextjs`

**Decision**: Use `@supabase/ssr`.
**Rationale**: `@supabase/auth-helpers-nextjs` is deprecated. `@supabase/ssr` is the current Supabase-maintained package for Next.js App Router with first-class support for server-side cookie handling.
**Alternatives considered**: `@supabase/auth-helpers-nextjs` — deprecated, no new features.

### D2: Drizzle Kit generates SQL into `supabase/migrations/` (Option A)

**Decision**: Set `out: "./supabase/migrations"` in `drizzle.config.ts`.
**Rationale**: A single migration store means `supabase start` (local) and `supabase db push` (remote) apply the same SQL that Drizzle generated. No manual copying between directories. The `drizzle/` directory is removed.
**Alternatives considered**:
- Keep `drizzle/migrations/` and apply separately (Option B) — two systems to keep in sync, fragile.
- Supabase CLI only migrations (Option C) — loses Drizzle's schema-to-SQL auto-generation.

### D3: `db:migrate` script replaced by `supabase db push`

**Decision**: The npm `db:migrate` script is updated to run `supabase db push` rather than `drizzle-kit migrate`.
**Rationale**: Since Supabase CLI now owns migration application (it tracks what's been applied via its own journal), using `drizzle-kit migrate` would create a parallel tracking system and could double-apply migrations.

### D4: Two Supabase client helpers — server and browser

**Decision**: Provide `src/lib/supabase/server.ts` (uses `@supabase/ssr` `createServerClient` with Next.js cookies) and `src/lib/supabase/client.ts` (uses `createBrowserClient`).
**Rationale**: Server and browser clients have different cookie mechanisms. Keeping them in separate files makes the import intent explicit and prevents server-only code from reaching the browser bundle.

### D5: Middleware for session refresh

**Decision**: Add `src/middleware.ts` that calls `supabase.auth.getUser()` on every request to refresh the session cookie if it's close to expiry.
**Rationale**: Required by `@supabase/ssr` to prevent session expiry mid-session. Without this, a user's JWT can expire between requests and they get unexpectedly logged out.

### D6: RLS bypassed in server code

**Decision**: Drizzle queries (via the service-role `DATABASE_URL`) bypass RLS. Access control is enforced in server code, not at the database layer.
**Rationale**: For a Next.js App Router app, all data queries run server-side where the calling user's identity is known. Adding RLS now without a concrete multi-user sharing requirement adds complexity with no immediate benefit.

## Risks / Trade-offs

- **[`supabase/migrations/` naming collisions]** → Drizzle Kit uses timestamped filenames; Supabase CLI uses sequential numbering. They don't conflict in practice, but running `supabase migration new` will add non-Drizzle files to the same directory. Mitigation: always use `npm run db:generate` for schema changes; never use `supabase migration new` for application schema.
- **[Local vs remote env var drift]** → Developers must maintain two sets of env vars (local Supabase URLs vs remote). Mitigation: document clearly in `.env.local.example` with a local and remote section.
- **[`supabase start` requires Docker]** → Local stack uses Docker Desktop. Mitigation: document requirement; developers without Docker can use the remote Supabase project directly during development.
- **[Middleware runs on every request]** → The session refresh middleware adds a Supabase network call on each navigation. Mitigation: `@supabase/ssr` uses cookie-based refresh only when the token is near expiry, not on every request.

## Migration Plan

1. Install `@supabase/supabase-js`, `@supabase/ssr`
2. Run `supabase init` to create `supabase/config.toml`
3. Update `drizzle.config.ts` output path to `./supabase/migrations`
4. Move existing migration from `drizzle/migrations/` to `supabase/migrations/`; delete `drizzle/` directory
5. Create `src/lib/supabase/server.ts` and `src/lib/supabase/client.ts`
6. Add `src/middleware.ts` for session refresh
7. Update `.env.local.example` with new env vars
8. Update `db:migrate` npm script to use `supabase db push`
9. Verify `supabase start` applies migrations and `npm run dev` connects successfully

No rollback complexity — all changes are additive except the migration directory move, which is a rename.

## Open Questions

- Should `supabase/config.toml` be configured to disable any unused local services (storage, edge functions) to speed up `supabase start`? Probably yes — worth doing during init.
