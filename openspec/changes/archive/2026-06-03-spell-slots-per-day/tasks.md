## 1. Schema & Migrations

- [x] 1.1 Add `spells_per_day integer not null default 0` column to `classSpellProgression` in `src/db/schema.ts`
- [x] 1.2 Add `characterSpellSlots` table to `src/db/schema.ts` with columns `characterId`, `spellLevel`, `totalSlots`, `usedSlots` and PK `(characterId, spellLevel)`
- [x] 1.3 Export `CharacterSpellSlot` and `NewCharacterSpellSlot` types from `src/db/schema.ts`
- [x] 1.4 Create migration `supabase/migrations/<timestamp>_spell_slots.sql` — ALTER TABLE `class_spell_progression` ADD COLUMN `spells_per_day`, CREATE TABLE `character_spell_slots`
- [x] 1.5 Create migration `<timestamp>_seed_spells_per_day.sql` — UPDATE `class_spell_progression` rows for Mystic with CRB `spells_per_day` values (levels 1–20, spell levels 1–6)
- [x] 1.6 Create migration `<timestamp>_seed_spells_per_day_technomancer.sql` — same for Technomancer
- [x] 1.7 Run `npx tsc --noEmit` and `npm run lint` — confirm schema types are clean

## 2. DB Queries

- [x] 2.1 Add `getCharacterSpellSlots(characterId)` to `src/db/queries/spells.ts` — returns all `character_spell_slots` rows for the character
- [x] 2.2 Add `getSpellsPerDay(classId, characterLevel)` to `src/db/queries/spells.ts` — returns `Record<number, number>` mapping spell level → spells_per_day from `class_spell_progression`
- [x] 2.3 Add `upsertCharacterSpellSlot(characterId, spellLevel, totalSlots, usedSlots)` to `src/db/queries/spells.ts` — INSERT ... ON CONFLICT DO UPDATE
- [x] 2.4 Add `longRestCharacter(characterId)` to `src/db/queries/spells.ts` — UPDATE `character_spell_slots` SET `used_slots = 0` WHERE `character_id = ?`

## 3. Character Sheet Loader

- [x] 3.1 Import and call `getCharacterSpellSlots` and `getSpellsPerDay` in `loadCharacterSheetData` (alongside the existing spells queries) — only for spellcasting characters
- [x] 3.2 Return `characterSpellSlots` and `spellsPerDay` from the loader result

## 4. Server Actions

- [x] 4.1 Add `upsertSpellSlotsAction(characterId, spellLevel, totalSlots, usedSlots)` to `src/app/dashboard/characters/[id]/actions.ts` — authorization check, then calls the query
- [x] 4.2 Add `longRestAction(characterId)` to the same actions file — authorization check, then calls `longRestCharacter`
- [x] 4.3 Add `fetchSpellsPerDayAction(classId, characterLevel)` (or reuse/extend existing fetch pattern) so the component can refresh on level change

## 5. UI — SlotTracker Component

- [x] 5.1 Create `SlotTracker` sub-component inside `spells-section.tsx` — receives `totalSlots`, `usedSlots`, `isOwner`, `onTotalChange`, `onUsedChange` props
- [x] 5.2 Render pip row: filled pip = unused slot, empty pip = used slot; clicking a filled pip calls `onUsedChange(used + 1)`, clicking empty pip calls `onUsedChange(used - 1)`
- [x] 5.3 Render +/− buttons to adjust `totalSlots` (min 0); wire to `onTotalChange` with 600ms debounce via `useDebouncedSave`
- [x] 5.4 Display remaining count label (e.g. "3 / 5") next to pips

## 6. UI — Wiring Slot State into SpellsSection

- [x] 6.1 Accept `characterSpellSlots` and `spellsPerDay` as props on `SpellsSection`
- [x] 6.2 Initialise `slotState` local state: `Record<1|2|3|4|5|6, { totalSlots: number; usedSlots: number }>` from props (defaulting missing levels to `{ totalSlots: spellsPerDay[level] ?? 0, usedSlots: 0 }`)
- [x] 6.3 On pip tap (used change): update local state optimistically, fire `upsertSpellSlotsAction` immediately (no debounce)
- [x] 6.4 On total change: update local state, fire debounced `upsertSpellSlotsAction`
- [x] 6.5 Update level-change event handler to also refresh `spellsPerDay` defaults (for levels that have no existing slot row)
- [x] 6.6 Add "Long Rest" button to section header (owner only); on click call `longRestAction` and reset all `usedSlots` to 0 in local state
- [x] 6.7 Render `SlotTracker` inside each `SpellLevelPanel` for levels 1–6; skip for level 0

## 7. Character Sheet Page

- [x] 7.1 Pass `characterSpellSlots` and `spellsPerDay` from the loader result down to `SpellsSection` in the character sheet page

## 8. Lint & Type Check

- [x] 8.1 Run `npm run lint` — fix any issues
- [x] 8.2 Run `npx tsc --noEmit` — fix any type errors
