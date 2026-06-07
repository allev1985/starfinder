## ADDED Requirements

### Requirement: Shields are listed for the selected edition
The page at `/dashboard/admin/data/[editionSlug]/shields` SHALL display all shield equipment items for the edition. Columns: Name, Lvl, EAC, KAC, ACP, Bulk, Actions (Edit, Delete). Columns SHALL be sortable by Name, itemLevel, eacBonus, kacBonus, and bulk.

#### Scenario: Shield list is shown
- **WHEN** admin visits the shields page
- **THEN** all shield records for the edition are displayed in the table

#### Scenario: Empty state is shown
- **WHEN** no shields exist for the edition
- **THEN** a placeholder message is displayed instead of a table body

### Requirement: Admin can create and edit shields
"Add Shield" SHALL open a dialog. Required fields: Name (text), Item Level (number), Price (number), EAC Bonus (number), KAC Bonus (number), AC Penalty (number), Bulk (text), Source Book (text). Optional field: Max DEX Bonus (number, may be left blank to store null). Edit pre-fills the dialog with existing values.

#### Scenario: Successful shield creation
- **WHEN** admin submits all required fields
- **THEN** the shield appears in the table and is stored with category = 'shield'

#### Scenario: Duplicate shield name rejected
- **WHEN** admin submits a name that already exists for the edition
- **THEN** an error is shown and the shield is not created

#### Scenario: Max DEX Bonus left blank stores null
- **WHEN** admin leaves the Max DEX Bonus field empty and submits
- **THEN** the shield row is created with max_dex_bonus = null

#### Scenario: Edit pre-fills all fields
- **WHEN** admin clicks Edit on an existing shield
- **THEN** the dialog opens with all current values pre-filled

### Requirement: Admin can delete a shield
Delete SHALL require confirmation. Deletion SHALL only succeed if the shield is not currently in any character's inventory. If the shield is in use, an error message SHALL be shown.

#### Scenario: Shield deleted after confirmation
- **WHEN** admin confirms deletion of a shield not in any character's inventory
- **THEN** the shield row is removed from the table

#### Scenario: Delete blocked when shield is in use
- **WHEN** admin attempts to delete a shield that is in at least one character's inventory
- **THEN** an error message is shown and the shield is not deleted

### Requirement: Shields nav card in edition admin index
The edition data admin index page SHALL include a "Shields" navigation card linking to `/dashboard/admin/data/[editionSlug]/shields`, displayed alongside Armor, Weapons, Equipment, and other category cards.

#### Scenario: Shields card is present on edition index
- **WHEN** admin visits the edition data index page
- **THEN** a Shields card is visible and links to the shields CRUD page
