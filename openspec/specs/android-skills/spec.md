## ADDED Requirements

### Requirement: Drone characters are seeded with Skill Unit and chassis bonus at creation
When a drone character is created, `character_skills` SHALL be seeded with only the chosen Skill Unit skill and the chassis bonus skill (if any). All seeded rows SHALL have `ranks = 0` and `misc_mod = 0`. Biological characters SHALL continue to receive no seeded skills at creation.

#### Scenario: Drone creation seeds Skill Unit and chassis bonus only
- **WHEN** a drone character is created with the Combat chassis and Stealth as the Skill Unit
- **THEN** the character has exactly one `character_skills` row: Stealth

#### Scenario: Hover chassis seeds two skills
- **WHEN** a drone character is created with the Hover chassis and Athletics as the Skill Unit
- **THEN** the character has exactly two `character_skills` rows: Athletics and Acrobatics

#### Scenario: Biological creation seeds no skills
- **WHEN** a biological character is created
- **THEN** no `character_skills` rows are inserted at creation

### Requirement: Drone skills section shows the drone's skill list with an add control
The skills section for drone characters SHALL render only the drone's seeded skills. The section SHALL show an "Add Skill" button that opens a dialog filtered to the drone allowed skill list. The owner can add skills to represent mod grants. Per-row remove controls SHALL be shown to allow Skill Unit changes.

#### Scenario: Add skill button shown for drone owner
- **WHEN** the owner of a drone character views the Skills section
- **THEN** an "Add Skill" button is rendered

#### Scenario: Add skill dialog is filtered to drone allowed list
- **WHEN** the owner opens the Add Skill dialog for a drone
- **THEN** only drone allowed skills are shown (Acrobatics, Athletics, Computers, Perception, Stealth, Survival)

#### Scenario: Remove control shown for drone skill rows
- **WHEN** the owner of a drone character views a skill row
- **THEN** a remove/delete control is rendered, allowing Skill Unit changes

#### Scenario: Biological character still shows add button
- **WHEN** the owner of a biological character views the Skills section
- **THEN** the "Add Skills" button is rendered as before

### Requirement: Drone skill ranks are derived from mechanic level and displayed read-only
The drone skills section SHALL display ranks as a read-only value equal to the linked mechanic's current level. The ranks input SHALL not be editable for drone characters.

#### Scenario: Ranks column is read-only for drone
- **WHEN** the owner views a drone character's skill row
- **THEN** the ranks value is displayed as static text, not as an editable input

#### Scenario: Ranks value equals mechanic level
- **WHEN** the linked mechanic is level 4
- **THEN** every drone skill row displays ranks = 4

#### Scenario: Ranks display dash with no mechanic linked
- **WHEN** no mechanic is linked to the drone
- **THEN** every drone skill row displays "—" in the ranks column

### Requirement: Drone skill misc_mod remains editable
The drone skill misc_mod field SHALL remain an editable number input, persisted via debounced save (600 ms).

#### Scenario: Owner can edit misc_mod on drone skill
- **WHEN** the owner changes the misc_mod for a drone skill and 600 ms elapse
- **THEN** the new value is saved to `character_skills.misc_mod`

### Requirement: Drone skill totals are computed correctly
Drone skill totals SHALL use the formula: `total = mechanicLevel + classBonus + abilityMod + miscMod`. All drone skills are class skills, so `classBonus = 3` when `mechanicLevel > 0`, else `0`.

#### Scenario: Total computed with mechanic level
- **WHEN** mechanic level = 3, skill is Acrobatics (DEX), drone DEX score = 16 (mod +3), miscMod = 0
- **THEN** total = 3 + 3 + 3 + 0 = 9

#### Scenario: Class bonus not applied when ranks are zero
- **WHEN** no mechanic is linked (ranks treated as 0) and miscMod = 0
- **THEN** total = 0 + 0 + abilityMod + 0

### Requirement: Drone skills section does not show a ranks budget
The drone skills section SHALL not render a ranks budget indicator. Ranks are not allocated from a pool.

#### Scenario: No budget row shown for drone
- **WHEN** a drone character's skill section renders
- **THEN** no ranks used / ranks available budget display is present
