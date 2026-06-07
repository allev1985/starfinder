## Requirements

### Requirement: Equipment is listed for the selected edition
The page at `/dashboard/admin/data/[editionSlug]/equipment` SHALL display all equipment records for the edition. Columns: Name, Category, Item Level, Price, row actions (Edit, Delete).

#### Scenario: Equipment list is shown
- **WHEN** admin visits the equipment page
- **THEN** all equipment records for the edition are displayed

### Requirement: Admin can create and edit equipment
"Add Equipment" SHALL open a dialog. Required fields: Name, Category (select from equipmentCategory enum: augmentation_cybernetic, augmentation_biotech, personal_upgrade, ammunition), Item Level (integer), Price (integer), Bulk (text). Optional fields: System (select from augmentationSystem enum, shown only for augmentation categories), Ammo Type, Ammo Capacity, Bonus Hint. Edit pre-fills the dialog.

#### Scenario: Successful equipment creation
- **WHEN** admin submits all required fields
- **THEN** the equipment record appears in the table

#### Scenario: System field shown only for augmentation categories
- **WHEN** admin selects augmentation_cybernetic or augmentation_biotech as the category
- **THEN** the System field is shown in the dialog

#### Scenario: System field hidden for non-augmentation categories
- **WHEN** admin selects personal_upgrade or ammunition as the category
- **THEN** the System field is hidden

### Requirement: Admin can delete an equipment record
Delete SHALL require confirmation.

#### Scenario: Equipment deleted after confirmation
- **WHEN** admin confirms delete
- **THEN** the record is removed from the table
