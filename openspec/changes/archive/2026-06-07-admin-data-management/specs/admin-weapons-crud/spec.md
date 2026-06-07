## ADDED Requirements

### Requirement: Weapons are listed for the selected edition
The page at `/dashboard/admin/data/[editionSlug]/weapons` SHALL display all weapons for the edition. Columns: Name, Category, Item Level, Damage Dice, row actions (Edit, Delete).

#### Scenario: Weapon list is shown
- **WHEN** admin visits the weapons page
- **THEN** all weapon records for the edition are displayed

### Requirement: Admin can create and edit weapons
"Add Weapon" SHALL open a dialog. Required fields: Name, Category (select from weaponCategory enum), Item Level (integer), Damage Dice (text), Damage Types (text, comma-separated array), Bulk (text). Optional fields: Critical Effect, Critical Dice, Range, Capacity (integer), Usage (integer), Special, Ammo Type, Source Book. Edit pre-fills the dialog.

#### Scenario: Successful weapon creation
- **WHEN** admin submits all required fields
- **THEN** the weapon appears in the table

#### Scenario: Missing required field rejected
- **WHEN** admin omits Damage Dice
- **THEN** a validation error is shown

### Requirement: Admin can delete a weapon record
Delete SHALL require confirmation.

#### Scenario: Weapon deleted after confirmation
- **WHEN** admin confirms delete
- **THEN** the weapon is removed from the table
