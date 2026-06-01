## ADDED Requirements

### Requirement: CRB class abilities seed migration
The system SHALL provide a migration that seeds `class_abilities` and `class_ability_options` for all 7 CRB classes with full descriptions sourced from the Starfinder CRB. The migration SHALL run after the `classes` seed migration.

#### Scenario: Migration runs without errors on a clean database
- **WHEN** the class abilities seed migration runs after the classes seed
- **THEN** no SQL errors occur and all rows are inserted

#### Scenario: Each class has at least one feature at level 1
- **WHEN** the migration completes
- **THEN** `SELECT COUNT(*) FROM class_abilities WHERE level = 1` returns 7 or more

### Requirement: CRB theme abilities seed migration
The system SHALL provide a migration that seeds `theme_abilities` for all 10 CRB themes with full descriptions sourced from the Starfinder CRB. The migration SHALL run after the `themes` seed migration.

#### Scenario: Migration runs without errors on a clean database
- **WHEN** the theme abilities seed migration runs
- **THEN** no SQL errors occur and all 10 themes have at least one row in `theme_abilities`

#### Scenario: Total row count is correct
- **WHEN** the migration completes
- **THEN** `SELECT COUNT(*) FROM theme_abilities` returns exactly 40 (10 themes × 4 levels)

### Requirement: CRB feats seed migration
The system SHALL provide a migration that seeds `feats` with all general and combat feats from the Starfinder CRB, including full descriptions, prerequisites text, and `is_combat_feat` flag.

#### Scenario: Migration runs without errors on a clean database
- **WHEN** the feats seed migration runs
- **THEN** no SQL errors occur and `SELECT COUNT(*) FROM feats WHERE source_book = 'crb'` returns at least 90

### Requirement: CRB weapon proficiency seed migration
The system SHALL provide a migration that seeds `class_weapon_proficiency` for all 7 CRB classes. The migration SHALL run after the `classes` seed migration.

#### Scenario: Migration runs without errors
- **WHEN** the weapon proficiency seed migration runs
- **THEN** no SQL errors occur and all 7 classes have at least one proficiency row
