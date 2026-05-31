## Why

The character sheet is missing Armor Class, which is a core defensive combat stat in Starfinder. Without it, players cannot track whether attacks hit their character, making the sheet incomplete for actual play.

## What Changes

- Add four new columns to `character_combat_stats`: `eac_armor_bonus`, `eac_misc_mod`, `kac_armor_bonus`, `kac_misc_mod` (all INT, default 0)
- Extend the Combat Stats section on the character sheet to display EAC, KAC, and KAC vs. Combat Maneuvers rows
- EAC and KAC totals are derived at render time (`10 + armor_bonus + dex_mod + misc_mod`); KAC vs. CM is `8 + KAC total`
- Armor bonus and misc modifier fields are owner-editable; all totals and the DEX modifier are read-only

## Capabilities

### New Capabilities

- `character-armor-class`: EAC, KAC, and KAC vs. Combat Maneuvers display and editing on the character sheet

### Modified Capabilities

- `character-combat-stats`: Adds four armor class columns to the `character_combat_stats` table and extends the Combat Stats section UI

## Impact

- DB migration: 4 new columns on `character_combat_stats`
- `src/db/schema.ts`: 4 new fields on `characterCombatStats`
- `src/db/queries/characters.ts`: include new fields in character query
- `src/app/dashboard/characters/[id]/_components/combat-stats-section.tsx`: new AC sub-grid
- `src/app/dashboard/characters/[id]/_components/character-stats-client.tsx`: pass new props
- `src/app/dashboard/characters/[id]/page.tsx`: pass new props
- `src/app/dashboard/characters/[id]/actions.ts`: two new server actions for EAC/KAC armor bonus and misc mod
