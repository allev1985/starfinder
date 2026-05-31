## ADDED Requirements

### Requirement: equipment_category enum
The database SHALL have an `equipment_category` Postgres enum with values: `augmentation_cybernetic`, `augmentation_biotech`, `personal_upgrade`, `ammunition`.

#### Scenario: Invalid category is rejected
- **WHEN** an INSERT into `equipment` uses a value not in the enum
- **THEN** the database rejects the insert with a constraint violation

### Requirement: augmentation_system enum
The database SHALL have an `augmentation_system` Postgres enum with values: `brain`, `eyes`, `ears`, `throat`, `arm`, `hand`, `lungs`, `spinal_column`, `feet`, `skin`.

#### Scenario: Invalid system is rejected
- **WHEN** an INSERT into `equipment` sets `system` to a value not in the enum
- **THEN** the database rejects the insert with a constraint violation

### Requirement: equipment reference table schema
The system SHALL have an `equipment` table with the following columns:
- `id` — uuid, primary key, default random
- `name` — text, not null
- `category` — `equipment_category` enum, not null
- `item_level` — integer, not null
- `price` — integer, not null
- `bulk` — text, not null (e.g., `"L"`, `"—"`, `"1"`)
- `system` — `augmentation_system` enum, nullable — set only for augmentations
- `ammo_type` — text, nullable — set only for ammunition (matches `weapons.ammo_type` values)
- `ammo_capacity` — integer, nullable — charge or unit count for battery/petrochem variants (e.g., 20, 40, 80, 100)
- `bonus_hint` — text, nullable — human-readable instruction for manual application (e.g., `"Apply +2 to STR score (Ability Scores section)"`)
- `source_book` — text, not null, default `"crb"`

#### Scenario: Schema is created by migration
- **WHEN** the schema migration runs
- **THEN** the `equipment` table exists with all columns and both enums exist

#### Scenario: Ammunition row has ammo_type and ammo_capacity, null system
- **WHEN** a battery row is inserted with ammo_type `'battery'`, ammo_capacity `20`, and null system
- **THEN** the insert succeeds and columns read back correctly

#### Scenario: Augmentation row has system set, null ammo_type
- **WHEN** a cybernetic augmentation is inserted with a system value and null ammo_type
- **THEN** the insert succeeds and columns read back correctly

### Requirement: CRB cybernetic augmentations seeded
The system SHALL seed all CRB cybernetic augmentations via a SQL migration. Each row SHALL include accurate `item_level`, `price`, `bulk`, `system`, and `bonus_hint` where the augmentation grants a mechanical bonus. Stats SHALL be sourced from Archives of Nethys (aonprd.com).

#### Scenario: Cybernetic augmentation seed populates the table
- **WHEN** the cybernetic augmentation seed migration runs
- **THEN** the `equipment` table contains rows with `category = 'augmentation_cybernetic'` covering all major body systems (brain, eyes, ears, throat, arm, spinal column, skin)

#### Scenario: Bonus-granting augmentation has bonus_hint set
- **WHEN** a Synaptic Accelerator row is queried
- **THEN** `bonus_hint` is not null and contains actionable text referencing which stat to update

#### Scenario: Non-bonus augmentation has null bonus_hint
- **WHEN** an augmentation that grants no modifier bonus (e.g., a cosmetic or utility augment) is queried
- **THEN** `bonus_hint` is null

### Requirement: CRB biotech augmentations seeded
The system SHALL seed all CRB biotech augmentations via a SQL migration, following the same rules as cybernetic augmentations.

#### Scenario: Biotech augmentation seed populates the table
- **WHEN** the biotech augmentation seed migration runs
- **THEN** the `equipment` table contains rows with `category = 'augmentation_biotech'`

### Requirement: Personal Upgrades seeded
The system SHALL seed Personal Upgrade Mk 1, Mk 2, and Mk 3 as equipment rows with `category = 'personal_upgrade'`. Each SHALL have a `bonus_hint` instructing the player to apply the ability score bonus manually.

#### Scenario: All three personal upgrade tiers are seeded
- **WHEN** the personal upgrade seed migration runs
- **THEN** the `equipment` table contains exactly 3 rows with `category = 'personal_upgrade'` at item levels 1, 5, and 11

#### Scenario: Each personal upgrade has a bonus_hint
- **WHEN** a Personal Upgrade Mk 1 row is queried
- **THEN** `bonus_hint` is not null and indicates a +2 ability score increase

### Requirement: CRB ammunition seeded
The system SHALL seed all CRB ammunition types via a SQL migration. Seeded types SHALL include: batteries (20, 40, 80, 100 charge variants), petrochem fuel (20 and 40 unit variants), small arm rounds, longarm rounds, heavy rounds, sniper rounds, shells, darts, and missiles. Each row SHALL have `ammo_type` set and `bonus_hint` null.

#### Scenario: Ammunition seed populates the table
- **WHEN** the ammunition seed migration runs
- **THEN** the `equipment` table contains rows with `category = 'ammunition'` covering all listed ammo types

#### Scenario: Battery variants have correct ammo_capacity
- **WHEN** the four battery rows are queried
- **THEN** `ammo_capacity` values are 20, 40, 80, and 100 respectively

#### Scenario: All ammunition rows have null bonus_hint
- **WHEN** any ammunition row is queried
- **THEN** `bonus_hint` is null
