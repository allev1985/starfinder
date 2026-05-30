## 1. Database Migration

- [x] 1.1 Create migration file adding `str_score`, `dex_score`, `con_score`, `int_score`, `wis_score`, `cha_score` columns (INTEGER NOT NULL DEFAULT 10) to `characters` table
- [x] 1.2 Apply migration to Supabase

## 2. Schema & Queries

- [x] 2.1 Add 6 ability score columns to `characters` table definition in `src/db/schema.ts`
- [x] 2.2 Add `updateCharacterAbilityScores(id, scores)` query function in `src/db/queries/characters.ts`

## 3. Service & Action

- [x] 3.1 Add `updateAbilityScoresForOwner(characterId, userId, scores)` to `src/services/characters.ts`
- [x] 3.2 Add `updateAbilityScoresAction(characterId, scores)` server action in `src/app/dashboard/characters/[id]/actions.ts`

## 4. UI Component

- [x] 4.1 Create `src/app/dashboard/characters/[id]/_components/ability-scores-section.tsx` — client component with score inputs (owner) or read-only text (non-owner), modifier derived inline, auto-save on blur

## 5. Character Sheet Page

- [x] 5.1 Pass current ability scores from `character` to `AbilityScoresSection` in `src/app/dashboard/characters/[id]/page.tsx`
- [x] 5.2 Render `<AbilityScoresSection>` in page layout, always visible
