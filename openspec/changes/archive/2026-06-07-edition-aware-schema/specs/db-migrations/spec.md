## ADDED Requirements

### Requirement: editions table and 1e seed migration
The system SHALL include a migration that creates the `editions` table and inserts the Starfinder 1e seed row using a hardcoded UUID.

#### Scenario: Migration creates editions table
- **WHEN** the migration is applied to a fresh database
- **THEN** the `editions` table exists with `id`, `slug`, and `name` columns

#### Scenario: 1e seed row is present after migration
- **WHEN** the migration is applied
- **THEN** a row with `slug = '1e'` and `name = 'Starfinder 1st Edition'` exists in `editions`

### Requirement: edition_id backfill migration
The system SHALL include a migration that adds `edition_id` as a nullable UUID FK column to all target tables, backfills existing rows with the hardcoded 1e UUID, and then alters the column to NOT NULL.

#### Scenario: All existing rows carry edition_id after migration
- **WHEN** the migration runs against a database with pre-existing rows in any target table
- **THEN** every row in every target table has `edition_id` equal to the 1e UUID and the column is NOT NULL

#### Scenario: Migration is safe to run on empty tables
- **WHEN** the migration runs against a database where target tables have no rows
- **THEN** the migration completes without error and `edition_id` is NOT NULL on the (empty) tables
