## Context

The `character-spells` spec already defines `character_spell_slots` and the manual slot tracker UI but neither has been built. The `class_spell_progression` table tracks `spells_known` per character level and spell level; it has no `spells_per_day` column. The `characterCombatStats` table establishes the pattern for current/total pairing (e.g., `stamina_points_total` / `stamina_points_current`), which `character_spell_slots` mirrors with `total_slots` / `used_slots`.

The `SpellsSection` component already handles levels 0–6 via tabs, level-change events, and the known-spells state. The slot tracker slots naturally into each level tab without restructuring that component.

## Goals / Non-Goals

**Goals:**
- Add `spells_per_day` to `class_spell_progression` with seeded CRB values for Mystic and Technomancer
- Ship the `character_spell_slots` table via migration
- Implement slot tracker UI (pip display, +/− for max, click to use/recover)
- Implement Long Rest — zeros all `used_slots` for a character in one action
- Persist all slot state across devices via Supabase

**Non-Goals:**
- Automatic slot max derivation from ability scores (manual setup only)
- Bonus slots from ability modifier (out of scope)
- Slot reset on timer / in-app rest timer
- Support for partial rests or short rests

## Decisions

### Decision: `usedSlots` vs `remainingSlots`

Store `used_slots` (not `remaining_slots`). Long rest becomes `SET used_slots = 0 WHERE character_id = ?`, which is a single unconditional write with no need to know `total_slots`. Incrementing on cast and decrementing on recovery are both natural.

_Alternative considered_: `remaining_slots`. Simpler UI math, but long rest requires knowing `total_slots` for each level or a more complex query.

### Decision: Separate `character_spell_slots` table (not JSON blob on combatStats)

A dedicated table with `(character_id, spell_level)` PK matches the existing patterns for per-character, per-level data (`class_spell_progression`, `character_skills`) and keeps queries simple with individual `UPDATE` calls per level. A JSON blob on `characterCombatStats` would require read-modify-write for every pip tap.

_Alternative considered_: JSON column on `characterCombatStats`. Fewer tables, but mutable JSON makes partial updates awkward in Drizzle.

### Decision: `spells_per_day` as a suggested default only

The UI reads `spells_per_day` from the class progression when a character has no existing slot row for a level, and pre-fills the max field. The player can override it freely. No enforcement — the spec says manual.

### Decision: Long Rest at section header level

A single "Long Rest" button sits at the `SpellsSection` header, not inside individual tabs. One click resets all levels at once. This matches how long rests work in the game (all slots restore simultaneously).

### Decision: Debounced upsert for total_slots edits

`total_slots` edits use the existing 600ms debounced save pattern (canonical in `ability-scores-section.tsx`). `used_slots` changes (pip taps) fire immediately — they're single-click interactions with no typing involved.

## Risks / Trade-offs

- **Optimistic UI vs server state**: pip taps update local state immediately before the server responds. If the action fails, the UI stays out of sync until page reload. Mitigation: keep the action simple (single-row upsert) so failures are rare; no rollback needed for this data criticality level.
- **Seed data gap**: if `spells_per_day` seed values are missing for a class/level combo, the pre-fill default silently shows 0. Mitigation: include full CRB Mystic and Technomancer progression tables in the migration, verified against the rulebook.
- **Level 0 / cantrips**: no slot row should ever exist for `spell_level = 0`. The UI skips the slot tracker for level 0. The DB has no constraint enforcing this — rely on the application never writing level-0 rows.

## Migration Plan

1. `alter table class_spell_progression add column spells_per_day integer not null default 0` — safe, non-breaking, backfills 0.
2. Update seed data migration to fill `spells_per_day` for all existing Mystic and Technomancer progression rows.
3. `create table character_spell_slots (...)` — new table, no existing data affected.
4. No rollback complexity; both changes are additive.
