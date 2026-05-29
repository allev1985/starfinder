## Why

The app needs user identity — character sheets and game data must be tied to an account — and a local development environment that mirrors production. Supabase provides both: hosted Postgres with a built-in auth service and a CLI-driven local stack, and its Vercel integration makes deployment straightforward.

## What Changes

- Install `@supabase/supabase-js` and `@supabase/ssr` for auth and session management
- Install the Supabase CLI and initialize a `supabase/` project directory
- **BREAKING (migration path)**: Redirect Drizzle Kit migration output from `drizzle/migrations/` to `supabase/migrations/` so a single migration store is shared between Drizzle and the Supabase CLI
- Remove the now-redundant `drizzle/` directory
- Create typed Supabase client utilities for both server and browser contexts
- Add a middleware layer to refresh auth sessions on every request
- Document local dev workflow (`supabase start`) and Vercel deployment env vars

## Capabilities

### New Capabilities

- `supabase-auth`: User sign-up, sign-in, sign-out, and session management using `@supabase/ssr` with Next.js App Router (cookies-based sessions, server-side session access)
- `supabase-client`: Typed Supabase client factory — one for Server Components/Actions, one for browser components — both sourced from `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `supabase-local-dev`: Local Supabase stack via `supabase start`, with environment switching between local and remote project URLs

### Modified Capabilities

- `db-migrations`: Migration files now live in `supabase/migrations/` (not `drizzle/migrations/`). Drizzle Kit generates SQL there; Supabase CLI applies them via `supabase db push` (remote) and `supabase start` / `supabase migration up` (local). The `drizzle/` directory is removed.

## Impact

- **New dependencies**: `@supabase/supabase-js`, `@supabase/ssr` (production); `supabase` CLI (dev)
- **Modified config**: `drizzle.config.ts` output path changes to `./supabase/migrations`
- **New files**: `src/lib/supabase/server.ts`, `src/lib/supabase/client.ts`, `src/middleware.ts`, `supabase/config.toml`
- **Removed**: `drizzle/` directory (migrations move to `supabase/migrations/`)
- **New env vars**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (in addition to existing `DATABASE_URL`)
- **Vercel**: Supabase Vercel integration auto-injects the public env vars; `DATABASE_URL` (pooler URL) added manually
