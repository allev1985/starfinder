## Why

The character sheet tracks BAB and ability scores but doesn't surface the derived attack bonus totals a player actually rolls — melee, ranged, and thrown. Players currently have to calculate these by hand every session.

## What Changes

- Add three misc modifier fields to the character DB schema (`melee_attack_misc_mod`, `ranged_attack_misc_mod`, `thrown_attack_misc_mod`)
- Add a Drizzle migration for the new columns
- Add three server actions to persist the misc mods
- Thread `strScore` into `CombatStatsSection` (currently absent)
- Add an Attack Bonuses sub-grid to `CombatStatsSection` with rows for Melee, Ranged, and Thrown, each showing Total / BAB / Ability Mod / Misc

## Capabilities

### New Capabilities

- `attack-bonuses`: Display and persist derived melee, ranged, and thrown attack bonus totals on the character sheet

### Modified Capabilities

<!-- none -->

## Impact

- `src/db/schema.ts` — 3 new integer columns
- `src/db/migrations/` — new migration file
- `src/db/queries/characters.ts` — include new fields in character query
- `src/app/dashboard/characters/[id]/actions.ts` — 3 new update actions
- `src/app/dashboard/characters/[id]/_components/character-stats-client.tsx` — pass `strScore` + 3 misc mod props to `CombatStatsSection`
- `src/app/dashboard/characters/[id]/_components/combat-stats-section.tsx` — new Attack Bonuses grid
