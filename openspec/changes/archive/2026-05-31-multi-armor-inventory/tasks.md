## 1. Database Schema

- [x] 1.1 Add `characterArmor` table to `src/db/schema.ts` (id uuid PK, characterId FK→characters cascade, armorId FK→armor, worn boolean default false)
- [x] 1.2 Remove `equippedArmorId` column from the `characters` table definition in `src/db/schema.ts`
- [x] 1.3 Export `CharacterArmor` and `NewCharacterArmor` types from `src/db/schema.ts`
- [x] 1.4 Generate and apply Drizzle migration (drop `equipped_armor_id`, create `character_armor`)

## 2. Database Queries

- [x] 2.1 Update `getCharacterById` in `src/db/queries/characters.ts` to join `character_armor WHERE worn = true` then join `armor`, replacing the old `equippedArmorId` join
- [x] 2.2 Add `getCharacterArmor(characterId)` query returning all `character_armor` rows with joined `armor` data, ordered by item_level
- [x] 2.3 Add `addCharacterArmor(characterId, armorId)` query inserting a new row with `worn = false`
- [x] 2.4 Add `removeCharacterArmor(characterArmorId)` query deleting the row by id
- [x] 2.5 Add `toggleCharacterArmorWorn(characterArmorId, characterId)` query: in a transaction, set all rows for characterId to `worn = false`, then set the target row to `worn = true`
- [x] 2.6 Add `unsetCharacterArmorWorn(characterArmorId)` query: set the target row to `worn = false`

## 3. Service Layer

- [x] 3.1 Update `updateEquippedArmorForOwner` in `src/services/characters.ts` — remove or replace with new service methods
- [x] 3.2 Add `addArmorForOwner(characterId, userId, armorId)` service method (auth check + insert)
- [x] 3.3 Add `removeArmorForOwner(characterArmorId, userId, characterId)` service method (auth check + delete)
- [x] 3.4 Add `toggleArmorWornForOwner(characterArmorId, userId, characterId, worn: boolean)` service method (auth check + toggle or unset)

## 4. Server Actions

- [x] 4.1 Replace `updateEquippedArmorAction` in `src/app/dashboard/characters/[id]/actions.ts` with `addArmorAction(characterId, armorId)`
- [x] 4.2 Add `removeArmorAction(characterArmorId, characterId)` server action
- [x] 4.3 Add `toggleArmorWornAction(characterArmorId, characterId, worn: boolean)` server action

## 5. Data Loading

- [x] 5.1 Update `src/app/dashboard/characters/[id]/page.tsx` to fetch `characterArmor` inventory rows alongside `availableArmor`, passing both to the client component

## 6. UI Components

- [x] 6.1 Delete `src/app/dashboard/characters/[id]/_components/armor-picker.tsx`
- [x] 6.2 Create `src/app/dashboard/characters/[id]/_components/armor-inventory.tsx` — inventory list with worn checkbox, stat strip per row, and Remove button (mirrors weapon-card/weapon-picker pattern)
- [x] 6.3 Add "Add Armor" picker inside `armor-inventory.tsx` — searchable combobox filtered by class proficiency, same popover pattern as `weapon-picker.tsx`
- [x] 6.4 Update `inventory-section.tsx` to replace `ArmorPicker` usage with `ArmorInventory`, passing `initialCharacterArmor`, `availableArmor`, and callbacks
- [x] 6.5 Update `character-stats-client.tsx` to remove `onArmorChange` / `availableArmor` props that were threaded for `ArmorPicker`; worn armor state flows from `initialEquippedArmor` via page load

## 7. Lint & Type Check

- [x] 7.1 Run `npm run lint` and fix all errors
- [x] 7.2 Run `npx tsc --noEmit` and fix all type errors
