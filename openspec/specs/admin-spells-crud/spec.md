## Requirements

### Requirement: Spells are listed for the selected edition
The page at `/dashboard/admin/data/[editionSlug]/spells` SHALL display all spells for the edition. Columns: Name, School, Level, Casting Time, row actions (Edit, Delete, expand chevron).

#### Scenario: Spell list is shown
- **WHEN** admin visits the spells page
- **THEN** all spell records for the edition are displayed

### Requirement: Admin can create and edit spells
"Add Spell" SHALL open a dialog. Required fields: Name, School (select from spellSchool enum), Level (integer), Casting Time (text), Range (text), Duration (text), Description (textarea). Optional fields: Area, Targets, Saving Throw, Source Book. Edit pre-fills the dialog.

#### Scenario: Successful spell creation
- **WHEN** admin submits all required fields
- **THEN** the spell appears in the table

#### Scenario: Missing required field rejected
- **WHEN** admin omits Level
- **THEN** a validation error is shown

### Requirement: Admin can delete a spell record
Delete SHALL require confirmation.

#### Scenario: Spell deleted after confirmation
- **WHEN** admin confirms delete
- **THEN** the spell is removed from the table

### Requirement: Spell row expands to show Class Assignment sub-panel
Clicking the expand chevron on a spell row SHALL reveal an inline panel with a checkbox grid of all classes in the edition. Checked classes indicate this spell is available to that class via the `spellClass` junction.

#### Scenario: Expand chevron shows class assignment panel
- **WHEN** admin clicks the expand chevron on a spell
- **THEN** a checkbox grid of all edition classes is displayed

### Requirement: Admin can assign and remove class associations for a spell
Toggling a class checkbox SHALL immediately add or remove the corresponding `spellClass` junction record via server action.

#### Scenario: Checking a class assigns the spell
- **WHEN** admin checks an unchecked class in the spell class panel
- **THEN** a spellClass record is created linking the spell to that class

#### Scenario: Unchecking a class removes the assignment
- **WHEN** admin unchecks a currently checked class
- **THEN** the spellClass record is removed
