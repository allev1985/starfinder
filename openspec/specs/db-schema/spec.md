## Requirements

### Requirement: TypeScript schema file
The system SHALL provide a `src/db/schema.ts` file that defines all database tables using Drizzle ORM's schema builder (`pgTable`). The file SHALL be the single source of truth for the database schema. The placeholder table SHALL be replaced with real domain tables (`campaigns`, `characters`, `campaign_characters`).

#### Scenario: Schema file exists and exports
- **WHEN** the project is built
- **THEN** `src/db/schema.ts` SHALL exist and export the `campaigns`, `characters`, and `campaign_characters` table definitions

### Requirement: Schema is the source of truth for migrations
Any change to the database structure SHALL be made by editing `src/db/schema.ts` first, then running `npm run db:generate` to produce a SQL migration file.

#### Scenario: Schema change produces migration
- **WHEN** a developer adds or modifies a table in `src/db/schema.ts` and runs `npm run db:generate`
- **THEN** Drizzle Kit SHALL produce a new `.sql` file in `supabase/migrations/` reflecting the schema delta

### Requirement: Schema exports are typed
All table definitions in `src/db/schema.ts` SHALL produce inferred TypeScript types (select and insert) accessible via Drizzle's `$inferSelect` and `$inferInsert` helpers.

#### Scenario: Type inference works
- **WHEN** a developer uses `typeof myTable.$inferSelect`
- **THEN** TypeScript SHALL resolve the correct row shape without any manual type declarations

### Requirement: race_type enum in schema
The system SHALL declare the `race_type` Postgres enum in `src/db/schema.ts` using Drizzle's `pgEnum` helper and export it for use in query files.

#### Scenario: Enum is usable in query type parameters
- **WHEN** a developer writes a query filtered by `race_type`
- **THEN** TypeScript infers the value as `'biological' | 'android'`

### Requirement: raceDescriptions and characterDescriptions tables in schema
The system SHALL define `raceDescriptions` and `characterDescriptions` tables in `src/db/schema.ts` and export the corresponding inferred TypeScript types (`RaceDescription`, `CharacterDescription`).

#### Scenario: Schema exports are typed
- **WHEN** a developer uses `typeof raceDescriptions.$inferSelect`
- **THEN** TypeScript resolves the correct row shape including the `race_type` enum column

### Requirement: races table type column in schema
The system SHALL add a `type` column of type `race_type` (not null) to the `races` table definition in `src/db/schema.ts`.

#### Scenario: Race type is accessible on queried rows
- **WHEN** a race row is fetched via Drizzle
- **THEN** the `type` field is present and typed as `'biological' | 'android'`

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
