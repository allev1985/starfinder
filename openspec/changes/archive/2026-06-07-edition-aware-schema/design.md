## Context

All tables in the current schema implicitly assume Starfinder 1st Edition. Reference data (weapons, armor, classes, spells, etc.) and character/campaign rows have no edition discriminator. As Starfinder 2e matures, a retrofit becomes progressively more expensive. The goal is a minimal, low-risk migration that makes edition a first-class concept without changing any current behavior.

## Goals / Non-Goals

**Goals:**
- Introduce an `editions` reference table with a single seed row for 1e
- Add `edition_id` FK to `characters`, `campaigns`, and all reference tables
- Backfill all existing rows to the 1e row
- Thread `edition_id` through character and campaign create paths (silently defaulting to 1e)
- Establish a branch point in the character sheet route for future edition-specific rendering

**Non-Goals:**
- 2nd Edition support of any kind
- Edition picker UI (only one edition exists; the field is set server-side for now)
- Migrating `character_combat_stats` to an edition-suffixed table (deferred until 2e mechanics are known)
- Campaigns spanning multiple editions

## Decisions

### 1. `editions` as a DB table, not a code-level enum

**Decision**: Use a `pgTable` for editions, referenced by UUID FK.

**Rationale**: A Postgres enum would require an `ALTER TYPE` migration each time a new edition is added, touching every table that uses it. A reference table lets new editions be inserted without schema changes.

**Alternative considered**: `edition` as a text column with a check constraint (e.g., `CHECK (edition IN ('1e', '2e'))`). Rejected for the same reason — adding a value requires a DDL statement.

### 2. `character_combat_stats` stays unchanged

**Decision**: Do not rename or split the combat stats table in this change.

**Rationale**: The table is already 1e-specific by its FK to `characters`, which now carries `edition_id`. A 2e character would have no `character_combat_stats` row and would join a `character_combat_stats_2e` (or equivalent) table instead. Renaming now adds migration cost with no functional benefit.

### 3. `edition_id` is NOT NULL with a default resolved at migration time

**Decision**: Add `edition_id` as NOT NULL with the 1e UUID inlined into the migration as a default for the backfill, then drop the column default after backfill.

**Rationale**: A nullable `edition_id` would require null-checks everywhere. Using the 1e UUID as a migration-time default keeps the column non-null from day one without requiring application-level changes.

### 4. No edition picker in the UI for this change

**Decision**: Character and campaign creation silently pass the 1e edition UUID server-side.

**Rationale**: There is only one edition. Showing a picker with one option is noise. When 2e rows exist, the picker can be added as a separate change.

### 5. Character sheet branches on `character.edition` at the page level

**Decision**: Add an edition branch in `characters/[id]/page.tsx` that renders the current 1e sheet by default and throws a `notFound()` for unknown editions.

**Rationale**: Localises the routing decision to one file. Each future edition sheet is a self-contained component with no cross-edition coupling.

## Risks / Trade-offs

- **Backfill on tables with existing rows** → The migration uses `UPDATE … SET edition_id = '<1e-uuid>'` before adding the NOT NULL constraint. On small dev/prod datasets this is instant; no risk.
- **Seed UUID is hardcoded in migration** → The `editions` insert uses a fixed UUID so the backfill UPDATE can reference it inline. This is intentional and must not be changed after deployment.
- **Reference data inserts (future seeds)** → Any new reference data migration must look up or hardcode the 1e UUID. A comment in the migration documents this convention.

## Migration Plan

1. Create migration: add `editions` table and insert the 1e seed row with a fixed UUID
2. Add nullable `edition_id` FK columns to all target tables
3. `UPDATE` all existing rows to set `edition_id` to the 1e UUID
4. `ALTER` columns to NOT NULL
5. Run `npm run db:generate` to produce the SQL, then apply via `supabase migration up`
6. Update `src/db/schema.ts` to reflect the new columns
7. Update `characters` and `campaigns` create actions to pass `edition_id`

**Rollback**: Drop `edition_id` columns and the `editions` table. No application logic depends on them until step 7.
