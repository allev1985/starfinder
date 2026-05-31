## MODIFIED Requirements

### Requirement: CRB races reference table
The system SHALL have a `races` table with columns `id` (uuid PK), `name` (text, not null), and `type` (race_type enum, not null). The table SHALL be seeded via migration with all 8 CRB races: Android (`type = 'android'`), Human, Kasatha, Lashunta (Damaya), Lashunta (Korasha), Shirren, Vesk, Ysoki (all `type = 'humanoid'`).

#### Scenario: All CRB races are present after migration
- **WHEN** the migration runs on a fresh database
- **THEN** the `races` table contains exactly 8 rows, one for each CRB race

#### Scenario: Android race has type android
- **WHEN** the Android row is read from the `races` table
- **THEN** its `type` field equals `'android'`

#### Scenario: All biological races have type humanoid
- **WHEN** all non-Android rows are read from the `races` table
- **THEN** every row has `type = 'humanoid'`

## REMOVED Requirements

### Requirement: race_attributes seed data
**Reason**: `race_attributes` table is dropped. Description field definitions now live in `race_descriptions`, keyed by race type rather than race ID.
**Migration**: Drop the `race_attributes` seed migration. Race description fields are re-seeded in the new `race_descriptions` migration.
