## Why

The spaceship sheet is missing two things needed during starship combat: a misc modifier for the total shield pool (for situational bonuses), and a way to track what weapons are mounted in each firing arc. Without weapons, players have no reference on the sheet during combat.

## What Changes

- **New**: `shieldMiscMod` field on the spaceship — a manually entered integer that is added to the computed shield total
- **New**: Weapons section on the spaceship editor, organized by arc (Forward, Port, Starboard, Aft) — each arc can hold multiple weapons with Name, Damage, Range, and Special fields
- **New**: `spaceship_weapons` table to persist weapons linked to a spaceship and arc
- **Modified**: Shield total computation includes the new misc modifier

## Capabilities

### New Capabilities

- `spaceship-shield-misc-mod`: Misc modifier field on the shields section that adds to the computed shield total
- `spaceship-weapons`: Per-arc weapon list for a spaceship — manual entry of Name, Damage, Range, Special; multiple weapons per arc; insertion order; all campaign participants can add/delete

### Modified Capabilities

- `spaceship-shields`: Shield total now includes a misc modifier in addition to the four directional values

## Impact

- `src/db/schema.ts` — add `shieldMiscMod` column to `spaceships`; add `spaceshipWeapons` table
- `src/db/queries/campaigns.ts` — add queries for fetching, creating, and deleting spaceship weapons
- `src/app/dashboard/campaigns/[id]/spaceship/actions.ts` — add `createWeaponAction` and `deleteWeaponAction`; include `shieldMiscMod` in `updateSpaceshipAction`
- `src/app/dashboard/campaigns/[id]/spaceship/page.tsx` — fetch weapons server-side and pass to editor
- `src/app/dashboard/campaigns/[id]/spaceship/_name-editor.tsx` — add misc mod input to shields section; add weapons section with per-arc lists and add/delete UI
- Two new Supabase migrations required
