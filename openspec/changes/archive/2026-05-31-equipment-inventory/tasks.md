## 1. Database Schema Migrations

- [x] 1.1 Create migration: `equipment_category` and `augmentation_system` Postgres enums
- [x] 1.2 Create migration: `equipment` reference table with all columns (id, name, category, item_level, price, bulk, system, ammo_type, ammo_capacity, bonus_hint, source_book)
- [x] 1.3 Create migration: `character_equipment` instance table (id, character_id FK cascade, equipment_id FK, quantity default 1)
- [x] 1.4 Create migration: add nullable `ammo_type` text column to `weapons` table

## 2. Drizzle Schema Updates

- [x] 2.1 Add `equipmentCategory` and `augmentationSystem` enums to `src/db/schema.ts`
- [x] 2.2 Add `equipment` table definition to `src/db/schema.ts` with all columns and inferred types
- [x] 2.3 Add `characterEquipment` table definition to `src/db/schema.ts` with FK references and inferred types
- [x] 2.4 Add `ammo_type` column to the `weapons` table definition in `src/db/schema.ts`

## 3. Seed Migrations — Equipment Reference Data

- [x] 3.1 Create seed migration: CRB cybernetic augmentations (all body systems; include bonus_hint for stat-granting items)
- [x] 3.2 Create seed migration: CRB biotech augmentations (all body systems; include bonus_hint for stat-granting items)
- [x] 3.3 Create seed migration: Personal Upgrades Mk 1, Mk 2, Mk 3 (each with bonus_hint)
- [x] 3.4 Create seed migration: all CRB ammunition types (batteries ×4, petrochem ×2, small arm/longarm/heavy/sniper rounds, shells, darts, missiles)

## 4. Backfill Weapons ammo_type

- [x] 4.1 Create migration: backfill `ammo_type` for all seeded small arms (energy → battery, ballistic → small_arm_rounds)
- [x] 4.2 Create migration: backfill `ammo_type` for all seeded longarms (energy → battery, ballistic → longarm_rounds)
- [x] 4.3 Create migration: backfill `ammo_type` for all seeded heavy weapons (missiles, heavy rounds, petrochem, battery as appropriate)
- [x] 4.4 Create migration: backfill `ammo_type` for all seeded sniper weapons (sniper_rounds or battery)
- [x] 4.5 Create migration: backfill `ammo_type` for all seeded special weapons (darts, shells, or battery as appropriate); confirm melee_basic, melee_advanced, grenade rows remain null

## 5. Database Queries

- [x] 5.1 Add `getAllEquipment()` query to `src/db/queries/reference.ts` returning all equipment reference rows
- [x] 5.2 Add `getCharacterEquipment(characterId)` query to `src/db/queries/characters.ts` returning joined equipment rows with reference data
- [x] 5.3 Add `addCharacterEquipment(characterId, equipmentId)` server action
- [x] 5.4 Add `removeCharacterEquipment(characterEquipmentId, characterId)` server action
- [x] 5.5 Add `updateCharacterEquipmentQuantity(characterEquipmentId, characterId, quantity)` server action

## 6. Equipment Inventory UI Component

- [x] 6.1 Create `src/app/dashboard/characters/[id]/_components/equipment-inventory.tsx` with Augmentations & Upgrades and Ammunition sub-groups
- [x] 6.2 Implement equipment card: shows name, level, price, system (augments), ammo capacity (ammo); renders amber bonus-hint callout when bonus_hint is set
- [x] 6.3 Implement quantity control on ammunition cards (editable integer input, hidden for non-ammunition); wire to update action
- [x] 6.4 Implement equipment picker (popover with search + category filter tabs); wire to add action with optimistic UI
- [x] 6.5 Implement remove confirmation dialog on equipment cards; wire to remove action with optimistic UI

## 7. Weapon Card Enhancement

- [x] 7.1 Update `weapon-card.tsx` to display an ammo type badge (e.g., "Battery", "Small Arm Rounds") when `weapon.ammoType` is not null

## 8. Inventory Section & Page Loader Wiring

- [x] 8.1 Update `inventory-section.tsx` to import and render `EquipmentInventory` as a third subsection below Weapons
- [x] 8.2 Update the character sheet page loader to fetch all equipment reference data and the character's equipment entries
- [x] 8.3 Pass `allEquipment` and `initialCharacterEquipment` props through `InventorySection` to `EquipmentInventory`

## 9. Lint & Type-check

- [x] 9.1 Run `npm run lint` and resolve all errors
- [x] 9.2 Run `npx tsc --noEmit` and resolve all type errors
