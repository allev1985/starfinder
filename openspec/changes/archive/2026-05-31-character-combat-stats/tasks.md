## 1. Utility Extraction

- [x] 1.1 Create `src/lib/ability.ts` exporting `modifier(score: number): number`
- [x] 1.2 Update `ability-scores-section.tsx` to import `modifier` from `src/lib/ability.ts` and remove the local definition

## 2. Database

- [x] 2.1 Create migration `supabase/migrations/0013_character_combat_stats.sql` with `CREATE TABLE character_combat_stats` (`character_id UUID PRIMARY KEY`, `initiative_misc_mod INT NOT NULL DEFAULT 0`, FK to `characters.id`)
- [x] 2.2 Add backfill to migration: `INSERT INTO character_combat_stats (character_id) SELECT id FROM characters ON CONFLICT DO NOTHING`
- [x] 2.3 Add `characterCombatStats` table definition and inferred types to `src/db/schema.ts`

## 3. Query Layer

- [x] 3.1 Update `createCharacter` in `src/db/queries/characters.ts` to insert a `character_combat_stats` row (all defaults) after inserting the character
- [x] 3.2 Add `getCharacterCombatStats(characterId)` query returning the combat stats row
- [x] 3.3 Add `updateInitiativeMiscMod(characterId, value)` query

## 4. Service Layer

- [x] 4.1 Add `updateInitiativeMiscModForOwner(characterId, userId, value)` to `src/services/characters.ts` with ownership check

## 5. Server Action

- [x] 5.1 Add `updateInitiativeMiscModAction` server action in `src/app/dashboard/characters/[id]/actions.ts`

## 6. UI

- [x] 6.1 Create `src/app/dashboard/characters/[id]/_components/combat-stats-section.tsx` with initiative row (Total, DEX Mod, editable Misc)
- [x] 6.2 Fetch `characterCombatStats` in `page.tsx` alongside existing data fetches
- [x] 6.3 Render `CombatStatsSection` in `page.tsx` below `AbilityScoresSection`, passing `dexScore`, `initiativeMiscMod`, and `isOwner`

## 7. Validation

- [x] 7.1 Run `npm run lint` and `npx tsc --noEmit` with zero errors
- [ ] 7.2 Apply migration to local Supabase and verify combat stats row is created with new characters
- [ ] 7.3 Verify initiative total updates when DEX score is changed on the character sheet
