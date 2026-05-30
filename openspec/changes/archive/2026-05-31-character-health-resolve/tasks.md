## 1. Schema & Migration

- [x] 1.1 Add six integer columns to `characterCombatStats` in `src/db/schema.ts` (`staminaPointsTotal`, `staminaPointsCurrent`, `hitPointsTotal`, `hitPointsCurrent`, `resolvePointsTotal`, `resolvePointsCurrent`, all `notNull().default(0)`)
- [x] 1.2 Generate Drizzle migration with `npx drizzle-kit generate` and verify the SQL adds all six columns with `NOT NULL DEFAULT 0`
- [x] 1.3 Apply the migration with `npx drizzle-kit migrate`

## 2. Query & Types

- [x] 2.1 Verify `getCharacterCombatStats` in `src/db/queries/characters.ts` returns the new columns (Drizzle infers from schema — confirm the return type includes all six fields)
- [x] 2.2 Export updated `CharacterCombatStats` type from `src/db/schema.ts` (already inferred — confirm it reflects the new columns)

## 3. Server Action

- [x] 3.1 Add `updateHealthResolveAction` to `src/app/dashboard/characters/[id]/actions.ts` accepting all six values, parsing each with `parseInt` fallback to `0`, and upserting `character_combat_stats`

## 4. UI Component

- [x] 4.1 Create `src/app/dashboard/characters/[id]/_components/health-resolve-section.tsx` with a two-column grid (Total / Current) for SP, HP, and RP
- [x] 4.2 Owner view: render each of the six values as a number `Input`; on blur of any field call `updateHealthResolveAction` with all six current state values
- [x] 4.3 Non-owner view: render all six values as static text

## 5. Character Detail Page

- [x] 5.1 Import and render `HealthResolveSection` in `src/app/dashboard/characters/[id]/page.tsx`, passing `characterId`, the six health/resolve values from `combatStats`, and `isOwner`

## 6. Verification

- [x] 6.1 Run `npm run lint` and `npx tsc --noEmit` — zero errors
- [ ] 6.2 Manually verify: owner can edit all six fields and values persist on page reload
- [ ] 6.3 Manually verify: non-owner sees static text for all six values
