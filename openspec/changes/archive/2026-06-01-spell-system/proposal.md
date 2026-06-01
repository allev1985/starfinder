## Why

Spellcasting characters (Mystic and Technomancer) have no way to manage their spells on the character sheet — the app currently has no spell reference data, no spell-to-class associations, and no character-level spell tracking. This is a core gap for two of the seven CRB classes.

## What Changes

- **New**: `spell_school` enum and `spells` reference table (CRB catalog, ~70 spells)
- **New**: `spell_class` junction table — which spells belong to which class at which spell level
- **New**: `character_spells` table — spells a character has learned
- **New**: `character_spell_slots` table — manual slot tracking (total + used) per spell level per character
- **Modified**: `classes` table gains `is_spellcaster boolean` — used to conditionally render the Spells section
- **New**: Spells section on the character sheet, shown only when `classes.is_spellcaster = true`
  - Spell level tabs (0–6)
  - Spell slot tracker per level (user-entered total, click-to-mark-used)
  - Known spells list per level with expandable detail cards
  - Add-spell dialog (searchable CRB catalog filtered to character's class)

## Capabilities

### New Capabilities

- `spell-reference-data`: `spells` and `spell_class` reference tables; `spell_school` enum; CRB seed data for all Mystic and Technomancer spells; `is_spellcaster` flag on `classes`
- `character-spells`: Character-level spell management — learning spells from the class catalog, spell slot tracking (total/used per level), and the Spells section UI on the character sheet

### Modified Capabilities

- `crb-reference-data`: Add `is_spellcaster` to classes seed data; add `spell_school` enum to the reference data surface
- `db-schema`: New tables (`spells`, `spell_class`, `character_spells`, `character_spell_slots`) and `classes.is_spellcaster` column

## Impact

- `src/db/schema.ts` — new tables and enum; `is_spellcaster` on classes
- `supabase/migrations/` — schema migration + CRB spell seed migrations
- `src/db/queries/spells.ts` — new query file for spell lookups and character spell mutations
- `src/app/dashboard/characters/[id]/_components/spells-section.tsx` — new component
- `src/app/dashboard/characters/[id]/page.tsx` — render spells section conditionally
