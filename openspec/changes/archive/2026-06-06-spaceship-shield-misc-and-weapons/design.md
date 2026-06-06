## Context

The spaceship editor is a single client component (`_name-editor.tsx`) receiving a `Spaceship` row as props from a server page. All numeric fields debounce saves via `updateSpaceshipAction`. The existing schema has all spaceship data on one row; weapons are a one-to-many relationship that requires a separate table.

## Goals / Non-Goals

**Goals:**
- Add `shield_misc_mod` column to `spaceships` and wire it into the computed shield total
- Add `spaceship_weapons` table (one row per weapon, linked by spaceship_id + arc)
- Surface both additions in the spaceship editor UI
- Keep weapons editable by all campaign participants (no read-only restriction)

**Non-Goals:**
- Weapon lookup / search from any reference table
- Drag-to-sort or manual ordering of weapons
- Weapon editing after creation (delete + re-add to change a weapon)
- Linking weapons to character combat stats

## Decisions

### Separate table for weapons (vs. JSONB column)

Chosen: `spaceship_weapons` table with one row per weapon.

Alternatives considered:
- JSONB column on `spaceships`: simpler migration, but makes individual deletes awkward and bypasses the type system
- One JSONB column per arc: still JSONB drawbacks, with four columns instead of one

A separate table fits the existing schema patterns (all other one-to-many data uses tables) and makes add/delete trivial.

### Optimistic local state for weapons list (vs. revalidatePath)

Chosen: weapons list managed in React local state, initialized from props. Add/delete call server actions in the background without triggering `revalidatePath`.

Alternative: call server action then `revalidatePath`, causing the server component to re-render and push fresh props. This would reset all debounced-but-unsaved field values in the client component — unacceptable UX.

Tradeoff: if a server action fails, the local state is already updated. We accept this; failure is rare and the user can reload.

### arc column type: text with check constraint

Chosen: `text` column with a `CHECK (arc IN ('forward', 'port', 'starboard', 'aft'))` constraint rather than a Postgres enum.

Enums require their own migration to alter. A check constraint keeps the schema simple for a small fixed set.

### No `NOT NULL` on optional weapon fields (damage, range, special)

These are all informational and may be left blank. All three are nullable text.

## Risks / Trade-offs

- [Optimistic state diverges from DB on error] → Acceptable; user can reload. Could be improved with toast error later.
- [arc check constraint] → If new arcs are needed (e.g., turret), a migration is required. Acceptable given Starfinder's fixed arc set.

## Migration Plan

1. Migration 1: Add `shield_misc_mod integer NOT NULL DEFAULT 0` to `spaceships`
2. Migration 2: Create `spaceship_weapons` table

No data backfill needed. Both columns/tables default to empty/zero state. Rollback: drop the column and table.
