## ADDED Requirements

### Requirement: Skill Unit selection required at drone creation
The new character form SHALL require the owner to choose a Skill Unit skill when creating a drone character. The Skill Unit selector SHALL list the drone allowed skills minus any skill already provided by the selected chassis bonus (to avoid confusion about duplicates).

#### Scenario: Skill Unit selector shown for drone
- **WHEN** the user selects a drone race on the new character form
- **THEN** a Skill Unit selector is shown listing the drone allowed skills

#### Scenario: Chassis bonus skill excluded from Skill Unit options
- **WHEN** the user selects the Hover chassis (bonus skill: Acrobatics)
- **THEN** Acrobatics does not appear in the Skill Unit selector

#### Scenario: Submitting drone without Skill Unit is rejected
- **WHEN** the user submits the new character form as a drone without selecting a Skill Unit
- **THEN** no character is created and an inline error is shown on the Skill Unit field

### Requirement: Drone creation seeds only Skill Unit and chassis bonus skill
When a drone character is created, `character_skills` SHALL contain exactly the Skill Unit skill plus the chassis bonus skill (if the chassis has one). All other drone allowed skills SHALL NOT be seeded.

#### Scenario: Combat chassis seeds one skill
- **WHEN** a drone is created with the Combat chassis and Perception as the Skill Unit
- **THEN** `character_skills` contains exactly one row: Perception

#### Scenario: Hover chassis seeds two skills
- **WHEN** a drone is created with the Hover chassis and Athletics as the Skill Unit
- **THEN** `character_skills` contains exactly two rows: Athletics and Acrobatics

#### Scenario: Hover chassis with Acrobatics as Skill Unit seeds one skill
- **WHEN** a drone is created with the Hover chassis and the chassis bonus skill would duplicate the Skill Unit
- **THEN** this combination is prevented by the Skill Unit selector (Acrobatics excluded from options)

### Requirement: Owner can add skills from the drone allowed list post-creation
The drone skills section SHALL provide an "Add Skill" button that opens a dialog filtered to the drone allowed skill list. Skills already present on the drone SHALL be pre-checked. The owner can add skills to represent mod grants.

#### Scenario: Add skill dialog shows only drone allowed skills
- **WHEN** the owner of a drone character opens the Add Skill dialog
- **THEN** only the 6 drone allowed skills are listed (Acrobatics, Athletics, Computers, Perception, Stealth, Survival)

#### Scenario: Already-present skills are pre-checked
- **WHEN** the owner opens the Add Skill dialog
- **THEN** skills already in the drone's `character_skills` are shown pre-checked

#### Scenario: Owner can add a mod-granted skill
- **WHEN** the owner checks an additional skill and saves
- **THEN** a new `character_skills` row is inserted for that skill with `ranks = 0` and `misc_mod = 0`
