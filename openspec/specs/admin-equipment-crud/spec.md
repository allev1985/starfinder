## Requirements

### Requirement: Equipment is listed for the selected edition
The page at `/dashboard/admin/data/[editionSlug]/equipment` SHALL display all equipment records for the edition. Columns: Name, Category, Item Level, Price, row actions (Edit, Delete).

#### Scenario: Equipment list is shown
- **WHEN** admin visits the equipment page
- **THEN** all equipment records for the edition are displayed

### Requirement: Admin can create and edit equipment
"Add Equipment" SHALL open a dialog. Required fields: Name, Category (select from full `equipmentCategory` enum: `augmentation_cybernetic`, `augmentation_biotech`, `personal_upgrade`, `ammunition`, `shield`, `computer`, `magic_item`, `trap`, `technological`, `personal`), Item Level (integer), Price (integer), Bulk (text). Optional fields: Description (textarea), Capacity (integer), Usage (integer), Hands (integer), System (select from `augmentationSystem` enum, shown only for augmentation categories), Ammo Type, Ammo Capacity, Bonus Hint. Shield-specific fields (EAC Bonus, KAC Bonus, AC Penalty, Max DEX Bonus) shown only when category is `shield`. Edit pre-fills the dialog.

#### Scenario: Successful equipment creation
- **WHEN** admin submits all required fields
- **THEN** the equipment record appears in the table

#### Scenario: Description field accepts multi-line text
- **WHEN** admin enters text in the Description textarea
- **THEN** the text is saved to the equipment record's description column

#### Scenario: Capacity, usage, and hands fields accept integers
- **WHEN** admin enters integer values in the Capacity, Usage, and Hands fields
- **THEN** the values are saved to the corresponding columns on the equipment record

#### Scenario: Capacity, usage, and hands fields are optional
- **WHEN** admin submits the form without filling in Capacity, Usage, or Hands
- **THEN** the equipment record is created with null values for those columns

#### Scenario: System field shown only for augmentation categories
- **WHEN** admin selects `augmentation_cybernetic` or `augmentation_biotech` as the category
- **THEN** the System field is shown in the dialog

#### Scenario: System field hidden for non-augmentation categories
- **WHEN** admin selects any non-augmentation category (including the five new types)
- **THEN** the System field is hidden

#### Scenario: New category values available in category select
- **WHEN** admin opens the Add Equipment dialog
- **THEN** the Category dropdown includes `computer`, `magic_item`, `trap`, `technological`, and `personal` as options

### Requirement: Admin can delete an equipment record
Delete SHALL require confirmation.

#### Scenario: Equipment deleted after confirmation
- **WHEN** admin confirms delete
- **THEN** the record is removed from the table
