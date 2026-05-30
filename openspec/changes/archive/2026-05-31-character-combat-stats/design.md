## Context

The `characters` table stores the six ability scores. The `modifier()` function (`floor((score - 10) / 2)`) is currently a private function inside `ability-scores-section.tsx`. No combat stats exist in the data model yet. The character detail page renders ability scores, description attributes, and campaigns — no combat section.

## Goals / Non-Goals

**Goals:**
- Introduce `character_combat_stats` as the canonical home for per-character combat misc modifiers
- Deliver initiative (DEX mod + misc mod) as the first combat stat
- Extract `modifier()` into `src/lib/ability.ts` for shared use

**Non-Goals:**
- EAC, KAC, saves, attack bonuses, HP — future columns, not part of this change
- Storing derived totals in the DB — totals are always computed client-side
- Validation of misc modifier range — no game-rule clamping yet

## Decisions

### D1: Columnar table over EAV
`character_combat_stats` uses one column per misc modifier (`initiative_misc_mod`, future: `eac_misc_mod`, etc.) rather than an EAV `(character_id, stat_name, value)` model.

**Rationale:** Starfinder's combat stat set is finite and well-known. Columnar gives compile-time type safety via Drizzle's inferred types, simpler queries (single row fetch), and readable schema. EAV would add flexibility we don't need and complexity we don't want.

### D2: `character_id` as primary key (no separate UUID)
The table has a strict 1:1 relationship with `characters`. Using `character_id` as PK avoids a redundant surrogate key and enforces the 1:1 constraint at the DB level.

### D3: Eager row creation
A `character_combat_stats` row is inserted (all defaults) atomically with character creation inside `createCharacter` in `src/db/queries/characters.ts`. This ensures the row always exists and removes any upsert branching in downstream update paths.

**Alternative considered:** Lazy upsert on first write (same pattern as `character_race_attribute_values`). Rejected because combat stats are universal — every character has them — unlike race attribute values which are race-specific.

### D4: Initiative total derived client-side, never stored
`initiativeTotal = modifier(dexScore) + initiativeMiscMod`. Computed in the `CombatStatsSection` component, not persisted. This keeps the table clean and means totals automatically reflect ability score changes.

### D5: `src/lib/ability.ts` for the modifier utility
The `modifier(score: number): number` helper is extracted here. Returns the raw integer (no formatting). Callers are responsible for display formatting (`+2`, `-1`). The `ability-scores-section.tsx` component is updated to import from this path.

**Alternative considered:** `src/lib/game.ts` as a broader rules utility. Deferred — premature to create a catch-all module for one function. Can be renamed/merged later if the file grows.

## Risks / Trade-offs

- **Migration on existing characters**: The eager-creation pattern means existing characters won't have a `character_combat_stats` row until one is manually inserted. The migration must include a backfill: `INSERT INTO character_combat_stats (character_id) SELECT id FROM characters ON CONFLICT DO NOTHING`.
- **`modifier()` extraction is a refactor within a feature change**: Low risk — it's a pure function with no side effects. The rename is the only change to `ability-scores-section.tsx`.

## Migration Plan

1. Add migration `0013_character_combat_stats.sql`:
   - `CREATE TABLE character_combat_stats (...)`
   - Backfill: `INSERT INTO character_combat_stats (character_id) SELECT id FROM characters ON CONFLICT DO NOTHING`
2. Update Drizzle schema and regenerate types
3. Update `createCharacter` query to insert into `character_combat_stats`
4. Add query functions for fetching and updating combat stats
5. Wire UI: fetch combat stats in page, render `CombatStatsSection`

Rollback: drop `character_combat_stats` table and revert application code. No existing data is modified.
