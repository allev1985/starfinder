## 1. Database Migration

- [x] 1.1 Add `shield` to the `equipment_category` Postgres enum in `src/db/schema.ts`
- [x] 1.2 Add nullable columns `eac_bonus`, `kac_bonus`, `ac_penalty`, `max_dex_bonus` to the `equipment` table in schema
- [x] 1.3 Add `wielded` boolean (default `false`, not null) to `character_equipment` table in schema
- [x] 1.4 Add `is_shield_proficiency` boolean (default `false`, not null) to `feats` table in schema
- [x] 1.5 Generate and apply the Drizzle migration

## 2. Admin — Shield Catalog CRUD

- [x] 2.1 Create `src/db/queries/admin-shields.ts` with `createShield`, `updateShield`, `deleteShield`, and `getShieldsByEdition` functions (mirror `admin-armor.ts` pattern)
- [x] 2.2 Create `src/app/dashboard/admin/data/[editionSlug]/shields/page.tsx` (server component, loads shields for edition)
- [x] 2.3 Create `src/app/dashboard/admin/data/[editionSlug]/shields/_shields-client.tsx` with full CRUD UI — sortable table (Name, Lvl, EAC, KAC, ACP, Bulk), Add/Edit modal with all fields including optional Max DEX Bonus, ConfirmDeleteDialog
- [x] 2.4 Add "Shields" nav card to `src/app/dashboard/admin/data/[editionSlug]/page.tsx`

## 3. Admin — Feats Update

- [x] 3.1 Add `isShieldProficiency` field to `FeatFormData` type in `src/db/queries/admin-feats.ts` and update create/update queries
- [x] 3.2 Add "Shield Prof" column (yes/no) to the feats table in `_feats-client.tsx`
- [x] 3.3 Add "Is Shield Proficiency Feat" checkbox to the feat add/edit modal in `_feats-client.tsx`

## 4. Character Context

- [x] 4.1 Update `CharacterEquipmentEntry` type in `src/db/queries/characters.ts` to include the `wielded` field
- [x] 4.2 Add `equippedShield` (derived: first `character_equipment` entry where `category === 'shield' && wielded === true`) and `hasShieldProficiency` (derived: `feats.some(f => f.isShieldProficiency)`) to character context in `character-context.tsx`
- [x] 4.3 Expose `setEquippedShield` and a `toggleShieldWielded` helper (or handle via `setEquipmentInventory`) in context so the inventory component can update wielded state

## 5. Server Actions

- [x] 5.1 Add `toggleShieldWieldedAction` server action in the character `[id]/actions.ts` that sets `wielded = true` for the given entry and `wielded = false` for all other shield entries for that character
- [x] 5.2 Ensure `addEquipmentAction` returns the full entry including `wielded` field

## 6. AC Formula Updates

- [x] 6.1 Update `vitals-strip.tsx` — add `equippedShield` and `hasShieldProficiency` from context; compute `shieldEacBonus` / `shieldKacBonus` (0 if not proficient or no shield wielded); update `effectiveMaxDex` to use `Math.min` of armor and shield caps; incorporate into EAC/KAC totals
- [x] 6.2 Update `combat-stats-section.tsx` with the same shield bonus and max DEX logic
- [x] 6.3 Update `skills-section.tsx` — add wielded shield's `ac_penalty` to armor check penalty total

## 7. Equipment Inventory UI

- [x] 7.1 Update `equipment-inventory.tsx` — add Shields sub-group above Augmentations, with wielded Checkbox (owner) / read-only indicator (non-owner); render shield stat cells (EAC, KAC, ACP, Max DEX)
- [x] 7.2 Add "shields" as a `FilterTab` and corresponding picker filter logic in `equipment-inventory.tsx`
- [x] 7.3 Wire the wielded checkbox to `toggleShieldWieldedAction` with optimistic update (toggle on = set this entry's `wielded` to true, set all other shield entries to false)

## 8. Realtime Sync

- [x] 8.1 Verify `character-realtime-sync.tsx` handles the new `wielded` field on equipment rows (update sync mapping if needed)

## 9. Lint & Type-check

- [x] 9.1 Run `npm run lint` and resolve any errors
- [x] 9.2 Run `npx tsc --noEmit` and resolve any type errors
