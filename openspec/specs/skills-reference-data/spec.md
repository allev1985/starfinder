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
