## ADDED Requirements

### Requirement: editions table in schema
The system SHALL define an `editions` table in `src/db/schema.ts` using Drizzle's `pgTable` helper with columns `id` (uuid PK), `slug` (text, not null, unique), and `name` (text, not null). The file SHALL export inferred TypeScript types `Edition` and `NewEdition`.

#### Scenario: editions table is exported and typed
- **WHEN** a developer uses `typeof editions.$inferSelect`
- **THEN** TypeScript resolves a shape with `id`, `slug`, and `name` fields

### Requirement: edition_id column on characters and campaigns tables
The `characters` and `campaigns` table definitions in `src/db/schema.ts` SHALL each include an `editionId` column typed as `uuid`, not null, referencing `editions.id`.

#### Scenario: edition_id is present on character rows
- **WHEN** a character row is fetched via Drizzle
- **THEN** the `editionId` field is present and typed as `string` (UUID)

#### Scenario: edition_id is present on campaign rows
- **WHEN** a campaign row is fetched via Drizzle
- **THEN** the `editionId` field is present and typed as `string` (UUID)

### Requirement: edition_id column on reference tables
The `weapons`, `armor`, `skills`, `classes`, `themes`, `races`, `feats`, `spells`, `chassis`, `classAbilities`, `themeAbilities`, and `raceDescriptions` table definitions in `src/db/schema.ts` SHALL each include an `editionId` column typed as `uuid`, not null, referencing `editions.id`.

#### Scenario: edition_id is present on all reference table rows
- **WHEN** any row from a listed reference table is fetched via Drizzle
- **THEN** the `editionId` field is present and typed as `string` (UUID)
