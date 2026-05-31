## 1. Database Schema

- [x] 1.1 Add `fortBaseSave`, `fortMiscMod`, `refBaseSave`, `refMiscMod`, `willBaseSave`, `willMiscMod` integer columns (NOT NULL DEFAULT 0) to `characterCombatStats` in `src/db/schema.ts`
- [x] 1.2 Run `npm run db:generate` to generate the Drizzle migration file
- [x] 1.3 Run `npm run db:migrate` (or push) to apply the migration

## 2. Query Helpers

- [x] 2.1 Add `updateSavingThrows` (or 6 individual helpers) to `src/db/queries/characters.ts` that update the saving throw columns on `character_combat_stats`

## 3. Server Actions

- [x] 3.1 Add `updateFortBaseSaveAction` server action in `src/app/dashboard/characters/[id]/actions.ts`
- [x] 3.2 Add `updateFortMiscModAction` server action
- [x] 3.3 Add `updateRefBaseSaveAction` server action
- [x] 3.4 Add `updateRefMiscModAction` server action
- [x] 3.5 Add `updateWillBaseSaveAction` server action
- [x] 3.6 Add `updateWillMiscModAction` server action

## 4. Component

- [x] 4.1 Add `conScore`, `wisScore`, and the 6 saving throw field props to `CombatStatsSection` in `combat-stats-section.tsx`
- [x] 4.2 Add 6 `useState` values and 6 `useDebouncedSave` hooks for the saving throw fields
- [x] 4.3 Add the Saving Throws sub-grid (columns: label | Total | Base Save input | Ability Mod read-only | Misc input) below the existing Armor Class grid
- [x] 4.4 Format each total as a signed string (`+5`, `-1`) using the existing `formatModifier` helper

## 5. Page Wiring

- [x] 5.1 Pass `conScore` and `wisScore` from character data into `CombatStatsSection` in the character page/client component
- [x] 5.2 Pass the 6 saving throw field values from `characterCombatStats` into `CombatStatsSection`

## 6. Verification

- [x] 6.1 Run `npm run lint` — no errors
- [x] 6.2 Run `npx tsc --noEmit` — no type errors
- [ ] 6.3 Manually verify: totals update when ability scores change, inputs save on edit, non-owner sees read-only view
