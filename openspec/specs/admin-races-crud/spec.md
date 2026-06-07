## Requirements

### Requirement: Races are listed for the selected edition
The page at `/dashboard/admin/data/[editionSlug]/races` SHALL display all races belonging to the selected edition in a data table. Columns SHALL include: Name, Type (biological / drone), and row actions (Edit, Delete).

#### Scenario: Race list is shown
- **WHEN** admin visits the races page for an edition
- **THEN** all races for that edition are shown in the table

#### Scenario: Empty state
- **WHEN** no races exist for the edition
- **THEN** an empty state message and an "Add Race" button are displayed

### Requirement: Admin can create a race
An "Add Race" button SHALL open a dialog. Required fields: Name (text), Type (select: biological | drone). On success the new race SHALL appear in the table and the dialog SHALL close.

#### Scenario: Successful race creation
- **WHEN** admin submits a valid name and type
- **THEN** the race appears in the table and the dialog closes

#### Scenario: Empty name is rejected
- **WHEN** admin submits with an empty name
- **THEN** a validation error is shown and the race is not created

### Requirement: Admin can edit a race
Clicking "Edit" on a race row SHALL open the same dialog pre-filled with the race's current values. Saving SHALL update the record and refresh the table.

#### Scenario: Race edit updates the record
- **WHEN** admin changes the name and saves
- **THEN** the table shows the updated name

### Requirement: Admin can delete a race
Clicking "Delete" on a race row SHALL show a confirmation dialog. Confirming SHALL remove the race from the database and the table.

#### Scenario: Race delete with confirmation
- **WHEN** admin confirms the delete dialog
- **THEN** the race is removed from the table
