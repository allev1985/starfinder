## Context

The app authenticates users via Supabase magic-link OTP. `getUser()` in `session.ts` returns the full Supabase `User` object, which includes `app_metadata` — a server-side-only JSON field that users cannot self-modify. There is currently no role concept anywhere in the app; all authorization is resource-ownership-based (`authorization.ts`).

The admin role is needed solely to gate a future seed-data management UI under `/dashboard/admin`. Only one person (the repo owner) will ever hold this role, set manually in the Supabase dashboard.

## Goals / Non-Goals

**Goals:**
- Minimal two-role system (`player` | `admin`) with zero database migration
- Server-side role check that cannot be spoofed by the client
- Route-level protection on `/dashboard/admin` — redirect non-admins
- Conditional admin nav link in the top bar

**Non-Goals:**
- Per-row RLS enforcement of the admin role in Postgres (not needed for a route-gated admin UI backed by server actions)
- Role management UI (manual Supabase dashboard edit is sufficient)
- Any roles beyond `player` and `admin`
- Changing existing ownership-based authorization logic

## Decisions

### Store role in `app_metadata`, not a `profiles` table

**Decision:** Read `user.app_metadata?.role` from the Supabase JWT.

**Rationale:** `app_metadata` is admin-only (requires service role to write), embedded in the JWT, and available on every `getUser()` call with no extra query. A `profiles` table would require a migration, a trigger to insert on user creation, and an extra DB round-trip per session. Given there is exactly one admin and the check is purely route-level, the overhead is unjustified.

**Alternative considered:** Postgres `profiles` table — rejected for the reasons above. Re-evaluate if role needs to drive RLS policies in the future.

### Route guard in a server layout, not middleware

**Decision:** Put the admin gate in `src/app/dashboard/admin/layout.tsx` (a Server Component), not in `middleware.ts`.

**Rationale:** Middleware runs on every request and would need the Supabase client wired up there. A server layout is the idiomatic Next.js App Router pattern — it co-locates the guard with the route segment it protects, is easy to test in isolation, and keeps middleware lean.

**Alternative considered:** Middleware-based redirect — rejected to avoid coupling auth logic into the edge runtime and to keep middleware simple.

### `isAdmin()` as a standalone helper in `session.ts`

**Decision:** Export `isAdmin(user: User | null): boolean` from `session.ts`, not from `authorization.ts`.

**Rationale:** `authorization.ts` handles resource ownership (characters, campaigns). Role identity is a separate concern that belongs alongside `getUser()`. Keeping them separate prevents authorization.ts from growing into a grab-bag.

## Risks / Trade-offs

**JWT staleness after role change**
Setting or removing admin in `app_metadata` doesn't invalidate existing sessions. The old JWT persists until expiry (Supabase default: 1 hour). → Acceptable for a solo admin. If needed, force sign-out via Supabase dashboard.

**No DB-level enforcement**
Server actions under `/dashboard/admin` must re-check `isAdmin()` themselves — the route guard alone isn't enough if someone constructs a direct action call. → Mitigated by checking `isAdmin()` at the top of every admin server action.

## Migration Plan

1. Deploy code changes (no schema migration)
2. In Supabase dashboard: edit your user's `app_metadata` → set `{ "role": "admin" }`
3. Sign out and back in to refresh the JWT
4. Verify admin nav link appears and `/dashboard/admin` is accessible

Rollback: remove `role` from `app_metadata` in Supabase dashboard. Route reverts to redirect for all users.

## Open Questions

- Which seed tables should the admin UI cover first? (All tables in `schema.ts` that are reference data, or a prioritized subset?) → Scoped per subsequent change; this change only establishes the gate.
