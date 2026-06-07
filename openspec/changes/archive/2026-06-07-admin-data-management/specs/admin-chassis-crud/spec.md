## ADDED Requirements

### Requirement: Chassis records are listed for the selected edition
The page at `/dashboard/admin/data/[editionSlug]/chassis` SHALL display all chassis records for the edition. Columns: Name, Bonus Skill (name or "—"), default ability scores summary, row actions (Edit, Delete).

#### Scenario: Chassis list is shown
- **WHEN** admin visits the chassis page
- **THEN** all chassis records for the edition are displayed

### Requirement: Admin can create and edit chassis
"Add Chassis" SHALL open a dialog. Required field: Name. Optional fields: Bonus Skill (select from skills in this edition), Default STR/DEX/INT/WIS/CHA (integers, defaulting to 10). Note: chassis have no CON score per game rules. Edit pre-fills the dialog.

#### Scenario: Successful chassis creation
- **WHEN** admin submits a name
- **THEN** the chassis record appears in the table with ability defaults of 10

#### Scenario: Bonus skill can be assigned
- **WHEN** admin selects a skill from the dropdown during creation
- **THEN** the chassis record stores the bonusSkillId

### Requirement: Admin can delete a chassis record
Delete SHALL require confirmation. If characters reference this chassis, the dialog SHALL show an error.

#### Scenario: Referenced chassis cannot be deleted
- **WHEN** admin tries to delete a chassis linked to a character
- **THEN** an error message is shown and the chassis remains

#### Scenario: Unreferenced chassis is deleted after confirmation
- **WHEN** admin confirms delete on an unreferenced chassis
- **THEN** the record is removed from the table
