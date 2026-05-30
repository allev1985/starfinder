## Context

The character sheet already has a `character_combat_stats` table (1-1 with `characters`) holding `initiative_misc_mod`. Starfinder characters have three health pools — Stamina Points (SP), Hit Points (HP), and Resolve Points (RP) — each with a **total** (the owner-set baseline) and a **current** (the live play value that changes during encounters). None of these are derived; all six values are user-entered integers.

## Goals / Non-Goals

**Goals:**
- Extend `character_combat_stats` with six new integer columns for SP/HP/RP total and current
- Add a migration for those columns
- Render a "Health & Resolve" section on the character detail page with owner-editable inputs and read-only display for non-owners
- Persist all six values via a single server action on blur

**Non-Goals:**
- Deriving any value from ability scores or class features
- Validation rules (e.g., current ≤ total)
- Automatic reset or recovery mechanics

## Decisions

### Extend `character_combat_stats` rather than a new table
All six fields share the same 1-1 character relationship and the same ownership rules as `initiative_misc_mod`. A new table would add a join for no architectural benefit at this stage.

### Single server action for all six values
The initiative misc mod uses one action per field (on blur). For health/resolve, a single action accepting all six values is simpler — the user edits a group of related fields and they're all persisted together on blur of any field. This avoids six separate round trips for what is conceptually one data record.

**Alternative considered**: individual actions per field (matching initiative pattern). Rejected — six separate actions adds boilerplate with no user-facing benefit since all six fields live on the same row.

### Separate "Health & Resolve" section (not merged into Combat Stats)
Combat Stats uses a three-column grid (Total / DEX Mod / Misc). Health & Resolve uses a two-column grid (Total / Current). Merging them would require a more complex layout or an awkward empty column. A sibling section keeps both grids clean and readable.

## Risks / Trade-offs

- [Migration adds columns with DEFAULT 0] → All existing characters start with zeroed health. Owners must fill in their correct values. Acceptable given this is a user-input-only field with no derived default.
- [Single action for all six] → If one value fails to parse, the whole save is a no-op. Mitigation: parse each field individually with a fallback to 0 (same pattern as misc mod).

## Migration Plan

1. Generate a new Drizzle migration adding the six columns to `character_combat_stats`
2. Deploy migration — zero-downtime (additive columns with defaults)
3. No rollback complexity; columns can be dropped if needed with a reverse migration
