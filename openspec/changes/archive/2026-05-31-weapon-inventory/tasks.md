## 1. Database Schema

- [x] 1.1 Create migration `20260531210000_weapons_schema.sql`: add `weapon_category` enum and `weapons` table with all columns (id, name, item_level, category, damage_dice, damage_types text[], critical_effect, critical_dice, range, capacity, usage, bulk, special, source_book)
- [x] 1.2 Create migration `20260531210001_character_weapons.sql`: add `character_weapons` join table (character_id FK cascade, weapon_id FK, composite PK)
- [x] 1.3 Update `src/db/schema.ts`: add `weaponCategory` enum, `weapons` table definition, `character_weapons` table definition, and export inferred types (`Weapon`, `NewWeapon`, `CharacterWeapon`, `WeaponCategory`)

## 2. Seed Data — CRB Weapons

- [x] 2.1 Create migration `20260531220000_seed_weapons_small_arms.sql`: all CRB small arms (Azimuth Laser Pistol, Tactical Semi-Auto Pistol, etc.)
- [x] 2.2 Create migration `20260531220001_seed_weapons_longarms.sql`: all CRB longarms
- [x] 2.3 Create migration `20260531220002_seed_weapons_heavy.sql`: all CRB heavy weapons
- [x] 2.4 Create migration `20260531220003_seed_weapons_sniper.sql`: all CRB sniper weapons
- [x] 2.5 Create migration `20260531220004_seed_weapons_melee_basic.sql`: all CRB basic melee weapons
- [x] 2.6 Create migration `20260531220005_seed_weapons_melee_advanced.sql`: all CRB advanced melee weapons
- [x] 2.7 Create migration `20260531220006_seed_weapons_grenades.sql`: all CRB grenades
- [x] 2.8 Create migration `20260531220007_seed_weapons_special.sql`: all CRB special weapons

## 3. Database Queries & Server Actions

- [x] 3.1 Create `src/db/queries/weapons.ts`: `getAllWeapons()` returning all weapon rows, `getCharacterWeapons(characterId)` returning full weapon rows for a character's inventory
- [x] 3.2 Add to `src/app/dashboard/characters/[id]/actions.ts`: `addWeaponAction(characterId, weaponId)` server action inserting into `character_weapons`
- [x] 3.3 Add to `src/app/dashboard/characters/[id]/actions.ts`: `removeWeaponAction(characterId, weaponId)` server action deleting from `character_weapons`

## 4. Weapon UI Components

- [x] 4.1 Create `src/app/dashboard/characters/[id]/_components/weapon-picker.tsx`: searchable combobox (Command/Popover pattern matching armor-picker) listing all weapons not already in inventory; calls `addWeaponAction` on select; owner-only
- [x] 4.2 Create `src/app/dashboard/characters/[id]/_components/weapon-card.tsx`: stat card displaying name, level, category, damage (dice + types joined), critical (effect + dice or "—"), range ("—" for melee), capacity, usage, bulk, special; remove button (owner-only) with confirmation via AlertDialog
- [x] 4.3 Create `src/app/dashboard/characters/[id]/_components/inventory-section.tsx`: section wrapper with "Inventory" heading containing ArmorPicker subsection followed by Weapons subsection (weapon cards list + WeaponPicker for owners); shows "No weapons in inventory" placeholder when list is empty

## 5. Character Sheet Integration

- [x] 5.1 Update `src/app/dashboard/characters/[id]/page.tsx`: fetch `getAllWeapons()` and `getCharacterWeapons(characterId)`; pass data to `InventorySection`; remove ArmorPicker from its current location and render `InventorySection` below combat stats instead
- [x] 5.2 Remove the standalone ArmorPicker render from `character-stats-client.tsx` (or wherever it currently lives outside the inventory section) — it is now owned by `InventorySection`

## 6. Lint & Typecheck

- [x] 6.1 Run `npm run lint` and resolve any errors
- [x] 6.2 Run `npx tsc --noEmit` and resolve any type errors
