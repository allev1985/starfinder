## 1. Database

- [x] 1.1 Add `melee_attack_misc_mod`, `ranged_attack_misc_mod`, `thrown_attack_misc_mod` integer columns to characters table in `src/db/schema.ts`
- [x] 1.2 Generate Drizzle migration (`npx drizzle-kit generate`) and apply it

## 2. Server Actions

- [x] 2.1 Add `updateMeleeAttackMiscModAction` to `src/app/dashboard/characters/[id]/actions.ts`
- [x] 2.2 Add `updateRangedAttackMiscModAction` to `src/app/dashboard/characters/[id]/actions.ts`
- [x] 2.3 Add `updateThrownAttackMiscModAction` to `src/app/dashboard/characters/[id]/actions.ts`

## 3. Data Layer

- [x] 3.1 Include the three new misc mod fields in the character query in `src/db/queries/characters.ts`

## 4. Component Wiring

- [x] 4.1 Pass `strScore` from `scores` object and the three new misc mod props through `CharacterStatsClient` to `CombatStatsSection`
- [x] 4.2 Update `CombatStatsSection` props type to accept `strScore` and the three misc mod fields

## 5. UI

- [x] 5.1 Add Attack Bonuses sub-grid to `CombatStatsSection` (between BAB row and Armor Class grid) with Melee, Ranged, and Thrown rows — columns: Total / BAB / Ability Mod / Misc
- [x] 5.2 Wire up three `useState` + `useDebouncedSave` pairs for the misc mod inputs
- [x] 5.3 Verify totals update reactively when STR or DEX score changes

## 6. Validation

- [x] 6.1 Run `npm run lint` and `npx tsc --noEmit` — fix any errors
