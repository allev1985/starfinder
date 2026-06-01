## ADDED Requirements

### Requirement: spell_school enum in schema
The system SHALL declare a `spell_school` Postgres enum in `src/db/schema.ts` using Drizzle's `pgEnum` helper and export it for use in query files. Values: `abjuration`, `conjuration`, `divination`, `enchantment`, `evocation`, `illusion`, `necromancy`, `transmutation`, `universal`.

#### Scenario: Enum is exported from schema
- **WHEN** a developer imports from `src/db/schema.ts`
- **THEN** the `spellSchoolEnum` export is available and typed as the union of all 9 values

### Requirement: spells, spell_class, character_spells, character_spell_slots tables in schema
The system SHALL define `spells`, `spell_class`, `character_spells`, and `character_spell_slots` tables in `src/db/schema.ts` using Drizzle's `pgTable` helper and export inferred TypeScript types for each.

#### Scenario: Schema exports are typed
- **WHEN** a developer uses `typeof spells.$inferSelect`
- **THEN** TypeScript resolves the correct row shape including the `spell_school` enum column for `school`

### Requirement: is_spellcaster column on classes table in schema
The system SHALL add an `is_spellcaster` column of type `boolean`, not null, default `false`, to the `classes` table definition in `src/db/schema.ts`.

#### Scenario: is_spellcaster is accessible on queried class rows
- **WHEN** a class row is fetched via Drizzle
- **THEN** the `isSpellcaster` field is present and typed as `boolean`
