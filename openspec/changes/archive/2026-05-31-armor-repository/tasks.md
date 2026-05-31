## 1. Schema — DDL Migrations

- [x] 1.1 Create migration: add `armor_type` enum (`light`, `heavy`, `powered`) to the database
- [x] 1.2 Create migration: create `armor` table with all columns (`id`, `name`, `type`, `item_level`, `price`, `eac_bonus`, `kac_bonus`, `max_dex_bonus` nullable, `armor_check_penalty`, `speed_adjustment`, `bulk`, `upgrade_slots`, `source_book`)
- [x] 1.3 Create migration: create `class_armor_proficiency` table (`class_id` FK → classes, `armor_type`, composite PK)
- [x] 1.4 Create migration: add nullable `equipped_armor_id` FK column to `characters` referencing `armor.id`
- [x] 1.5 Create migration: drop `eac_armor_bonus` and `kac_armor_bonus` from `character_combat_stats`

## 2. Schema — Drizzle ORM

- [x] 2.1 Add `armorType` pgEnum and `armor` table definition to `src/db/schema.ts`
- [x] 2.2 Add `classArmorProficiency` table definition to `src/db/schema.ts`
- [x] 2.3 Add `equippedArmorId` nullable FK column to the `characters` table definition in `src/db/schema.ts`
- [x] 2.4 Remove `eacArmorBonus` and `kacArmorBonus` columns from the `characterCombatStats` table definition in `src/db/schema.ts`
- [x] 2.5 Export new inferred types: `Armor`, `NewArmor`, `ClassArmorProficiency`

## 3. Seed Data — CRB Armor

- [x] 3.1 Create seed migration: insert all CRB light armor rows into `armor` (source stats from Archives of Nethys aonprd.com — verify each row against the CRB)
- [x] 3.2 Create seed migration: insert all CRB heavy armor rows into `armor` (source stats from Archives of Nethys)
- [x] 3.3 Create seed migration: insert CRB powered armor rows into `armor` (`type = 'powered'`, no proficiency rows)
- [x] 3.4 Create seed migration: insert `class_armor_proficiency` rows — light-only for Envoy, Mechanic, Mystic, Operative, Technomancer; light + heavy for Solarian and Soldier (look up class UUIDs from existing classes seed)

## 4. Query Layer

- [x] 4.1 Add `getArmorForClass(classId: string | null): Promise<Armor[]>` to `src/db/queries/reference.ts` — joins `armor` with `class_armor_proficiency`, filters to proficient types, orders by type then item_level; returns empty array when classId is null
- [x] 4.2 Add `getArmorById(id: string): Promise<Armor | null>` to `src/db/queries/reference.ts`
- [x] 4.3 Update the character detail query in `src/db/queries/characters.ts` to left-join `armor` on `characters.equipped_armor_id` and include the armor row in the returned shape

## 5. Server Actions

- [x] 5.1 Add `updateEquippedArmorAction(characterId: string, armorId: string | null)` to `src/app/dashboard/characters/[id]/actions.ts`
- [x] 5.2 Remove `updateEacArmorBonusAction` and `updateKacArmorBonusAction` from `src/app/dashboard/characters/[id]/actions.ts`

## 6. UI — Armor Picker Component

- [x] 6.1 Install shadcn `command` and `popover` components if not already present (`npx shadcn@latest add command popover`)
- [x] 6.2 Create `src/app/dashboard/characters/[id]/_components/armor-picker.tsx` — a controlled combobox that accepts `armor: Armor[]`, `equippedArmorId: string | null`, `characterId: string`, and `isOwner: boolean`; renders the Command + Popover combobox for owners, read-only text for non-owners; shows "Select a class to enable armor selection" when armor array is empty
- [x] 6.3 On selection in the armor picker, call `updateEquippedArmorAction` and update local state immediately (optimistic UI)
- [x] 6.4 Include a "None" option at the top of the list that clears equipped armor (`armorId = null`)

## 7. UI — Combat Stats Section Refactor

- [x] 7.1 Update `CombatStatsSection` props in `combat-stats-section.tsx`: remove `eacArmorBonus` and `kacArmorBonus`; add `equippedArmor: Armor | null` and `availableArmor: Armor[]`
- [x] 7.2 Fix the DEX cap: replace `const eacTotal = 10 + eacBonus + dexMod + eacMisc` with the capped formula using `equippedArmor?.maxDexBonus`; apply same fix to KAC
- [x] 7.3 Replace editable armor bonus inputs in the EAC/KAC grid with read-only display values derived from `equippedArmor?.eacBonus ?? 0` and `equippedArmor?.kacBonus ?? 0`
- [x] 7.4 Render `ArmorPicker` above the AC sub-grid, passing `availableArmor`, `equippedArmor?.id`, `characterId`, and `isOwner`
- [x] 7.5 Render armor stat strip below the AC grid when armor is equipped: Max DEX | ACP | Speed | Bulk | Upgrade Slots — hidden when no armor is equipped
- [x] 7.6 Remove the `useState` and debounced save hooks for `eacBonus` and `kacBonus` (now dead code)

## 8. Page Integration

- [x] 8.1 Update `src/app/dashboard/characters/[id]/page.tsx` to fetch `availableArmor` using `getArmorForClass(character.classId)` and pass it to the combat stats section
- [x] 8.2 Pass `equippedArmor` (from the updated character query join) to `CombatStatsSection`

## 9. Verification

- [x] 9.1 Run `npm run lint` and fix any errors
- [x] 9.2 Run `npx tsc --noEmit` and fix any type errors
- [ ] 9.3 Manually verify: equip light armor on an Envoy character — confirm EAC/KAC bonuses update and DEX is capped correctly
- [ ] 9.4 Manually verify: Soldier character sees both light and heavy armor in the picker
- [ ] 9.5 Manually verify: character with no class sees empty picker with placeholder message
- [ ] 9.6 Manually verify: clearing armor resets bonus to 0
