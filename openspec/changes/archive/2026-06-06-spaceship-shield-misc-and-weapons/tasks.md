## 1. Database Schema

- [x] 1.1 Add `shield_misc_mod integer NOT NULL DEFAULT 0` column to `spaceships` in `src/db/schema.ts`
- [x] 1.2 Add `spaceshipWeapons` table to `src/db/schema.ts` with columns: `id` (uuid PK), `spaceshipId` (FK → spaceships, cascade delete), `arc` (text, CHECK forward/port/starboard/aft), `name` (text NOT NULL), `damage` (text nullable), `range` (text nullable), `special` (text nullable), `createdAt`
- [x] 1.3 Export `SpaceshipWeapon` and `NewSpaceshipWeapon` types from schema

## 2. Migrations

- [x] 2.1 Write migration to add `shield_misc_mod` to `spaceships` (in `supabase/migrations/`)
- [x] 2.2 Write migration to create `spaceship_weapons` table with arc check constraint

## 3. Queries

- [x] 3.1 Add `getWeaponsBySpaceship(spaceshipId)` query to `src/db/queries/campaigns.ts`
- [x] 3.2 Add `createSpaceshipWeapon(data)` query
- [x] 3.3 Add `deleteSpaceshipWeapon(weaponId)` query

## 4. Server Actions

- [x] 4.1 Add `shieldMiscMod` to the `updateSpaceshipAction` field union in `actions.ts`
- [x] 4.2 Add `createWeaponAction(campaignId, spaceshipId, data)` to `actions.ts`
- [x] 4.3 Add `deleteWeaponAction(campaignId, weaponId)` to `actions.ts`

## 5. Page — Fetch Weapons

- [x] 5.1 In `page.tsx`, call `getWeaponsBySpaceship` and pass result as `weapons` prop to `SpaceshipEditor`

## 6. UI — Shield Misc Mod

- [x] 6.1 In `_name-editor.tsx`, add `shieldMiscMod` to state (initialized from `spaceship.shieldMiscMod`)
- [x] 6.2 Add `shieldMiscMod` to `SimpleNumField` type and `simpleSetters` map
- [x] 6.3 Update computed `shieldTotalValue` to include `shieldMiscMod`
- [x] 6.4 Render Misc Mod input in the Shields section footer row (alongside Regen/min and the totals)

## 7. UI — Weapons Section

- [x] 7.1 Add `weapons` prop to `SpaceshipEditor` typed as `SpaceshipWeapon[]`; initialize local weapons state from prop
- [x] 7.2 Add per-arc add form state (name, damage, range, special inputs) — one set of state per arc or a shared form state keyed by arc
- [x] 7.3 Render Weapons section below Shields with four arc subsections (Forward, Port, Starboard, Aft)
- [x] 7.4 Each arc renders its weapon list in insertion order, showing Name, Damage, Range, Special, and a delete button
- [x] 7.5 Each arc renders an inline add form with Name (required), Damage, Range, Special inputs and an Add button
- [x] 7.6 Implement add handler: validate name is non-empty, call `createWeaponAction`, optimistically prepend to local list, clear form
- [x] 7.7 Implement delete handler: call `deleteWeaponAction`, optimistically remove from local list
