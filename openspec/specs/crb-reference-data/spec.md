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

### Requirement: armor table is part of the CRB reference dataset
The `armor` table SHALL be treated as CRB reference data alongside `races`, `classes`, `themes`, and `skills`. All CRB armor rows SHALL have `source_book = 'crb'`. The table SHALL be populated via a dedicated seed migration, not application code.

#### Scenario: armor rows are present after seed migration
- **WHEN** the CRB armor seed migration runs
- **THEN** `SELECT COUNT(*) FROM armor WHERE source_book = 'crb'` returns a non-zero count

### Requirement: class_armor_proficiency table is part of the CRB reference dataset
The `class_armor_proficiency` table SHALL be treated as CRB reference data. Its rows SHALL be populated via a dedicated seed migration that runs after both the `classes` table seed and the `armor_type` enum exist.

#### Scenario: class_armor_proficiency rows are present after seed migration
- **WHEN** the class proficiency seed migration runs
- **THEN** `SELECT COUNT(*) FROM class_armor_proficiency` returns 9 (5 light-only classes × 1 + 2 heavy-proficient classes × 2 = 9 rows)

### Requirement: is_spellcaster flag on classes
The `classes` table SHALL have an `is_spellcaster` column of type `boolean`, not null, defaulting to `false`. A migration SHALL set `is_spellcaster = true` for Mystic and Technomancer; all other CRB classes SHALL remain `false`.

#### Scenario: Mystic is marked as spellcaster
- **WHEN** the migration runs
- **THEN** the Mystic row in `classes` has `is_spellcaster = true`

#### Scenario: Technomancer is marked as spellcaster
- **WHEN** the migration runs
- **THEN** the Technomancer row in `classes` has `is_spellcaster = true`

#### Scenario: Non-spellcasting classes are false
- **WHEN** the migration runs
- **THEN** Envoy, Mechanic, Operative, Solarian, and Soldier all have `is_spellcaster = false`
