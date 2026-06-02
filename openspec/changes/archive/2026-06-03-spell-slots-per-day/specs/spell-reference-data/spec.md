## ADDED Requirements

### Requirement: class_spell_progression includes spells_per_day
The `class_spell_progression` table SHALL have a `spells_per_day` column (integer, not null, default 0) representing the number of spell slots available at that character level and spell level per the class rulebook table.

#### Scenario: spells_per_day column exists after migration
- **WHEN** the schema migration runs
- **THEN** `class_spell_progression` has a `spells_per_day` integer column with default 0

### Requirement: CRB Mystic spells_per_day seeded
The seed migration SHALL populate `spells_per_day` for all Mystic rows in `class_spell_progression` matching the CRB Mystic spell progression table (character levels 1–20, spell levels 1–6).

#### Scenario: Mystic level 1 spells_per_day correct
- **WHEN** the seed migration runs
- **THEN** the Mystic row for character_level = 1, spell_level = 1 has spells_per_day = 3

#### Scenario: Mystic spells_per_day non-zero for all unlocked levels
- **WHEN** the seed migration runs
- **THEN** every `class_spell_progression` row for Mystic where the class gains that spell level has `spells_per_day` > 0

### Requirement: CRB Technomancer spells_per_day seeded
The seed migration SHALL populate `spells_per_day` for all Technomancer rows in `class_spell_progression` matching the CRB Technomancer spell progression table (character levels 1–20, spell levels 1–6).

#### Scenario: Technomancer level 1 spells_per_day correct
- **WHEN** the seed migration runs
- **THEN** the Technomancer row for character_level = 1, spell_level = 1 has spells_per_day = 3

#### Scenario: Technomancer spells_per_day non-zero for all unlocked levels
- **WHEN** the seed migration runs
- **THEN** every `class_spell_progression` row for Technomancer where the class gains that spell level has `spells_per_day` > 0
