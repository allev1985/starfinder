## Context

The `spaceships` table has basic frame/navigation fields but no defensive stats. AC and TL are the two core defensive scores in Starfinder starship combat. Both follow the same formula structure (`10 + pilotRank + <unique term> + sizeMod + miscMod`) with `pilotRank` and `sizeMod` shared between the two.

The existing spaceship editor (`_name-editor.tsx`) uses debounced `onChange` (600ms) for text fields and an increment/decrement pattern for `driftRating`. The new AC/TL fields are numeric modifiers — all manual entry, none derived — so they fit the debounced input pattern.

## Goals / Non-Goals

**Goals:**
- Add six integer columns to `spaceships` for AC/TL component values
- Display AC and TL computed totals alongside their component inputs in the spaceship editor
- Share pilot rank and size mod inputs visually to make the relationship clear

**Non-Goals:**
- Deriving size mod automatically from the size text field (no reference table exists yet)
- Read-only mode for non-DM participants (deferred to the broader DM/player permission work in `campaign-spaceship` spec)
- Validating pilot rank against actual character rank on the sheet

## Decisions

### Add columns directly to `spaceships`, not a separate table

The character pattern uses a separate `characterCombatStats` table, but that's a one-to-one record with many columns for a different entity. The spaceship is already a one-per-campaign record. Adding six columns directly keeps queries simple and avoids an unnecessary join.

**Alternative considered**: `spaceship_combat_stats` side table. Rejected — adds complexity with no benefit given the single-record nature.

### All six fields as `integer NOT NULL DEFAULT 0`

All component values start at zero and produce a meaningful default total of `10`. No nullability needed — a missing value is meaningfully `0`, not unknown.

### Computed totals in the UI only, not stored

AC and TL are pure functions of their inputs. Storing them would require keeping derived values in sync. Computing in the component is trivial and correct.

### Shared pilot rank / size mod inputs rendered once above the two columns

Since `pilotRank` and `sizeMod` feed both scores, rendering them once above a two-column layout (AC | TL) makes the relationship explicit without duplicating inputs.

## Risks / Trade-offs

- **Schema migration is additive** — no risk of data loss; all new columns have defaults.
- **`updateSpaceshipAction` pick type** must be updated or the new fields will be silently ignored by TypeScript. → Mitigation: add all six fields to the pick and run `npx tsc --noEmit` after.

## Migration Plan

1. Add migration file via Supabase MCP (`apply_migration`) with `ALTER TABLE spaceships ADD COLUMN ...` for all six columns
2. Update `schema.ts` to match
3. Run `npx tsc --noEmit` to verify types
4. Update action pick type and UI component
