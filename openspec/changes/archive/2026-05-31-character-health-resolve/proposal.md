## Why

Characters in Starfinder have three health pools — Stamina Points, Hit Points, and Resolve Points — that players track during play. Without a place to record these on the sheet, players have no way to manage their character's survival state within the app.

## What Changes

- Add six integer columns to `character_combat_stats` (SP total, SP current, HP total, HP current, RP total, RP current)
- Add a database migration for the new columns
- Add a "Health & Resolve" section to the character detail page with read/edit behaviour matching existing stat sections

## Capabilities

### New Capabilities

- `character-health-resolve`: Displays and edits Stamina Points, Hit Points, and Resolve Points (total and current) on the character sheet

### Modified Capabilities

- `character-combat-stats`: Schema extended with six new health/resolve columns; query updated to return them

## Impact

- `src/db/schema.ts` — new columns on `characterCombatStats`
- `src/db/queries/characters.ts` — `getCharacterCombatStats` return shape expands
- `src/app/dashboard/characters/[id]/_components/` — new `HealthResolveSection` component
- `src/app/dashboard/characters/[id]/page.tsx` — renders the new section
- `src/app/dashboard/characters/[id]/actions.ts` — new server action to persist the six values
- New Drizzle migration file
