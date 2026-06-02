## 1. Database Schema

- [x] 1.1 Add `currentCharges` (nullable integer) column to `characterEquipment` in `src/db/schema.ts`
- [x] 1.2 Generate Drizzle migration for the new column (`npm run db:generate` or equivalent)
- [x] 1.3 Apply migration to the database

## 2. Query Layer

- [x] 2.1 Add `currentCharges` to the `CharacterEquipmentEntry` type in `src/db/queries/characters.ts`
- [x] 2.2 Include `currentCharges` in the select projection in `getCharacterEquipment` and `addCharacterEquipment`
- [x] 2.3 Add `updateCharacterEquipmentCharges(id, currentCharges: number | null)` query function

## 3. Server Actions

- [x] 3.1 Add `updateAmmoChargesAction(characterEquipmentId, characterId, currentCharges: number | null)` in `actions.ts`

## 4. UI — Ammo Card

- [x] 4.1 Remove the editable quantity `<Input>` from ammo cards in `equipment-inventory.tsx`
- [x] 4.2 Display `quantity` as read-only text (e.g. "3 units") on ammo cards for both owner and non-owner
- [x] 4.3 Add `currentCharges` local state to `EquipmentCard` (initialized from `entry.currentCharges`)
- [x] 4.4 Render the charge display as `<current> / <capacity>` (show capacity when currentCharges is null)
- [x] 4.5 Add − button: decrements currentCharges (initializes from capacity if null); disabled at 0
- [x] 4.6 Add + button: increments currentCharges toward capacity; disabled when full (null or = capacity)
- [x] 4.7 Wire +/− buttons to call `updateAmmoChargesAction` via `startTransition`
- [x] 4.8 Add Reload button: sets currentCharges to null, decrements quantity by 1; disabled when quantity ≤ 1
- [x] 4.9 Wire Reload to call `updateAmmoChargesAction(null)` and `updateEquipmentQuantityAction(qty - 1)` via `startTransition`

## 5. Validation

- [x] 5.1 Run `npm run lint` and `npx tsc --noEmit` — resolve all errors
