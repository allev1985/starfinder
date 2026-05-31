## ADDED Requirements

### Requirement: character_equipment table schema
The system SHALL have a `character_equipment` table with the following columns:
- `id` — uuid, primary key, default random
- `character_id` — uuid, not null, FK → `characters.id` ON DELETE CASCADE
- `equipment_id` — uuid, not null, FK → `equipment.id`
- `quantity` — integer, not null, default 1

#### Scenario: Schema is created by migration
- **WHEN** the schema migration runs
- **THEN** the `character_equipment` table exists with all columns and FK constraints

#### Scenario: Deleting a character cascades to equipment entries
- **WHEN** a character row is deleted
- **THEN** all `character_equipment` rows for that character are also deleted

#### Scenario: Quantity defaults to 1
- **WHEN** a row is inserted without specifying quantity
- **THEN** the quantity column reads back as 1

### Requirement: Add equipment to character inventory
The system SHALL allow the owner of a character to add an equipment item from the reference table to the character's inventory. Multiple distinct equipment items may be added. The same item may be added more than once only for ammunition (character may carry multiple stacks).

#### Scenario: Owner adds an augmentation to inventory
- **WHEN** the owner selects an augmentation from the picker
- **THEN** a `character_equipment` row is created with quantity 1 and the item appears in the Equipment section

#### Scenario: Owner adds ammunition to inventory
- **WHEN** the owner selects an ammo item from the picker
- **THEN** a `character_equipment` row is created and the ammo card appears with a quantity control

#### Scenario: Non-owner cannot add equipment
- **WHEN** a non-owner views the character sheet
- **THEN** the Add Equipment control is not rendered

### Requirement: Remove equipment from character inventory
The system SHALL allow the owner to remove an equipment item from the character's inventory via a confirmation dialog. Removal SHALL delete the `character_equipment` row.

#### Scenario: Owner removes an equipment item
- **WHEN** the owner confirms removal of an equipment item
- **THEN** the `character_equipment` row is deleted and the card disappears from the UI

#### Scenario: Non-owner cannot remove equipment
- **WHEN** a non-owner views the character sheet
- **THEN** no remove control is visible on equipment cards

### Requirement: Quantity editing for ammunition
The system SHALL allow the owner to edit the quantity of an ammunition item in inventory. The quantity SHALL be a positive integer. Non-ammunition items SHALL NOT show a quantity control.

#### Scenario: Owner updates battery quantity
- **WHEN** the owner changes the quantity field on a battery card to 3
- **THEN** the `character_equipment` row is updated with quantity 3

#### Scenario: Augmentation card shows no quantity control
- **WHEN** an augmentation item card is rendered
- **THEN** no quantity input or control is visible

### Requirement: Bonus hint callout on equipment cards
Equipment items with a non-null `bonus_hint` SHALL display an amber callout on their card. The callout SHALL render the `bonus_hint` text verbatim. Items with null `bonus_hint` SHALL show no callout.

#### Scenario: Augmentation with bonus_hint shows amber callout
- **WHEN** an equipment card is rendered for an item with bonus_hint set
- **THEN** an amber callout containing the bonus_hint text is visible on the card

#### Scenario: Ammunition card shows no callout
- **WHEN** an ammunition equipment card is rendered
- **THEN** no bonus hint callout is present

### Requirement: Equipment section layout
The Equipment subsection in the Inventory section SHALL group items into two sub-groups rendered in order: "Augmentations & Upgrades" (categories `augmentation_cybernetic`, `augmentation_biotech`, `personal_upgrade`) and "Ammunition" (category `ammunition`). Each sub-group SHALL show a placeholder when empty. The picker SHALL allow filtering by category.

#### Scenario: Empty augmentations sub-group shows placeholder
- **WHEN** a character has no augmentations or upgrades
- **THEN** the Augmentations & Upgrades sub-group displays a placeholder message

#### Scenario: Empty ammunition sub-group shows placeholder
- **WHEN** a character has no ammunition items
- **THEN** the Ammunition sub-group displays a placeholder message

#### Scenario: Items appear under correct sub-group
- **WHEN** a character has a cybernetic augmentation and a battery in inventory
- **THEN** the augmentation appears under Augmentations & Upgrades and the battery appears under Ammunition
