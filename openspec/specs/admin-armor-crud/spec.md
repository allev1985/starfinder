## Requirements

### Requirement: Armor is listed for the selected edition
The page at `/dashboard/admin/data/[editionSlug]/armor` SHALL display all armor for the edition. Columns: Name, Type (light/heavy/powered), Item Level, EAC Bonus, KAC Bonus, row actions (Edit, Delete).

#### Scenario: Armor list is shown
- **WHEN** admin visits the armor page
- **THEN** all armor records for the edition are displayed

### Requirement: Admin can create and edit armor
"Add Armor" SHALL open a dialog. Required fields: Name, Type (select), Item Level (integer), Price (integer), EAC Bonus (integer), KAC Bonus (integer), Bulk (text). Optional fields: Max Dex Bonus, Armor Check Penalty, Speed Adjustment, Upgrade Slots, Source Book, DR, Resistances. Edit pre-fills the dialog.

#### Scenario: Successful armor creation
- **WHEN** admin submits all required fields
- **THEN** the armor record appears in the table

#### Scenario: Missing required field is rejected
- **WHEN** admin submits without a required field (e.g. Item Level)
- **THEN** a validation error is shown

### Requirement: Admin can delete an armor record
Delete SHALL require confirmation.

#### Scenario: Armor is deleted after confirmation
- **WHEN** admin confirms delete
- **THEN** the armor record is removed from the table
