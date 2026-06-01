## 1. Schema

- [x] 1.1 Add `spell_school` pgEnum to `src/db/schema.ts` with all 9 values
- [x] 1.2 Add `spells` table definition to `src/db/schema.ts` with all columns
- [x] 1.3 Add `spell_class` junction table definition to `src/db/schema.ts`
- [x] 1.4 Add `character_spells` table definition to `src/db/schema.ts`
- [x] 1.5 Add `character_spell_slots` table definition to `src/db/schema.ts`
- [x] 1.6 Add `is_spellcaster boolean NOT NULL DEFAULT false` column to the `classes` table definition in `src/db/schema.ts`
- [x] 1.7 Run `npm run db:generate` and verify the migration file is produced

## 2. Migrations

- [x] 2.1 Apply the generated schema migration to add the new tables and `is_spellcaster` column
- [x] 2.2 Write a data migration to set `is_spellcaster = true` for Mystic and Technomancer rows in `classes`

## 3. Spell Seeding — Shared Spells

- [x] 3.1 Create seed migration for spells that appear on both the Mystic and Technomancer spell lists (insert into `spells` only — no `spell_class` rows yet)

## 4. Spell Seeding — Mystic

- [x] 4.1 Create seed migration for Mystic-only level 0 spells (insert into `spells`)
- [x] 4.2 Create seed migration for Mystic-only level 1–3 spells (insert into `spells`)
- [x] 4.3 Create seed migration for Mystic-only level 4–6 spells (insert into `spells`)
- [x] 4.4 Create seed migration for all Mystic `spell_class` rows (both Mystic-only and shared spells, all levels 0–6)

## 5. Spell Seeding — Technomancer

- [x] 5.1 Create seed migration for Technomancer-only level 0 spells (insert into `spells`)
- [x] 5.2 Create seed migration for Technomancer-only level 1–3 spells (insert into `spells`)
- [x] 5.3 Create seed migration for Technomancer-only level 4–6 spells (insert into `spells`)
- [x] 5.4 Create seed migration for all Technomancer `spell_class` rows (both Technomancer-only and shared spells, all levels 0–6)

## 6. Queries

- [x] 6.1 Create `src/db/queries/spells.ts` with `getSpellsByClassAndLevel(classId, spellLevel)` — returns all spells for a class at a given level
- [x] 6.2 Add `getCharacterSpells(characterId)` — returns all spells known by a character, grouped by spell_level
- [x] 6.3 Add `addCharacterSpell(characterId, spellId, spellLevel)` — inserts a row into `character_spells`
- [x] 6.4 Add `removeCharacterSpell(characterId, spellId)` — deletes a row from `character_spells`
- [x] 6.5 Add `getCharacterSpellSlots(characterId)` — returns all `character_spell_slots` rows for a character
- [x] 6.6 Add `upsertCharacterSpellSlots(characterId, spellLevel, totalSlots, usedSlots)` — upsert a `character_spell_slots` row
- [x] 6.7 Update `getCharacterById` (or equivalent) to include `classes.is_spellcaster` in the returned data

## 7. Spells Section UI

- [x] 7.1 Create `src/app/dashboard/characters/[id]/_components/spells-section.tsx` with spell level tabs (0–6)
- [x] 7.2 Implement slot tracker sub-component for levels 1–6 (total field + used slots toggle, calls `upsertCharacterSpellSlots` on change)
- [x] 7.3 Implement known-spells list: name, school badge, casting time, damage summary; expand to show full detail
- [x] 7.4 Implement add-spell dialog: lists spells for the character's class at the selected level, excludes already-known spells; on confirm calls `addCharacterSpell`
- [x] 7.5 Wire `spells-section.tsx` into the character sheet page (`src/app/dashboard/characters/[id]/page.tsx`), rendering only when `is_spellcaster = true`

## 8. Verification

- [x] 8.1 Run `npm run lint` and `npx tsc --noEmit` — zero errors
- [ ] 8.2 Manually verify: Mystic character shows Spells section; Soldier character does not  ← needs browser
- [ ] 8.3 Manually verify: add a spell to a Mystic character from the dialog; it appears in the list  ← needs browser
- [ ] 8.4 Manually verify: set total slots for level 1, mark slots used, verify used count updates  ← needs browser
