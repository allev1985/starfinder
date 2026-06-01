## ADDED Requirements

### Requirement: spell_school enum
The system SHALL declare a `spell_school` Postgres enum with values: `abjuration`, `conjuration`, `divination`, `enchantment`, `evocation`, `illusion`, `necromancy`, `transmutation`, `universal`. It SHALL be defined via `pgEnum` in `src/db/schema.ts` and exported for use in query files.

#### Scenario: Enum is usable in query type parameters
- **WHEN** a developer writes a query filtered by `school`
- **THEN** TypeScript infers the value as the union of all 9 school strings

### Requirement: spells reference table
The system SHALL have a `spells` table with columns: `id` (uuid PK), `name` (text, unique, not null), `school` (spell_school enum, not null), `casting_time` (text, not null), `range` (text, not null), `area` (text, nullable), `targets` (text, nullable), `duration` (text, not null), `saving_throw` (text, nullable), `spell_resist` (text, nullable), `description` (text, not null), `damage` (text, nullable), `damage_note` (text, nullable), `source` (text, not null, default `'CRB'`).

#### Scenario: spells table exists after migration
- **WHEN** the schema migration runs
- **THEN** the `spells` table exists with all required columns

#### Scenario: Spell name is unique
- **WHEN** two rows with the same `name` are inserted into `spells`
- **THEN** the second insert is rejected with a unique constraint violation

### Requirement: spell_class junction table
The system SHALL have a `spell_class` table with columns: `spell_id` (uuid, FK → spells.id), `class_id` (uuid, FK → classes.id), `spell_level` (integer, not null, 0–6). The primary key SHALL be `(spell_id, class_id)`.

#### Scenario: spell_class table exists after migration
- **WHEN** the schema migration runs
- **THEN** the `spell_class` table exists with `spell_id`, `class_id`, and `spell_level` columns

#### Scenario: Duplicate spell-class association rejected
- **WHEN** a `spell_class` row is inserted with a `(spell_id, class_id)` pair that already exists
- **THEN** the insert is rejected with a primary key violation

### Requirement: CRB Mystic spells seeded
The system SHALL seed all CRB Mystic spells (levels 0–6) into the `spells` table and create corresponding `spell_class` rows linking them to the Mystic class with the correct spell level.

#### Scenario: Mystic spells present after seed migration
- **WHEN** the Mystic spell seed migration runs
- **THEN** `SELECT COUNT(*) FROM spell_class WHERE class_id = '<mystic-id>'` returns a non-zero count covering all CRB Mystic spell levels 0–6

### Requirement: CRB Technomancer spells seeded
The system SHALL seed all CRB Technomancer spells (levels 0–6) into the `spells` table and create corresponding `spell_class` rows linking them to the Technomancer class with the correct spell level.

#### Scenario: Technomancer spells present after seed migration
- **WHEN** the Technomancer spell seed migration runs
- **THEN** `SELECT COUNT(*) FROM spell_class WHERE class_id = '<technomancer-id>'` returns a non-zero count covering all CRB Technomancer spell levels 0–6

### Requirement: Shared spells appear on both class lists
Spells that appear on both the Mystic and Technomancer spell lists SHALL have two rows in `spell_class` — one per class — pointing to the same `spell_id`.

#### Scenario: Shared spell has two spell_class rows
- **WHEN** a spell is on both the Mystic and Technomancer spell lists
- **THEN** `SELECT COUNT(*) FROM spell_class WHERE spell_id = '<shared-spell-id>'` returns 2
