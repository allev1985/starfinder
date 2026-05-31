## 1. Database

- [x] 1.1 Add `eac_armor_bonus`, `eac_misc_mod`, `kac_armor_bonus`, `kac_misc_mod` columns (INT NOT NULL DEFAULT 0) to `characterCombatStats` in `src/db/schema.ts`
- [x] 1.2 Generate Drizzle migration with `npx drizzle-kit generate`
- [ ] 1.3 Apply migration with `npx drizzle-kit migrate` [PENDING — Supabase connection timeout]

## 2. Query Layer

- [x] 2.1 Include the four new AC fields in the character query in `src/db/queries/characters.ts`

## 3. Server Actions

- [x] 3.1 Add `updateEacArmorBonusAction` to `src/app/dashboard/characters/[id]/actions.ts`
- [x] 3.2 Add `updateEacMiscModAction` to `src/app/dashboard/characters/[id]/actions.ts`
- [x] 3.3 Add `updateKacArmorBonusAction` to `src/app/dashboard/characters/[id]/actions.ts`
- [x] 3.4 Add `updateKacMiscModAction` to `src/app/dashboard/characters/[id]/actions.ts`

## 4. UI — CombatStatsSection

- [x] 4.1 Add AC props to `CombatStatsSection` (`eacArmorBonus`, `eacMiscMod`, `kacArmorBonus`, `kacMiscMod`)
- [x] 4.2 Wire up four debounced save hooks for the new actions
- [x] 4.3 Add AC sub-grid below BAB row with column headers (Total | Armor Bonus | DEX Mod | Misc)
- [x] 4.4 Render EAC row: derived total, owner-editable armor bonus, read-only DEX mod, owner-editable misc mod
- [x] 4.5 Render KAC row: derived total, owner-editable armor bonus, read-only DEX mod, owner-editable misc mod
- [x] 4.6 Render KAC vs. Combat Maneuvers row: read-only derived total only (no inputs)

## 5. Data Flow

- [x] 5.1 Pass four new AC props through `CharacterStatsClient` to `CombatStatsSection`
- [x] 5.2 Pass four new AC values from the character query into `CharacterStatsClient` in the character detail page

## 6. Validation

- [x] 6.1 Run `npm run lint` and fix any issues
- [x] 6.2 Run `npx tsc --noEmit` and fix any type errors
