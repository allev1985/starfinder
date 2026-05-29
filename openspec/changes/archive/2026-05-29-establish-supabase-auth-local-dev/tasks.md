## 1. Install Dependencies

- [x] 1.1 Install `@supabase/supabase-js` and `@supabase/ssr` as production dependencies

## 2. Supabase CLI & Local Stack

- [x] 2.1 Install the Supabase CLI (`npm install -D supabase` or via system package manager)
- [x] 2.2 Run `supabase init` to create `supabase/config.toml` and the `supabase/` directory
- [x] 2.3 ~~Link the CLI to the remote project~~ — skipped, local-only setup

## 3. Migrate Migration Store (Option A)

- [x] 3.1 Update `drizzle.config.ts` to set `out: "./supabase/migrations"`
- [x] 3.2 Move existing migration file(s) from `drizzle/migrations/` to `supabase/migrations/`
- [x] 3.3 Delete the now-empty `drizzle/` directory
- [x] 3.4 Update `db:migrate` npm script in `package.json` to `supabase migration up` (applies pending migrations to local running stack)
- [x] 3.5 Remove `db:studio` npm script from `package.json` (replaced by Supabase Studio)

## 4. Supabase Client Utilities

- [x] 4.1 Create `src/lib/supabase/server.ts` exporting a `createClient` function using `createServerClient` from `@supabase/ssr` with Next.js `cookies()`
- [x] 4.2 Add `server-only` import to `src/lib/supabase/server.ts`
- [x] 4.3 Create `src/lib/supabase/client.ts` exporting a `createClient` function using `createBrowserClient` from `@supabase/ssr`
- [x] 4.4 Add startup env var validation to both client files (throw on missing `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

## 5. Session Middleware

- [x] 5.1 Create `src/middleware.ts` that creates a server Supabase client and calls `supabase.auth.getUser()` to refresh the session cookie on every request
- [x] 5.2 Configure the middleware `matcher` to exclude static assets and `_next` paths

## 6. Environment Variables

- [x] 6.1 Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local.example` with separate sections for local (Docker) and remote (Supabase cloud) values
- [x] 6.2 Add a note in `.env.local.example` that local values are obtained by running `supabase status` after `supabase start`

## 7. Verification

- [x] 7.1 Run `npm run db:generate` and confirm the migration SQL appears in `supabase/migrations/`
- [x] 7.2 Run `npx tsc --noEmit` and confirm no TypeScript errors
