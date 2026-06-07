## ADDED Requirements

### Requirement: editions reference table
The system SHALL define an `editions` table in `src/db/schema.ts` with columns `id` (uuid PK, random default), `slug` (text, not null, unique), and `name` (text, not null). The table SHALL export inferred TypeScript types `Edition` and `NewEdition`.

#### Scenario: Types are exported and correctly shaped
- **WHEN** a developer uses `typeof editions.$inferSelect`
- **THEN** TypeScript resolves a shape with `id`, `slug`, and `name` fields

### Requirement: 1e seed row with fixed UUID
The `editions` table SHALL be seeded via migration with a single row representing Starfinder 1st Edition, using a hardcoded UUID so downstream backfill migrations can reference it without a subquery.

#### Scenario: 1e row is present after migration
- **WHEN** the migration runs on a fresh database
- **THEN** the `editions` table contains exactly one row with `slug = '1e'` and `name = 'Starfinder 1st Edition'`

#### Scenario: UUID is stable across environments
- **WHEN** the migration is applied to any environment (local, staging, production)
- **THEN** the 1e edition row has the same UUID in all environments

### Requirement: edition_id FK on characters and campaigns
The `characters` and `campaigns` tables SHALL each have a non-null `edition_id` UUID column that references `editions.id`. All existing rows SHALL be backfilled to the 1e UUID at migration time.

#### Scenario: All existing characters reference 1e after migration
- **WHEN** the migration runs against a database with pre-existing character rows
- **THEN** every character row has `edition_id` set to the 1e edition UUID

#### Scenario: All existing campaigns reference 1e after migration
- **WHEN** the migration runs against a database with pre-existing campaign rows
- **THEN** every campaign row has `edition_id` set to the 1e edition UUID

### Requirement: edition_id FK on reference tables
The `weapons`, `armor`, `skills`, `classes`, `themes`, `races`, `feats`, `spells`, `chassis`, `class_abilities`, `theme_abilities`, and `race_descriptions` tables SHALL each have a non-null `edition_id` UUID column referencing `editions.id`. All existing rows SHALL be backfilled to the 1e UUID at migration time.

#### Scenario: All reference rows carry edition after migration
- **WHEN** the migration runs against a seeded database
- **THEN** every row in every listed reference table has `edition_id` equal to the 1e edition UUID

### Requirement: Character sheet route branches on edition
The character sheet page at `src/app/dashboard/characters/[id]/page.tsx` SHALL inspect `character.edition.slug` and render the appropriate edition sheet. An unrecognised edition slug SHALL result in a `notFound()` response.

#### Scenario: 1e character renders the existing sheet
- **WHEN** a user navigates to the character sheet for a character with `edition.slug = '1e'`
- **THEN** the existing 1e character sheet is rendered

#### Scenario: Unknown edition returns 404
- **WHEN** a user navigates to the character sheet for a character with an unrecognised edition slug
- **THEN** a 404 Not Found response is returned
