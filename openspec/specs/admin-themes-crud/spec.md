## Requirements

### Requirement: Themes are listed for the selected edition
The page at `/dashboard/admin/data/[editionSlug]/themes` SHALL display all themes for the edition in a data table. Columns SHALL include: Name, and row actions (Edit, Delete, expand chevron).

#### Scenario: Theme list is shown
- **WHEN** admin visits the themes page for an edition
- **THEN** all themes for that edition are displayed

### Requirement: Admin can create and edit themes
An "Add Theme" button SHALL open a dialog with a required Name field. Edit SHALL pre-fill the dialog.

#### Scenario: Successful theme creation
- **WHEN** admin submits a valid name
- **THEN** the theme appears in the table

### Requirement: Admin can delete a theme
Delete SHALL require confirmation. If characters reference the theme, the dialog SHALL display an error.

#### Scenario: Theme is deleted after confirmation
- **WHEN** admin confirms the delete dialog for an unreferenced theme
- **THEN** the theme is removed

### Requirement: Theme row expands to show Abilities sub-panel
Clicking the expand chevron on a theme row SHALL reveal an inline panel listing `themeAbilities` for that theme. The panel SHALL support Add, Edit, and Delete for individual abilities.

#### Scenario: Theme abilities are listed in the sub-panel
- **WHEN** admin expands a theme row
- **THEN** all abilities for that theme are shown

### Requirement: Admin can manage theme abilities inline
Within the abilities sub-panel, an "Add Ability" inline form SHALL accept: Name (required), Description (required), Level (integer, required). Each existing ability SHALL have Edit and Delete actions.

#### Scenario: Adding a theme ability
- **WHEN** admin submits a valid ability name, description, and level
- **THEN** the ability appears in the abilities list

#### Scenario: Editing a theme ability
- **WHEN** admin edits and saves an existing ability
- **THEN** the updated values are shown

#### Scenario: Deleting a theme ability
- **WHEN** admin confirms delete on a theme ability
- **THEN** it is removed from the list
