## Context

The database has only a placeholder table. No domain tables, no data layer structure, no services. This change introduces the first real entities and establishes the layered architecture all future features will follow.

Stack: Next.js 16 App Router, Drizzle ORM + postgres-js, Supabase Auth (session via `@supabase/ssr`), Tailwind v4, shadcn/ui.

## Goals / Non-Goals

**Goals:**
- Define `campaigns`, `characters`, and `campaign_characters` tables in Drizzle schema
- Establish `db/queries/` as the data access layer (raw Drizzle operations only)
- Establish `src/services/` as the business logic layer (join code generation, orchestration)
- Server Actions as thin adapters: get auth context, call service, return result to UI
- Create campaign form at `/dashboard/campaigns/new`

**Non-Goals:**
- Join campaign flow (using a join code to attach a character)
- Campaign detail page (`/dashboard/campaigns/[id]`)
- Character creation
- Row-Level Security (RLS) policies — deferred

## Decisions

### 1. Layer boundaries

```
db/queries/     ← Drizzle only. No auth, no business logic. Pure data access.
src/services/   ← Business logic. Calls queries. Owns join code generation.
app/.../actions.ts ← Server Actions. Gets auth user, calls service, returns to UI.
```

`db/queries/` files are `server-only` and receive the `db` instance (or import it directly). Services are also `server-only`. Actions import services — never queries directly.

### 2. No Drizzle-level FK to `auth.users`

`dm_id` on `campaigns` and `owner_id` on `characters` store Supabase Auth user UUIDs as plain `uuid().notNull()` columns — no `.references()` call. The Server Action always reads `supabase.auth.getUser()` before inserting, guaranteeing a valid user ID. This avoids cross-schema FK complexity in Drizzle while remaining safe in practice.

**Alternative considered**: Manual FK in SQL migration (`REFERENCES auth.users(id)`). Rejected — adds migration complexity and breaks `drizzle-kit push` flows without payoff given auth context guarantees.

### 3. Join code generation in the service layer

`src/services/campaigns.ts` generates a 6-character uppercase alphanumeric code using `crypto.getRandomValues` (available in Node.js 18+). The `join_code` column has a `UNIQUE` constraint. On collision (astronomically rare), the service retries once. The query layer receives the already-generated code.

Format: `[A-Z0-9]{6}` e.g. `XK4R9P`. ~2.2 billion possible values.

### 4. `campaign_characters` primary key

Composite PK on `(campaign_id, character_id)` — a character can only be in a campaign once. No surrogate `id` column needed for a pure join table.

### 5. Server Action returns typed result

Actions return `{ success: true, campaignId: string } | { success: false, error: string }` — no thrown errors reaching the client. The form page reads this and either redirects or shows an inline error.

### 6. Replace placeholder table

The `placeholder` table and its migration are removed. Drizzle's migration history is reset cleanly since the project has never been deployed with real data.

## Risks / Trade-offs

- **Join code collisions** → Unique constraint + service-layer retry. Statistically negligible at this scale.
- **No RLS** → Currently any authenticated user can read/write any row. Acceptable for early development; RLS is a separate change.
- **Migration history reset** → Deleting the placeholder migration is clean now but requires `supabase db reset` locally after pulling.
