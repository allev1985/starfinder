## MODIFIED Requirements

### Requirement: CRB races reference table
The system SHALL have a `races` table with columns `id` (uuid PK), `name` (text, not null), `type` (race_type enum, not null), and `edition_id` (uuid, not null, references `editions.id`). The table SHALL be seeded via migration with all 8 CRB races: Android (`type = 'android'`), Human, Kasatha, Lashunta (Damaya), Lashunta (Korasha), Shirren, Vesk, Ysoki (all `type = 'biological'`). All seeded rows SHALL reference the Starfinder 1e edition UUID.

#### Scenario: All CRB races are present after migration
- **WHEN** the migration runs on a fresh database
- **THEN** the `races` table contains exactly 8 rows, one for each CRB race

#### Scenario: Android race has type android
- **WHEN** the Android row is read from the `races` table
- **THEN** its `type` field equals `'android'`

#### Scenario: All biological races have type biological
- **WHEN** all non-Android rows are read from the `races` table
- **THEN** every row has `type = 'biological'`

#### Scenario: All seeded races reference the 1e edition
- **WHEN** all rows are read from the `races` table after migration
- **THEN** every row has `edition_id` equal to the Starfinder 1e UUID

### Requirement: CRB classes reference table
The system SHALL have a `classes` table with columns `id` (uuid PK), `name` (text, not null), and `edition_id` (uuid, not null, references `editions.id`). The table SHALL be seeded via migration with all 7 CRB classes: Envoy, Mechanic, Mystic, Operative, Solarian, Soldier, Technomancer. All seeded rows SHALL reference the Starfinder 1e edition UUID.

#### Scenario: All CRB classes are present after migration
- **WHEN** the migration runs on a fresh database
- **THEN** the `classes` table contains exactly 7 rows, one for each CRB class

#### Scenario: All seeded classes reference the 1e edition
- **WHEN** all rows are read from the `classes` table after migration
- **THEN** every row has `edition_id` equal to the Starfinder 1e UUID

### Requirement: CRB themes reference table
The system SHALL have a `themes` table with columns `id` (uuid PK), `name` (text, not null), and `edition_id` (uuid, not null, references `editions.id`). The table SHALL be seeded via migration with all 10 CRB themes. All seeded rows SHALL reference the Starfinder 1e edition UUID.

#### Scenario: All CRB themes are present after migration
- **WHEN** the migration runs on a fresh database
- **THEN** the `themes` table contains exactly 10 rows, one for each CRB theme

#### Scenario: All seeded themes reference the 1e edition
- **WHEN** all rows are read from the `themes` table after migration
- **THEN** every row has `edition_id` equal to the Starfinder 1e UUID
