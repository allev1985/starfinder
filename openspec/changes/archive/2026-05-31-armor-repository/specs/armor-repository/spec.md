## ADDED Requirements

### Requirement: armor_type enum exists in the database
The database SHALL have an `armor_type` enum with exactly three values: `light`, `heavy`, and `powered`.

#### Scenario: Enum values are correct
- **WHEN** the migration runs on a fresh database
- **THEN** the `armor_type` enum contains exactly the values `light`, `heavy`, and `powered`

### Requirement: armor reference table schema
The system SHALL have an `armor` table with columns: `id` (uuid PK), `name` (text, not null), `type` (armor_type enum, not null), `item_level` (integer, not null), `price` (integer, not null), `eac_bonus` (integer, not null), `kac_bonus` (integer, not null), `max_dex_bonus` (integer, nullable — null means no cap), `armor_check_penalty` (integer, not null, 0 or negative), `speed_adjustment` (integer, not null, in feet — 0, -5, or -10), `bulk` (text, not null — "L", "—", or a numeral), `upgrade_slots` (integer, not null), `source_book` (text, not null).

#### Scenario: armor table columns are present after migration
- **WHEN** the armor DDL migration runs
- **THEN** the `armor` table exists with all specified columns and types

#### Scenario: max_dex_bonus nullable
- **WHEN** an armor row has no DEX cap (e.g., no armor or some light armor)
- **THEN** `max_dex_bonus` may be NULL and the application treats NULL as no cap

### Requirement: CRB light armor is seeded
The `armor` table SHALL be seeded with all CRB light armor pieces. Each row SHALL have `type = 'light'` and `source_book = 'crb'`. Stats (eac_bonus, kac_bonus, max_dex_bonus, armor_check_penalty, speed_adjustment, bulk, upgrade_slots) SHALL match the Archives of Nethys listings for Starfinder 1e CRB.

#### Scenario: Light armor rows exist after seed migration
- **WHEN** the CRB armor seed migration runs
- **THEN** the `armor` table contains at least 15 rows with `type = 'light'` and `source_book = 'crb'`

#### Scenario: Second Skin stats are correct
- **WHEN** the row for "Second Skin" is read from the `armor` table
- **THEN** `item_level = 1`, `eac_bonus = 1`, `kac_bonus = 2`, `max_dex_bonus = 5`, `armor_check_penalty = 0`, `speed_adjustment = 0`, `bulk = 'L'`, `upgrade_slots = 1`

### Requirement: CRB heavy armor is seeded
The `armor` table SHALL be seeded with all CRB heavy armor pieces. Each row SHALL have `type = 'heavy'` and `source_book = 'crb'`. Stats SHALL match the Archives of Nethys listings for Starfinder 1e CRB.

#### Scenario: Heavy armor rows exist after seed migration
- **WHEN** the CRB armor seed migration runs
- **THEN** the `armor` table contains at least 8 rows with `type = 'heavy'` and `source_book = 'crb'`

#### Scenario: Heavy armor has non-zero speed adjustment
- **WHEN** any heavy armor row is read
- **THEN** `speed_adjustment` is -5 (not 0)

### Requirement: CRB powered armor is seeded but inaccessible
The `armor` table SHALL be seeded with CRB powered armor pieces (`type = 'powered'`, `source_book = 'crb'`). No class SHALL have a `class_armor_proficiency` row for `armor_type = 'powered'`. Powered armor rows SHALL be present in the database but unreachable via the class-filtered armor picker until feat modeling is added.

#### Scenario: Powered armor rows exist after seed
- **WHEN** the CRB armor seed migration runs
- **THEN** the `armor` table contains at least 1 row with `type = 'powered'`

#### Scenario: No class is proficient with powered armor
- **WHEN** `class_armor_proficiency` is queried for any class
- **THEN** no row with `armor_type = 'powered'` is returned

### Requirement: class_armor_proficiency table schema
The system SHALL have a `class_armor_proficiency` table with columns: `class_id` (uuid, not null, FK → classes.id) and `armor_type` (armor_type enum, not null). The composite primary key SHALL be `(class_id, armor_type)`.

#### Scenario: Composite PK prevents duplicate entries
- **WHEN** an INSERT attempts to add a duplicate (class_id, armor_type) pair
- **THEN** the database rejects the insert with a primary key violation

### Requirement: CRB class armor proficiency is seeded
The `class_armor_proficiency` table SHALL be seeded with proficiency rows for all 7 CRB classes. Light-only classes (Envoy, Mechanic, Mystic, Operative, Technomancer) SHALL have one row each (`armor_type = 'light'`). Heavy-proficient classes (Solarian, Soldier) SHALL have two rows each (`armor_type = 'light'` and `armor_type = 'heavy'`).

#### Scenario: Envoy is proficient with light only
- **WHEN** `class_armor_proficiency` is queried for the Envoy class
- **THEN** exactly one row is returned with `armor_type = 'light'`

#### Scenario: Soldier is proficient with light and heavy
- **WHEN** `class_armor_proficiency` is queried for the Soldier class
- **THEN** exactly two rows are returned: one for `light` and one for `heavy`

#### Scenario: No class is proficient with powered
- **WHEN** `class_armor_proficiency` is queried with `armor_type = 'powered'`
- **THEN** zero rows are returned

### Requirement: Query function returns armor filtered by proficient types
The system SHALL expose a query function `getArmorForClass(classId: string): Promise<Armor[]>` that returns all `armor` rows whose `type` appears in `class_armor_proficiency` for the given class, ordered by `type` then `item_level` ascending.

#### Scenario: Returns light armor for light-only class
- **WHEN** `getArmorForClass` is called with an Envoy class ID
- **THEN** only rows with `type = 'light'` are returned, ordered by item_level

#### Scenario: Returns light and heavy for heavy-proficient class
- **WHEN** `getArmorForClass` is called with a Soldier class ID
- **THEN** rows with `type = 'light'` and `type = 'heavy'` are returned, no powered rows

#### Scenario: Returns empty array for null class
- **WHEN** `getArmorForClass` is called with a null or missing class ID
- **THEN** an empty array is returned
