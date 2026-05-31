## Why

The `race_attributes`, `class_attributes`, and `theme_attributes` tables model description fields as data rather than app logic, duplicating the same humanoid field set across every biological race and leaving class/theme attribute tables entirely unused. Replacing this with a single `race_descriptions` table keyed by race type (humanoid vs android) eliminates the duplication and makes the humanoid/android distinction an explicit first-class concept in the schema.

## What Changes

- **BREAKING** Drop `race_attributes`, `class_attributes`, `theme_attributes`, and `character_race_attribute_values` tables
- Add `race_type` Postgres enum (`'humanoid' | 'android'`) and a `type` column to the `races` table
- Introduce `race_descriptions` table: one row per description field per race type (shared across all races of that type)
- Introduce `character_descriptions` table: stores a character's saved description values keyed by `description_id`
- App logic determines which description fields to display based on `race.type`; DB lookup is type-based, not race-based
- Race-change clearing logic improves: values are only wiped when crossing the humanoid ↔ android boundary, not on every race swap

## Capabilities

### New Capabilities
- `race-descriptions`: Reference data table defining description fields per race type (humanoid/android) and character storage of those values

### Modified Capabilities
- `character-race-attribute-values`: Replaced by `character-descriptions`; behavior changes — values now persist across same-type race swaps; only cleared on cross-type race change
- `crb-reference-data`: Race seed data gains a `type` column; `race_attributes` seed is removed
- `db-schema`: Schema removes three `*_attributes` tables and adds `race_descriptions` / `character_descriptions`

## Impact

- `src/db/schema.ts`: remove four tables/types, add two tables and enum
- `src/db/queries/reference.ts`: replace `getRaceAttributes` with `getDescriptionsForType`; remove unused class/theme attribute queries
- `src/db/queries/characters.ts`: replace three `*RaceAttributeValue*` functions with description equivalents
- `src/services/characters.ts`: update race-change clearing logic; rename `upsertRaceAttributeValueForOwner`
- `src/app/dashboard/characters/[id]/page.tsx`: description lookup via `race.type`
- `src/app/dashboard/characters/[id]/_components/description-section.tsx`: update prop type
- `src/app/dashboard/characters/[id]/actions.ts`: rename race attribute action
- Supabase migrations: drop old tables, create enum + new tables, seed reference data
