## Requirements

### Requirement: Classes are listed for the selected edition
The page at `/dashboard/admin/data/[editionSlug]/classes` SHALL display all classes for the edition in a data table. Columns SHALL include: Name, Skill Ranks/Level, Spellcaster (yes/no), and row actions (Edit, Delete, expand chevron).

#### Scenario: Class list is shown
- **WHEN** admin visits the classes page for an edition
- **THEN** all classes for that edition are displayed

### Requirement: Admin can create and edit classes
An "Add Class" button SHALL open a dialog with fields: Name (text, required), Skill Ranks per Level (integer, required), Is Spellcaster (checkbox). Edit SHALL pre-fill the dialog. Saving SHALL persist the record and refresh the table.

#### Scenario: Successful class creation
- **WHEN** admin submits a valid name and skill ranks value
- **THEN** the class appears in the table

#### Scenario: Non-integer skill ranks rejected
- **WHEN** admin submits a non-numeric value for skill ranks
- **THEN** a validation error is shown

### Requirement: Admin can delete a class
Delete SHALL require confirmation. Deletion is blocked if characters reference the class (database constraint); in that case the dialog SHALL display an error rather than silently failing.

#### Scenario: Class with no character references is deleted
- **WHEN** admin confirms delete on an unreferenced class
- **THEN** the class is removed from the table

#### Scenario: Class referenced by a character cannot be deleted
- **WHEN** admin confirms delete on a class referenced by a character
- **THEN** an error message is shown and the class remains

### Requirement: Class row expands to show sub-data panels
Clicking the expand chevron on a class row SHALL reveal an inline panel with three tabs: Skills, Abilities, and Proficiencies. The panel SHALL be dismissed by clicking the chevron again.

#### Scenario: Expand chevron opens sub-panel
- **WHEN** admin clicks the expand chevron on a class row
- **THEN** a tabbed panel appears below the row with Skills, Abilities, and Proficiencies tabs

### Requirement: Class Skills tab manages the class-skill junction
The Skills tab SHALL show a checkbox grid of all skills in the edition. Checked skills are class skills for this class. Toggling a checkbox SHALL immediately add or remove the `classSkills` junction record via a server action.

#### Scenario: Checking a skill makes it a class skill
- **WHEN** admin checks an unchecked skill in the Skills tab
- **THEN** that skill is added to the class's class-skills list

#### Scenario: Unchecking a class skill removes it
- **WHEN** admin unchecks a currently checked skill
- **THEN** the skill is removed from the class-skills list

### Requirement: Class Abilities tab manages level-gated class abilities
The Abilities tab SHALL display a table of `classAbilities` rows for this class: Name, Level, Repeatable. An "Add Ability" button opens an inline form. Each ability row SHALL support Edit and Delete. An ability with a `choicePool` SHALL show an optional inline text field for that value.

#### Scenario: Adding a class ability
- **WHEN** admin submits a new ability with a name and level
- **THEN** the ability appears in the abilities table

#### Scenario: Editing a class ability
- **WHEN** admin changes the level of an existing ability and saves
- **THEN** the updated level is reflected in the table

#### Scenario: Deleting a class ability
- **WHEN** admin confirms delete on a class ability
- **THEN** it is removed from the abilities table

### Requirement: Class Proficiencies tab manages armor and weapon proficiencies
The Proficiencies tab SHALL show two checkbox groups:
- **Armor**: Light, Heavy, Powered (maps to `classArmorProficiency`)
- **Weapons**: all `weaponCategory` enum values (maps to `classWeaponProficiency`)

Toggling a checkbox SHALL immediately add or remove the corresponding proficiency record.

#### Scenario: Checking Heavy armor grants proficiency
- **WHEN** admin checks "Heavy" in the Armor group
- **THEN** a `classArmorProficiency` record is created for this class / Heavy

#### Scenario: Unchecking a weapon category removes proficiency
- **WHEN** admin unchecks a currently checked weapon category
- **THEN** the corresponding `classWeaponProficiency` record is deleted
