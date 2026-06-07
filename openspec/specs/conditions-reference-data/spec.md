## Requirements

### Requirement: Conditions are listed for the selected edition
The page at `/dashboard/admin/data/[editionSlug]/conditions` SHALL display all condition records for the edition. Columns: Name, Slug, Description (truncated), row actions (Edit, Delete).

#### Scenario: Conditions list is shown
- **WHEN** an admin visits the conditions page for an edition
- **THEN** all condition records for that edition are displayed in a table

#### Scenario: Empty state shown when no conditions exist
- **WHEN** an admin visits the conditions page and no conditions have been created
- **THEN** the table shows an empty state message

### Requirement: Admin can create and edit a condition
"Add Condition" SHALL open a dialog. Required fields: Name (text), Description (textarea). The slug SHALL be auto-derived from the name (kebab-case) on creation and displayed as read-only; it MAY be overridden before first save. Edit pre-fills all fields including slug (read-only on edit).

#### Scenario: Successful condition creation
- **WHEN** admin submits a valid Name and Description
- **THEN** the condition record appears in the table with a slug derived from the name

#### Scenario: Slug is auto-populated from name
- **WHEN** admin types a name in the Add Condition dialog
- **THEN** the slug field updates in real time to a kebab-case version of the name

#### Scenario: Edit pre-fills dialog
- **WHEN** admin clicks Edit on an existing condition
- **THEN** the dialog opens with Name, Slug, and Description pre-filled

### Requirement: Admin can delete a condition
Delete SHALL require confirmation. Deleting a condition SHALL cascade-delete all `character_conditions` rows referencing it.

#### Scenario: Condition deleted after confirmation
- **WHEN** admin confirms the delete action
- **THEN** the condition is removed from the table and from all characters that had it active

#### Scenario: Delete requires confirmation
- **WHEN** admin clicks Delete without confirming
- **THEN** no deletion occurs until the confirmation dialog is accepted

### Requirement: Conditions link is present on the admin data index
The edition data index page SHALL include a "Conditions" card linking to `/dashboard/admin/data/[editionSlug]/conditions`.

#### Scenario: Conditions card visible on admin data index
- **WHEN** admin visits `/dashboard/admin/data/[editionSlug]`
- **THEN** a "Conditions" card is visible alongside Races, Classes, Feats, etc.
