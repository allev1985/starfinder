## Why

Ammunition items track capacity (shots per unit) and quantity (units carried), but there is no way to track how many charges remain in the currently loaded unit. At the table, players need to know "13 of 20 charges left in this battery" — without this, ammo management is manual bookkeeping outside the app.

## What Changes

- Add a `currentCharges` column (nullable integer) to `characterEquipment` to track charges remaining in the active unit (`null` = full/untouched)
- Replace the quantity number input on ammo cards with a +/− stepper for charge-level firing and a **Reload** action that exhausts the active unit and loads a fresh one from inventory
- New DB migration for the schema change
- New server action to update `currentCharges`

## Capabilities

### New Capabilities

- `ammo-charge-tracking`: Per-character tracking of charges remaining in the active ammunition unit, with +/− stepper and reload action in the equipment inventory UI

### Modified Capabilities

- `character-equipment-inventory`: Ammo card interaction model changes — quantity display and edit behavior is updated to reflect active-unit charge tracking alongside unit count

## Impact

- `src/db/schema.ts` — `characterEquipment` table gains `currentCharges` column
- New Drizzle migration
- `src/db/queries/characters.ts` — `CharacterEquipmentEntry` type and query
- `src/app/dashboard/characters/[id]/actions.ts` — new server action
- `src/app/dashboard/characters/[id]/_components/equipment-inventory.tsx` — ammo card UI
