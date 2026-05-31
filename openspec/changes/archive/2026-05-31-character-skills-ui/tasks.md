## 1. Database — Schema & Migration

- [x] 1.1 Add `skillRanksPerLevel` integer column to `classes` table in `src/db/schema.ts`
- [x] 1.2 Write migration `0021_character_skills.sql`: `ALTER TABLE classes ADD COLUMN skill_ranks_per_level INTEGER NOT NULL DEFAULT 0` + UPDATE seeding all 7 CRB values
- [x] 1.3 Add `characterSkills` table to `src/db/schema.ts` with columns: `id` (UUID PK), `characterId` (FK → characters), `skillId` (FK → skills), `label` (text nullable), `ranks` (int default 0), `miscMod` (int default 0), cascade delete on character
- [x] 1.4 Add Drizzle type exports for `CharacterSkill` and `NewCharacterSkill` in `src/db/schema.ts`
- [x] 1.5 Write migration DDL for `character_skills` table in `0021_character_skills.sql`
- [x] 1.6 Apply migration to local Supabase (`supabase db push` or via MCP)

## 2. Database — Queries

- [x] 2.1 Add `getCharacterSkills(characterId)` query to `src/db/queries/characters.ts` — returns all `character_skills` rows for a character
- [x] 2.2 Add `getAllSkillsWithClassFlag(classId | null)` query to `src/db/queries/reference.ts` — returns all 20 skills with a boolean `isClassSkill` flag derived from `class_skills` for the given classId
- [x] 2.3 Add `upsertCharacterSkills(characterId, skills: {skillId, label?, ranks, miscMod}[])` to `src/db/queries/characters.ts` — batch insert/update using `onConflictDoUpdate` on `(characterId, skillId)` for non-Profession; for Profession inserts new rows
- [x] 2.4 Add `deleteCharacterSkill(id)` query to `src/db/queries/characters.ts` — deletes a single `character_skills` row by its UUID
- [x] 2.5 Add `deleteCharacterSkillsBySkillId(characterId, skillId)` query — used when unchecking a non-Profession skill in the dialog diff

## 3. Server Actions

- [x] 3.1 Add `saveCharacterSkillsAction(characterId, added: SkillEntry[], removed: string[])` to `src/app/dashboard/characters/[id]/actions.ts` — authorization-checks owner, then calls batch upsert for added and delete for removed IDs in sequence
- [x] 3.2 Add `updateSkillRanksAction(id, ranks)` server action — updates `ranks` on a single `character_skills` row
- [x] 3.3 Add `updateSkillMiscModAction(id, miscMod)` server action — updates `misc_mod` on a single `character_skills` row
- [x] 3.4 Add `removeCharacterSkillAction(id)` server action — authorization-checks owner, calls `deleteCharacterSkill(id)`

## 4. Skills Section — Core UI

- [x] 4.1 Create `src/app/dashboard/characters/[id]/_components/skills-section.tsx` — client component; accepts `characterId`, `characterSkills`, `allSkills` (with `isClassSkill`), `scores` (ability scores), `classSkillRanksPerLevel`, `level`, `isOwner`
- [x] 4.2 Implement ranks budget computation in the component: `ranksPerLevel = max(1, skillRanksPerLevel + INTmod)`, `totalAvailable = ranksPerLevel × level`, `ranksUsed = sum of all ranks`
- [x] 4.3 Implement total computation per skill row: `ranks + (isClassSkill && ranks > 0 ? 3 : 0) + abilityMod + miscMod`
- [x] 4.4 Render skill rows in a grid (alphabetical): skill name with ★ prefix for class skills, ability abbreviation, ranks input (owner) / value (viewer), class bonus read-only, ability mod read-only, misc mod input (owner) / value (viewer), total read-only
- [x] 4.5 Wire ranks input to `updateSkillRanksAction` via `useDebouncedSave` (600ms)
- [x] 4.6 Wire misc mod input to `updateSkillMiscModAction` via `useDebouncedSave` (600ms)
- [x] 4.7 Add per-row remove button (owner only) that calls `removeCharacterSkillAction` and removes the row from local state
- [x] 4.8 Render empty state when no skills: descriptive message + "Add Skills" button
- [x] 4.9 Render ranks budget in section header: `X used / Y available` (show even when skills list is non-empty)

## 5. Add Skills Dialog

- [x] 5.1 Create `src/app/dashboard/characters/[id]/_components/add-skills-dialog.tsx` — client component; accepts `allSkills` (with `isClassSkill`), `existingSkills` (current character_skills), `characterId`, `onSaved` callback
- [x] 5.2 Render shadcn Dialog with a scrollable checklist of all 20 skills, alphabetical; each item shows ★, skill name, ability abbreviation
- [x] 5.3 Pre-check skills already on the character; disable unchecking for non-Profession skills if logic should prevent accidental removal — or allow it (removal diff on Save)
- [x] 5.4 Implement Profession special handling: when Profession is checked, show a list of label text inputs; render an inline "+ Add profession" button to append another input; each entry has a remove (×) button
- [x] 5.5 Pre-populate existing Profession entries in the label inputs
- [x] 5.6 On Save: compute diff (added non-Profession skills, added Profession entries, removed skills/entries), call `saveCharacterSkillsAction`, close dialog, trigger `onSaved`
- [x] 5.7 Integrate dialog trigger into `skills-section.tsx`: "Add Skills" button opens the dialog; `onSaved` refreshes the skills list (via router.refresh() or state update)

## 6. Character Page Integration

- [x] 6.1 In `src/app/dashboard/characters/[id]/page.tsx`, fetch `characterSkills` via `getCharacterSkills(id)` and `allSkills` via `getAllSkillsWithClassFlag(character.classId)`
- [x] 6.2 Fetch `skillRanksPerLevel` from the classes query or add it to `getCharacterWithCampaigns` return type (pull from joined `classes` row)
- [x] 6.3 Pass `characterSkills`, `allSkills`, `skillRanksPerLevel`, `character.level`, and `isOwner` to `<SkillsSection />`
- [x] 6.4 Place `<SkillsSection />` on the character page between the combat stats block and the campaigns section

## 7. Lint & Type Check

- [x] 7.1 Run `npm run lint` and resolve any issues
- [x] 7.2 Run `npx tsc --noEmit` and resolve any type errors
