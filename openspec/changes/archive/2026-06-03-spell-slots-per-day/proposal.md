## Why

Spellcasting characters (Mystic, Technomancer) have no way to track spell slot usage during a session — the `character-spells` spec already defines this capability but the slot tracker has not been implemented. Players must track uses on paper, which defeats the purpose of a digital sheet.

## What Changes

- Add `spells_per_day` column to `class_spell_progression` (reference data showing the class table maximum per level/character-level)
- Seed `spells_per_day` values for Mystic and Technomancer in existing progression migrations
- Create `character_spell_slots` table: per-character, per-spell-level tracking of `total_slots` (player-set) and `used_slots` (resets on long rest)
- Add slot tracker UI to the Spells section: pip display, +/− controls for total, tap to use/recover individual slots
- Add Long Rest action that zeros all `used_slots` for a character in one server action
- Expose `spells_per_day` from reference data as a suggested default when a player first sets their total slots

## Capabilities

### New Capabilities

_(none — all requirements are already captured in existing specs)_

### Modified Capabilities

- `character-spells`: implement the `character_spell_slots` table and manual slot tracker UI (requirements already written in spec, implementation pending)
- `spell-reference-data`: add `spells_per_day` column to `class_spell_progression` reference table and seed data

## Impact

- **Schema**: new `character_spell_slots` table; `class_spell_progression` gains `spells_per_day` integer column
- **Migrations**: one migration for the new table, one altering `class_spell_progression`, seed updates for Mystic/Technomancer progression rows
- **Server actions**: `upsertSpellSlotsAction`, `longRestAction` added to the character actions file
- **DB queries**: new queries in `src/db/queries/spells.ts` for slot read/write
- **UI**: `spells-section.tsx` gains a `SlotTracker` sub-component per level tab; section header gains a Long Rest button
- **Character sheet loader**: must load `character_spell_slots` rows and `spells_per_day` from progression table
