## 1. Database Migration

- [x] 1.1 Write migration to drop `character_race_attribute_values`, `race_attributes`, `class_attributes`, and `theme_attributes` tables
- [x] 1.2 Write migration to create `race_type` Postgres enum (`'humanoid'`, `'android'`)
- [x] 1.3 Write migration to add `type race_type NOT NULL` column to `races` table with correct values for all 8 CRB races
- [x] 1.4 Write migration to create `race_descriptions` table (`id`, `race_type`, `name`, `sort_order`)
- [x] 1.5 Write migration to create `character_descriptions` table (`character_id`, `description_id`, `value`) with composite PK and cascade FKs
- [x] 1.6 Write migration to seed `race_descriptions` with 7 humanoid fields and 5 android fields
- [x] 1.7 Apply all migrations and verify schema in Supabase

## 2. Drizzle Schema

- [x] 2.1 Remove `raceAttributes`, `classAttributes`, `themeAttributes`, `characterRaceAttributeValues` tables and their exported types from `src/db/schema.ts`
- [x] 2.2 Add `pgEnum('race_type', ['humanoid', 'android'])` and export it from `src/db/schema.ts`
- [x] 2.3 Add `type` column (`raceType` enum, not null) to the `races` table definition
- [x] 2.4 Add `raceDescriptions` table definition and export `RaceDescription` type
- [x] 2.5 Add `characterDescriptions` table definition and export `CharacterDescription` type

## 3. Query Layer

- [x] 3.1 Remove `getRaceAttributes`, `getClassAttributes`, `getThemeAttributes` from `src/db/queries/reference.ts` and their imports
- [x] 3.2 Add `getDescriptionsForType(raceType: 'humanoid' | 'android')` to `src/db/queries/reference.ts`
- [x] 3.3 Remove `getCharacterRaceAttributeValues`, `deleteCharacterRaceAttributeValues`, `upsertCharacterRaceAttributeValue` from `src/db/queries/characters.ts`
- [x] 3.4 Add `getCharacterDescriptionValues(characterId)`, `deleteCharacterDescriptionValues(characterId)`, and `upsertCharacterDescriptionValue(characterId, descriptionId, value)` to `src/db/queries/characters.ts`

## 4. Service Layer

- [x] 4.1 Remove `upsertRaceAttributeValueForOwner` from `src/services/characters.ts`; add `upsertDescriptionValueForOwner(characterId, userId, descriptionId, value)`
- [x] 4.2 Update `updateCharacterForOwner` in `src/services/characters.ts` to clear `character_descriptions` only when the race type changes (fetch old and new race types, compare before deciding to wipe)

## 5. UI and Server Actions

- [x] 5.1 Rename `upsertRaceAttributeValueAction` to `upsertDescriptionValueAction` in `src/app/dashboard/characters/[id]/actions.ts`; update its import and parameter name (`descriptionId` instead of `attributeId`)
- [x] 5.2 Update `src/app/dashboard/characters/[id]/page.tsx` to fetch descriptions via `race.type` using `getDescriptionsForType` instead of `getRaceAttributes(raceId)`; replace `getCharacterRaceAttributeValues` with `getCharacterDescriptionValues`
- [x] 5.3 Update `src/app/dashboard/characters/[id]/_components/description-section.tsx` prop type from `RaceAttribute[]` to `RaceDescription[]`; update action call to `upsertDescriptionValueAction` with `descriptionId`

## 6. Verification

- [x] 6.1 Run `npm run lint` and `npx tsc --noEmit` — zero errors
- [ ] 6.2 Manually verify on a character with a humanoid race: description fields display and save correctly
- [ ] 6.3 Manually verify on a character with Android race: android-specific fields display and save correctly
- [ ] 6.4 Manually verify race swap Human → Kasatha preserves saved description values
- [ ] 6.5 Manually verify race swap Human → Android clears saved description values
