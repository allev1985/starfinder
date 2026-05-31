## Context

The character sheet already has a `character_combat_stats` table and a `CombatStatsSection` component with sub-grids for Initiative/BAB and Armor Class. Saving throws (Fortitude, Reflex, Will) follow the same derived-total pattern as Initiative: a manual base value + a derived ability modifier + a manual misc modifier. CON/DEX/WIS scores live on the `characters` table and are already available in the character page data.

## Goals / Non-Goals

**Goals:**
- Store the 6 manual saving throw fields (3× base save, 3× misc mod) in the existing `character_combat_stats` table
- Display a Saving Throws sub-grid inside `CombatStatsSection` consistent with the Initiative/BAB grid style
- Derive totals client-side; never persist them

**Non-Goals:**
- Racial/feat/conditional bonuses (future work)
- Per-save proficiency tracking

## Decisions

### Store in `character_combat_stats`, not a new table
Saving throws are combat numbers, consistent with every other field in that table. Adding a new table would create join complexity for no current benefit.

### One server action per field (6 total)
Matches the existing pattern (one action per `updateXxx` query). Keeps each save atomic and avoids over-fetching. Alternatively a single `updateSavingThrows(all6)` bulk action was considered, but the per-field debounced pattern is already established and works well.

### Saving Throws sub-grid inside `CombatStatsSection`
Keeps all combat numbers in one section. Grid columns: **label | Total | Base Save (input) | Ability Mod (read-only, labeled CON/DEX/WIS Mod) | Misc (input)**. Totals formatted as signed strings (`+5`, `-1`) to match Initiative.

### Pass `conScore` and `wisScore` as props to `CombatStatsSection`
`dexScore` is already a prop. Adding the other two follows the same pattern and avoids refactoring the prop interface.

## Risks / Trade-offs

- **Schema drift**: adding 6 more columns continues the growth of `character_combat_stats`. At current scope this is fine; if the table continues to expand, a dedicated `character_saving_throws` table may be worth revisiting. → No mitigation needed now.
- **Migration on existing rows**: new columns default to `0`, so existing characters get valid (if empty) data with no backfill logic needed.

## Migration Plan

1. Add 6 columns to `characterCombatStats` in `src/db/schema.ts`
2. Run `npm run db:generate` to produce a Drizzle migration file
3. Run `npm run db:migrate` (or push) to apply
4. Rollback: drop the 6 columns (no data dependency from other tables)
