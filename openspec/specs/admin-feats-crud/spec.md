## Requirements

### Requirement: Feats are listed for the selected edition
The page at `/dashboard/admin/data/[editionSlug]/feats` SHALL display all feats for the edition. Columns: Name, Combat Feat (yes/no), Prerequisites (truncated), row actions (Edit, Delete).

#### Scenario: Feat list is shown
- **WHEN** admin visits the feats page
- **THEN** all feat records for the edition are displayed

### Requirement: Admin can create and edit feats
"Add Feat" SHALL open a dialog. Required fields: Name (text, must be unique), Description (textarea). Optional fields: Prerequisites (text), Is Combat Feat (checkbox), Source Book (text). Edit pre-fills the dialog.

#### Scenario: Successful feat creation
- **WHEN** admin submits a unique name and description
- **THEN** the feat appears in the table

#### Scenario: Duplicate feat name rejected
- **WHEN** admin submits a name that already exists
- **THEN** an error is shown and the feat is not created

### Requirement: Admin can delete a feat
Delete SHALL require confirmation.

#### Scenario: Feat deleted after confirmation
- **WHEN** admin confirms delete
- **THEN** the feat is removed from the table
