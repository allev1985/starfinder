## Context

The combat stats section already handles BAB (stored as a single integer) and threads DEX/CON/WIS scores from the ability scores section. Attack bonus totals (melee, ranged, thrown) are pure derivations: BAB + ability modifier + a per-type misc mod. The misc mods are the only new persisted data.

## Goals / Non-Goals

**Goals:**
- Display derived melee, ranged, and thrown attack bonus totals on the character sheet
- Allow per-type misc modifier entry (debounced save, owner-only)
- Keep strScore reactive — if the player edits STR in the ability scores section, melee/thrown totals update immediately without a page reload

**Non-Goals:**
- Multiple attacks (iterative attacks at high BAB) — out of scope for now
- Weapon-specific attack bonuses — those belong on a future weapons/attacks section

## Decisions

**Separate misc mod per attack type (not shared)**
Melee and thrown use identical formulas, but feats and abilities (e.g., Deadly Aim, Versatile Focus) can affect only one type. Separate columns future-proof the sheet at negligible cost — three integers.

**DB columns, not derived-only**
The misc mods must be persisted. The totals themselves are derived client-side (no need to store them), matching the same pattern as initiative, EAC, KAC, and saving throws.

**strScore threaded through scores object**
`CharacterStatsClient` already holds a reactive `scores` state (updated live as the user edits ability scores). `strScore` is in that object — it just needs to be passed down to `CombatStatsSection` alongside the existing `dexScore`/`conScore`/`wisScore`. No new state, no new lifting.

**UI placement: between BAB and Armor Class**
Attack bonuses are the natural consumer of BAB, so they belong immediately after the BAB row.

## Risks / Trade-offs

[BAB layout change] The current BAB grid uses `grid-cols-[12rem_5rem_5rem_5rem]` (Total / — / Misc). Adding an attack bonuses grid below it with a different column structure (Total / BAB / Ability Mod / Misc) means the two grids won't align visually. Mitigation: the attack bonuses grid is its own `<div>` with its own header row, matching the Armor Class and Saving Throws pattern.

## Migration Plan

1. Add three columns to the DB schema with `default(0).notNull()`
2. Generate and run Drizzle migration
3. Deploy — existing characters get `0` for all misc mods, which is correct
4. No rollback risk: columns are additive with safe defaults
