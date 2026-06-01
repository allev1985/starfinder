## Requirements

### Requirement: class_abilities table exists and is seeded
The system SHALL provide a `class_abilities` table with columns: `id` (uuid PK), `class_id` (uuid FK → `classes.id`), `name` (text, not null), `description` (text, not null), `level` (integer, not null — the character level at which the feature is gained), `repeatable` (boolean, not null, default false — true when the same feature is gained multiple times across levels), `choice_pool` (text, nullable — pool identifier for choice-based features, e.g. `"fighting_style"`, `"improvisation"`), `source_book` (text, not null, default `'crb'`). The table SHALL be seeded with all class features for all 7 CRB classes.

#### Scenario: All 7 CRB classes have seeded class abilities
- **WHEN** the seed migration runs
- **THEN** each of the 7 CRB classes has at least one row in `class_abilities`

#### Scenario: Level 1 features are present for every class
- **WHEN** the seed migration runs
- **THEN** every CRB class has at least one `class_abilities` row with `level = 1`

#### Scenario: Repeatable features are flagged correctly
- **WHEN** the seed migration runs
- **THEN** Envoy's "Improvisation" row has `repeatable = true`

#### Scenario: Choice features have a non-null choice_pool
- **WHEN** the seed migration runs
- **THEN** Soldier's "Fighting Style" row has `choice_pool = 'fighting_style'` and `repeatable = false`

#### Scenario: Deterministic features have null choice_pool
- **WHEN** the seed migration runs
- **THEN** Operative's "Trick Attack" row has `choice_pool = NULL`

### Requirement: class_ability_options table exists and is seeded
The system SHALL provide a `class_ability_options` table with columns: `id` (uuid PK), `class_id` (uuid FK → `classes.id`), `pool_name` (text, not null — matches `class_abilities.choice_pool`), `name` (text, not null), `description` (text, not null), `prerequisites` (text, nullable), `source_book` (text, not null, default `'crb'`). The table SHALL be seeded with all selectable sub-options for every choice-pool defined in `class_abilities`.

#### Scenario: Fighting style options are present for Soldier
- **WHEN** the seed migration runs
- **THEN** `class_ability_options` contains rows with `class_id = <Soldier id>` and `pool_name = 'fighting_style'` covering all CRB fighting styles (Arcane Assailant, Blitz, Bombard, Guard, Hit-and-Run, Sharpshoot, Teamwork)

#### Scenario: Improvisation options are present for Envoy
- **WHEN** the seed migration runs
- **THEN** `class_ability_options` contains rows with `class_id = <Envoy id>` and `pool_name = 'improvisation'` covering all CRB improvisation options

#### Scenario: Connection options are present for Mystic
- **WHEN** the seed migration runs
- **THEN** `class_ability_options` contains rows with `class_id = <Mystic id>` and `pool_name = 'connection'` covering all CRB connections (Akashic, Empath, Healer, Mindbreaker, Overlord, Star Shaman, Xenodruid)

### Requirement: Reference query for class abilities by class
The system SHALL expose a server-side query `getClassAbilities(classId: string): Promise<ClassAbility[]>` that returns all abilities for the given class ordered by `level` ascending.

#### Scenario: Query returns ordered results
- **WHEN** `getClassAbilities` is called with a valid class ID
- **THEN** results are returned ordered by `level` ascending, with ties broken by `name`

#### Scenario: Query returns empty array for unknown class
- **WHEN** `getClassAbilities` is called with an ID that does not exist in `classes`
- **THEN** an empty array is returned

### Requirement: Reference query for class ability options by pool
The system SHALL expose a server-side query `getClassAbilityOptions(classId: string, poolName: string): Promise<ClassAbilityOption[]>` that returns all options for the given class and pool.

#### Scenario: Query returns all options for a valid pool
- **WHEN** `getClassAbilityOptions` is called with Soldier's class ID and `'fighting_style'`
- **THEN** all 7 CRB fighting style options are returned
