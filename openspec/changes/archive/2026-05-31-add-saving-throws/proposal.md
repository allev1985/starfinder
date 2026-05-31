## Why

Saving throws (Fortitude, Reflex, Will) are a core part of the Starfinder combat system and are currently absent from the character sheet. Players need to see and maintain these values during play.

## What Changes

- Add 6 new columns to `character_combat_stats`: `fort_base_save`, `fort_misc_mod`, `ref_base_save`, `ref_misc_mod`, `will_base_save`, `will_misc_mod`
- Add a Drizzle migration for the new columns
- Add query helpers and server actions for updating each saving throw field
- Add a Saving Throws sub-grid inside `CombatStatsSection` displaying Fortitude, Reflex, and Will rows with Total, Base Save (manual), Ability Mod (derived), and Misc (manual) columns
- Wire `conScore` and `wisScore` into `CombatStatsSection` (DEX already present)

## Capabilities

### New Capabilities
- `character-saving-throws`: Fortitude/Reflex/Will saving throws displayed on the character sheet, each with a derived total from Base Save + Ability Mod + Misc Mod

### Modified Capabilities
- `character-combat-stats`: Schema gains 6 new saving throw columns; `CombatStatsSection` gains a new sub-grid

## Impact

- `src/db/schema.ts` — new columns on `characterCombatStats`
- `drizzle/migrations/` — new migration file
- `src/db/queries/characters.ts` — new update helpers
- `src/app/dashboard/characters/[id]/actions.ts` — 6 new server actions
- `src/app/dashboard/characters/[id]/_components/combat-stats-section.tsx` — new saving throws sub-grid
- `src/app/dashboard/characters/[id]/page.tsx` or parent — pass `conScore`/`wisScore` into `CombatStatsSection`
