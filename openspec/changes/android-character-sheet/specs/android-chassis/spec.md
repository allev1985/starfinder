## ADDED Requirements

### Requirement: Chassis reference table
The system SHALL have a `chassis` table with columns `id` (uuid PK), `name` (text, not null), `bonus_skill_id` (uuid, nullable, FK → `skills.id`), `default_str`, `default_dex`, `default_int`, `default_wis`, `default_cha` (all integer, not null). The table SHALL be seeded via migration with three rows matching Starfinder 1e CRB chassis defaults.

#### Scenario: All three chassis rows present after migration
- **WHEN** the migration runs on a fresh database
- **THEN** the `chassis` table contains exactly 3 rows: Combat, Hover, and Stealth

#### Scenario: Combat chassis has correct defaults
- **WHEN** the Combat chassis row is read
- **THEN** STR=14, DEX=12, INT=6, WIS=10, CHA=6 and `bonus_skill_id` is null

#### Scenario: Hover chassis has correct defaults
- **WHEN** the Hover chassis row is read
- **THEN** STR=6, DEX=16, INT=6, WIS=8, CHA=6 and `bonus_skill_id` references the Acrobatics skill

#### Scenario: Stealth chassis has correct defaults
- **WHEN** the Stealth chassis row is read
- **THEN** STR=12, DEX=14, INT=6, WIS=10, CHA=6 and `bonus_skill_id` references the Stealth skill

### Requirement: Chassis required for android character creation
The character creation form SHALL require chassis selection when the selected race has `type = 'android'`. The form SHALL not show the chassis selector for biological races.

#### Scenario: Android race shows chassis selector
- **WHEN** the user selects a race with `type = 'android'` on the new character form
- **THEN** a chassis selector (Combat / Hover / Stealth) SHALL appear and be required before submission

#### Scenario: Biological race hides chassis selector
- **WHEN** the user selects a race with `type = 'biological'` on the new character form
- **THEN** no chassis selector is shown

#### Scenario: Submitting android without chassis is rejected
- **WHEN** the user submits the new character form with an android race but no chassis selected
- **THEN** no character is created and an inline error is shown on the chassis field

### Requirement: Chassis ability scores applied at android creation
When an android character is created, the character's ability scores SHALL be initialized to the selected chassis defaults.

#### Scenario: Combat chassis ability scores applied
- **WHEN** a character is created with the Combat chassis
- **THEN** the character's `str_score`=14, `dex_score`=12, `int_score`=6, `wis_score`=10, `cha_score`=6

#### Scenario: Hover chassis ability scores applied
- **WHEN** a character is created with the Hover chassis
- **THEN** the character's `str_score`=6, `dex_score`=16, `int_score`=6, `wis_score`=8, `cha_score`=6

#### Scenario: Stealth chassis ability scores applied
- **WHEN** a character is created with the Stealth chassis
- **THEN** the character's `str_score`=12, `dex_score`=14, `int_score`=6, `wis_score`=10, `cha_score`=6

### Requirement: Chassis bonus skill seeded at android creation
When an android character is created, the character's `character_skills` SHALL be seeded with the 6 android skills plus the chassis bonus skill (if the chassis has one). Ranks for all seeded android skills SHALL be set to 0.

#### Scenario: Hover chassis seeds Acrobatics as bonus skill
- **WHEN** a character is created with the Hover chassis
- **THEN** Acrobatics appears exactly once in the character's `character_skills` (not duplicated even though it is also on the standard android skill list)

#### Scenario: Combat chassis seeds no bonus skill
- **WHEN** a character is created with the Combat chassis
- **THEN** the character's `character_skills` contains exactly 6 rows (the standard android skill list only)

#### Scenario: Stealth chassis seeds Stealth as bonus skill
- **WHEN** a character is created with the Stealth chassis
- **THEN** Stealth appears exactly once in the character's `character_skills`

### Requirement: Chassis displayed on android character sheet
The character detail page SHALL display the android's chassis name.

#### Scenario: Chassis name shown
- **WHEN** an android character detail page loads
- **THEN** the chassis name (e.g. "Combat", "Hover", "Stealth") is displayed in the character description area
