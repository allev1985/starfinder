## Why

The app has no concept of user roles — everyone has equal access. Adding a minimal two-role system (Player / Admin) gates a future seed-data management UI so only a designated admin can modify reference tables (races, classes, weapons, etc.) through the application.

## What Changes

- Introduce a `player` / `admin` role concept stored in Supabase `app_metadata`
- All users default to `player`; admin is set manually in the Supabase dashboard
- Add a server-side `isAdmin()` helper that reads the role from the authenticated user's JWT claims
- Protect the `/dashboard/admin` route segment: non-admins are redirected to `/dashboard`
- Show an "Admin" nav link in the top bar only for admin users

## Capabilities

### New Capabilities

- `user-roles`: Two-role RBAC (player / admin) sourced from Supabase `app_metadata`; `isAdmin()` helper; route-level guard on `/dashboard/admin`

### Modified Capabilities

- `supabase-auth`: Auth session now exposes role via `app_metadata`; `session.ts` gains `isAdmin()` alongside existing `getUser()`
- `dashboard-shell`: Top bar conditionally renders an "Admin" nav link based on role

## Impact

- `src/lib/session.ts` — add `isAdmin(user)` helper
- `src/app/dashboard/admin/layout.tsx` — new server layout that enforces admin gate
- `src/components/tab-bar.tsx` / `src/app/dashboard/_components/top-bar.tsx` — conditional admin nav link
- No database migration required (role lives in Supabase `app_metadata`)
- No changes to existing `authorization.ts` ownership checks
