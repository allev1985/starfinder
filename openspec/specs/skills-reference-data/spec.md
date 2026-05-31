## ADDED Requirements

### Requirement: Skills reference table exists with correct properties
The system SHALL have a `skills` table containing all 20 Starfinder CRB skills. Each row SHALL record the skill name, the governing ability score, whether the skill is trained-only, and whether it carries an armor check penalty.

#### Scenario: All 20 CRB skills are present
- **WHEN** the `skills` table is queried
- **THEN** it SHALL return exactly 20 rows corresponding to: Acrobatics, Athletics, Bluff, Computers, Culture, Diplomacy, Disguise, Engineering, Intimidate, Life Science, Medicine, Mysticism, Perception, Physical Science, Piloting, Profession, Sense Motive, Sleight of Hand, Stealth, Survival

#### Scenario: Skill properties are correct
- **WHEN** any skill row is inspected
- **THEN** `ability` SHALL be one of STR, DEX, CON, INT, WIS, CHA; `trained_only` and `armor_check_penalty` SHALL be boolean values matching CRB rules

### Requirement: Class skills join table correctly maps skills to classes
The system SHALL have a `class_skills` table that records which skills are class skills for each of the 7 CRB classes. Each row SHALL reference a valid `skill_id` and `class_id` with FK constraints.

#### Scenario: Each class has the correct class skills
- **WHEN** `class_skills` is queried for a given class
- **THEN** it SHALL return only the skills designated as class skills for that class in the CRB

#### Scenario: Perception is a class skill for all 7 classes
- **WHEN** `class_skills` is queried for the Perception skill
- **THEN** it SHALL return 7 rows — one for each CRB class

#### Scenario: FK integrity is enforced
- **WHEN** a row is inserted into `class_skills` with an invalid `skill_id` or `class_id`
- **THEN** the database SHALL reject the insert with a foreign key violation

### Requirement: Classes table records skill ranks per level
The `classes` table SHALL have a `skill_ranks_per_level` integer column. Each of the 7 CRB classes SHALL have the correct base value seeded: Envoy 8, Mechanic 4, Mystic 6, Operative 8, Solarian 4, Soldier 4, Technomancer 4.

#### Scenario: All 7 classes have a non-null skill_ranks_per_level value
- **WHEN** the `classes` table is queried
- **THEN** every row SHALL have a `skill_ranks_per_level` value that is a positive integer

#### Scenario: CRB values are correct
- **WHEN** the `classes` table is queried for Operative
- **THEN** `skill_ranks_per_level` SHALL equal 8

#### Scenario: CRB values are correct for Soldier
- **WHEN** the `classes` table is queried for Soldier
- **THEN** `skill_ranks_per_level` SHALL equal 4
