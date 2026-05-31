## MODIFIED Requirements

### Requirement: Android characters are seeded with the standard android skill list at creation
When a drone character is created, `character_skills` SHALL be seeded with only the chosen Skill Unit skill and the chassis bonus skill (if any). Biological characters SHALL continue to receive no seeded skills at creation.

#### Scenario: Drone creation seeds only Skill Unit and chassis bonus
- **WHEN** a drone character is created with Combat chassis and Stealth as the Skill Unit
- **THEN** the character has exactly one `character_skills` row: Stealth

#### Scenario: Biological creation seeds no skills
- **WHEN** a biological character is created
- **THEN** no `character_skills` rows are inserted at creation

### Requirement: Android skills section renders a fixed locked list
The skills section for drone characters SHALL render only the drone's seeded skills. The section SHALL show an "Add Skill" button that opens a dialog filtered to the drone allowed skill list. Per-row remove controls SHALL NOT be shown.

#### Scenario: Add skill button shown for drone owner
- **WHEN** the owner of a drone character views the Skills section
- **THEN** an "Add Skill" button is rendered

#### Scenario: Add skill dialog is filtered to drone allowed list
- **WHEN** the owner opens the Add Skill dialog for a drone
- **THEN** only drone allowed skills are shown in the dialog

#### Scenario: No remove control shown for drone skill rows
- **WHEN** the owner of a drone character views a skill row
- **THEN** no remove/delete control is rendered on any skill row
