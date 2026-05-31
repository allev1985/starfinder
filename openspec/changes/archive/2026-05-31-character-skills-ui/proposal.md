## Why

Characters have no way to track skills on their sheet — the reference data (skills, class_skills) is seeded but never surfaced to players. This change gives players the full skills workflow: selecting which skills belong to their character, allocating rank points, and seeing derived totals automatically.

## What Changes

- New `character_skills` table stores each skill a character has chosen, with `ranks`, `misc_mod`, and an optional `label` (used for Profession specializations)
- New `skill_ranks_per_level` integer column on `classes` (seeded with CRB values: Envoy 8, Mechanic 4, Mystic 6, Operative 8, Solarian 4, Soldier 4, Technomancer 4)
- Skills section added to the character sheet with empty state for new characters
- Owner can open an "Add Skills" dialog to multi-select skills from all 20 CRB skills; Profession supports multiple entries with freetext specialization labels in a single pass
- Each skill row shows: name (★ for class skill), governing ability, editable ranks, derived class bonus (+3 if class skill and ranks > 0), derived ability modifier, editable misc modifier, and computed total
- Ranks budget tracker in the section header: `X used / Y available` where available = `max(1, skillRanksPerLevel + INTmod) × level`
- Skills sorted alphabetically; ranks and misc mod save via debounced onChange (600ms)
- Owner can remove a skill row (deletes the `character_skills` record)

## Capabilities

### New Capabilities

- `character-skills`: Per-character skill assignments with ranks, misc mod, and derived totals; includes the Add Skills dialog, ranks budget display, and Profession multi-entry support

### Modified Capabilities

- `skills-reference-data`: `classes` table gains `skill_ranks_per_level` column; existing class rows are updated with CRB values

## Impact

- New Supabase migration: `character_skills` table + `classes.skill_ranks_per_level` column with seed update
- New DB queries in `src/db/queries/characters.ts` (get, upsert, delete character skills)
- New reference query: get all skills with class-skill flag for a given character
- New `skills-section.tsx` client component on the character page
- New `add-skills-dialog.tsx` client component (shadcn Dialog + Checkbox)
- Character page (`page.tsx`) loads character skills server-side and passes to the new section
- `src/db/schema.ts` updated with `characterSkills` table definition
