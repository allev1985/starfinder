## REMOVED Requirements

### Requirement: race_attributes, class_attributes, theme_attributes tables
**Reason**: `race_attributes` is replaced by `race_descriptions`. `class_attributes` and `theme_attributes` were never seeded or consumed anywhere in the app.
**Migration**: Drop all three tables and their corresponding Drizzle schema definitions, exported types, and query functions.

### Requirement: character_race_attribute_values table in schema
**Reason**: Replaced by `character_descriptions`. See `character-race-attribute-values` spec.
**Migration**: Remove from `schema.ts` and `characters.ts` queries.

## ADDED Requirements

### Requirement: race_type enum in schema
The system SHALL declare the `race_type` Postgres enum in `src/db/schema.ts` using Drizzle's `pgEnum` helper and export it for use in query files.

#### Scenario: Enum is usable in query type parameters
- **WHEN** a developer writes a query filtered by `race_type`
- **THEN** TypeScript infers the value as `'humanoid' | 'android'`

### Requirement: raceDescriptions and characterDescriptions tables in schema
The system SHALL define `raceDescriptions` and `characterDescriptions` tables in `src/db/schema.ts` and export the corresponding inferred TypeScript types (`RaceDescription`, `CharacterDescription`).

#### Scenario: Schema exports are typed
- **WHEN** a developer uses `typeof raceDescriptions.$inferSelect`
- **THEN** TypeScript resolves the correct row shape including the `race_type` enum column

### Requirement: races table type column in schema
The system SHALL add a `type` column of type `race_type` (not null) to the `races` table definition in `src/db/schema.ts`.

#### Scenario: Race type is accessible on queried rows
- **WHEN** a race row is fetched via Drizzle
- **THEN** the `type` field is present and typed as `'humanoid' | 'android'`
