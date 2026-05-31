## ADDED Requirements

### Requirement: CRB races reference table
The system SHALL have a `races` table with columns `id` (uuid PK), `name` (text, not null), and `type` (race_type enum, not null). The table SHALL be seeded via migration with all 8 CRB races: Android (`type = 'android'`), Human, Kasatha, Lashunta (Damaya), Lashunta (Korasha), Shirren, Vesk, Ysoki (all `type = 'biological'`).

#### Scenario: All CRB races are present after migration
- **WHEN** the migration runs on a fresh database
- **THEN** the `races` table contains exactly 8 rows, one for each CRB race

#### Scenario: Android race has type android
- **WHEN** the Android row is read from the `races` table
- **THEN** its `type` field equals `'android'`

#### Scenario: All biological races have type biological
- **WHEN** all non-Android rows are read from the `races` table
- **THEN** every row has `type = 'biological'`

### Requirement: CRB classes reference table
The system SHALL have a `classes` table with columns `id` (uuid PK), `name` (text, not null), and `source` (text, not null, default `'CRB'`). The table SHALL be seeded via migration with all 7 CRB classes: Envoy, Mechanic, Mystic, Operative, Solarian, Soldier, Technomancer.

#### Scenario: All CRB classes are present after migration
- **WHEN** the migration runs on a fresh database
- **THEN** the `classes` table contains exactly 7 rows, one for each CRB class

### Requirement: CRB themes reference table
The system SHALL have a `themes` table with columns `id` (uuid PK), `name` (text, not null), and `source` (text, not null, default `'CRB'`). The table SHALL be seeded via migration with all 10 CRB themes: Ace Pilot, Bounty Hunter, Icon, Mercenary, Outlaw, Priest, Scholar, Spacefarer, Street Rat, Themeless.

#### Scenario: All CRB themes are present after migration
- **WHEN** the migration runs on a fresh database
- **THEN** the `themes` table contains exactly 10 rows, one for each CRB theme

### Requirement: Characters table FK columns
The `characters` table SHALL have three new nullable UUID FK columns: `race_id` referencing `races.id`, `class_id` referencing `classes.id`, and `theme_id` referencing `themes.id`.

#### Scenario: Existing characters are unaffected by migration
- **WHEN** the migration adds the FK columns to an existing `characters` table with rows
- **THEN** existing character rows have `null` for `race_id`, `class_id`, and `theme_id`

#### Scenario: New character can reference valid race, class, theme
- **WHEN** a new character row is inserted with valid `race_id`, `class_id`, and `theme_id` values
- **THEN** the row is stored successfully and the FKs resolve to their reference rows
