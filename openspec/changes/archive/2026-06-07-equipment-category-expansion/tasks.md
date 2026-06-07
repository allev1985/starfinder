## 1. Database Migration

- [x] 1.1 Create migration file that adds `computer`, `magic_item`, `trap`, `technological`, `personal` to the `equipment_category` enum via `ALTER TYPE equipment_category ADD VALUE`

## 2. Schema & Types

- [x] 2.1 Update `equipmentCategory` pgEnum in `src/db/schema.ts` to include the five new values
- [x] 2.2 Run `npx tsc --noEmit` to confirm `EquipmentCategory` type is updated and no type errors

## 3. Admin Equipment CRUD

- [x] 3.1 Add all five new values to the `EQUIPMENT_CATEGORIES` array in `_equipment-client.tsx`
- [x] 3.2 Update `EMPTY_FORM` default category if needed (keep `personal_upgrade` as default — it's still valid)
- [x] 3.3 Confirm shield-specific and augmentation-specific conditional field rendering still works correctly for new categories (new types should show neither)

## 4. Character Equipment Inventory — Items Section

- [x] 4.1 Add `ITEMS_CATEGORIES` constant in `equipment-inventory.tsx` covering `computer`, `magic_item`, `trap`, `technological`, `personal`
- [x] 4.2 Add `items` derived array alongside `shields`, `augmentations`, `ammunition` in `EquipmentInventory`
- [x] 4.3 Render Items sub-group section after Ammunition with a placeholder for empty state
- [x] 4.4 Create or reuse a simple item card component for Items entries: shows name, level, category label, price, bulk, remove button (owner only) — no charge controls or wielded toggle

## 5. Character Equipment Inventory — Category Labels

- [x] 5.1 Replace the `categoryLabel` ternary chain in `EquipmentCard` with a full lookup object covering all ten categories (including `computer → "Computer"`, `magic_item → "Magic Item"`, `trap → "Trap"`, `technological → "Technological"`, `personal → "Personal Item"`)

## 6. Equipment Picker — Grouped Command List

- [x] 6.1 Remove `FilterTab` type, `pickerFilter` state, and the tab bar render from `EquipmentInventory`
- [x] 6.2 Replace the flat `CommandGroup` with one `CommandGroup` per category, using the display order: Shields → Augmentations & Upgrades → Ammunition → Computers → Technological → Magic Items → Traps → Personal Items
- [x] 6.3 Each `CommandGroup` heading label should use the human-readable category name
- [x] 6.4 Omit any `CommandGroup` that has zero visible items (avoids orphan headings during search)
- [x] 6.5 Confirm the existing "already-carried non-stackable items are hidden" logic still works with the new structure

## 7. Lint & Typecheck

- [x] 7.1 Run `npm run lint` — fix any errors
- [x] 7.2 Run `npx tsc --noEmit` — fix any type errors
