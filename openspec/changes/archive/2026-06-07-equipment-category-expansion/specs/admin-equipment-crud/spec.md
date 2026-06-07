## MODIFIED Requirements

### Requirement: Admin can create and edit equipment
"Add Equipment" SHALL open a dialog. Required fields: Name, Category (select from full `equipmentCategory` enum: `augmentation_cybernetic`, `augmentation_biotech`, `personal_upgrade`, `ammunition`, `shield`, `computer`, `magic_item`, `trap`, `technological`, `personal`), Item Level (integer), Price (integer), Bulk (text). Optional fields: System (select from `augmentationSystem` enum, shown only for augmentation categories), Ammo Type, Ammo Capacity, Bonus Hint. Shield-specific fields (EAC Bonus, KAC Bonus, AC Penalty, Max DEX Bonus) shown only when category is `shield`. Edit pre-fills the dialog.

#### Scenario: Successful equipment creation
- **WHEN** admin submits all required fields
- **THEN** the equipment record appears in the table

#### Scenario: System field shown only for augmentation categories
- **WHEN** admin selects `augmentation_cybernetic` or `augmentation_biotech` as the category
- **THEN** the System field is shown in the dialog

#### Scenario: System field hidden for non-augmentation categories
- **WHEN** admin selects any non-augmentation category (including the five new types)
- **THEN** the System field is hidden

#### Scenario: New category values available in category select
- **WHEN** admin opens the Add Equipment dialog
- **THEN** the Category dropdown includes `computer`, `magic_item`, `trap`, `technological`, and `personal` as options
