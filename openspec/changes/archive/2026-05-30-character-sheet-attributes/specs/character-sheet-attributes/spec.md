## ADDED Requirements

### Requirement: Race attributes table
The system SHALL have a `race_attributes` table with columns `id` (uuid PK), `race_id` (uuid FK → races.id), `type` (text, not null), `name` (text, not null), `input_type` (text, not null, either `text` or `boolean`), `description` (text, nullable), and `sort_order` (integer, not null). The table SHALL be seeded with attributes for all 8 CRB races.

#### Scenario: Race attributes exist after migration
- **WHEN** the migration runs on a fresh database
- **THEN** the `race_attributes` table contains rows for all 8 CRB races covering their movement, senses, and racial traits

#### Scenario: Each attribute has a valid input_type
- **WHEN** any row from `race_attributes` is read
- **THEN** its `input_type` is either `text` or `boolean`

### Requirement: Class attributes table
The system SHALL have a `class_attributes` table with the same column shape as `race_attributes` but with `class_id` (uuid FK → classes.id) in place of `race_id`. The table SHALL be seeded with attributes for all 7 CRB classes covering proficiencies and class features.

#### Scenario: Class attributes exist after migration
- **WHEN** the migration runs on a fresh database
- **THEN** the `class_attributes` table contains rows for all 7 CRB classes

### Requirement: Theme attributes table
The system SHALL have a `theme_attributes` table with the same column shape as `race_attributes` but with `theme_id` (uuid FK → themes.id) in place of `race_id`. The table SHALL be seeded with attributes for all 10 CRB themes covering theme knowledge and theme features.

#### Scenario: Theme attributes exist after migration
- **WHEN** the migration runs on a fresh database
- **THEN** the `theme_attributes` table contains rows for all 10 CRB themes

### Requirement: Attribute query functions
The system SHALL provide query functions `getRaceAttributes(raceId)`, `getClassAttributes(classId)`, and `getThemeAttributes(themeId)` in `src/db/queries/reference.ts` that return the matching attributes ordered by `sort_order`.

#### Scenario: Attributes returned in sort order
- **WHEN** `getRaceAttributes` is called with a valid race ID
- **THEN** the returned attributes are ordered ascending by `sort_order`

#### Scenario: Empty array for unknown ID
- **WHEN** any attribute query function is called with an ID that has no matching attributes
- **THEN** an empty array is returned
