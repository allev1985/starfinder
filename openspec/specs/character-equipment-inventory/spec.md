## Requirements

### Requirement: character_equipment table schema
The system SHALL have a `character_equipment` table with the following columns:
- `id` — uuid, primary key, default random
- `character_id` — uuid, not null, FK → `characters.id` ON DELETE CASCADE
- `equipment_id` — uuid, not null, FK → `equipment.id`
- `quantity` — integer, not null, default 1
- `current_charges` — integer, nullable
- `wielded` — boolean, not null, default false

#### Scenario: Schema is created by migration
- **WHEN** the schema migration runs
- **THEN** the `character_equipment` table exists with all columns and FK constraints

#### Scenario: Deleting a character cascades to equipment entries
- **WHEN** a character row is deleted
- **THEN** all `character_equipment` rows for that character are also deleted

#### Scenario: Quantity defaults to 1
- **WHEN** a row is inserted without specifying quantity
- **THEN** the quantity column reads back as 1

#### Scenario: Wielded defaults to false
- **WHEN** a row is inserted without specifying wielded
- **THEN** the wielded column reads back as false

### Requirement: Add equipment to character inventory
The system SHALL allow the owner of a character to add an equipment item from the reference table to the character's inventory. Multiple distinct equipment items may be added. The same item may be added more than once only for ammunition (character may carry multiple stacks). Shields may be added multiple times (a character may carry more than one shield).

#### Scenario: Owner adds an augmentation to inventory
- **WHEN** the owner selects an augmentation from the picker
- **THEN** a `character_equipment` row is created with quantity 1 and the item appears in the Equipment section

#### Scenario: Owner adds ammunition to inventory
- **WHEN** the owner selects an ammo item from the picker
- **THEN** a `character_equipment` row is created and the ammo card appears with a quantity control

#### Scenario: Owner adds a shield to inventory
- **WHEN** the owner selects a shield from the picker
- **THEN** a `character_equipment` row is created with wielded false and the shield card appears in the Shields sub-group

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
The system SHALL display the unit count (`quantity`) on ammunition inventory cards with a +/− stepper for the owner. The owner SHALL increment or decrement unit count via the stepper buttons. The − button SHALL be disabled when `quantity = 1`. Non-ammunition items SHALL NOT show a unit quantity control. Non-owners SHALL see the unit count as read-only text.

`EquipmentCard` MUST derive `quantity` directly from the `entry` prop rather than storing it in local `useState`. Optimistic updates SHALL be written to `CharacterContext` via the `onQuantityChange` callback, which updates `equipmentInventory` in the context. The context update causes the parent to re-render `EquipmentCard` with the new `entry.quantity` prop.

#### Scenario: Owner adjusts unit count via stepper
- **WHEN** the owner presses + or − on the unit stepper of an ammo card
- **THEN** `quantity` is updated accordingly and the total charge display reflects the new unit count

#### Scenario: Unit − button disabled at one unit
- **WHEN** `quantity = 1`
- **THEN** the − button on the unit stepper is disabled

#### Scenario: Augmentation card shows no quantity control
- **WHEN** an augmentation item card is rendered
- **THEN** no quantity input or control is visible

#### Scenario: Context update propagates to card display
- **WHEN** `CharacterContext.equipmentInventory` is updated (e.g., by a realtime event or any other external write)
- **THEN** the `EquipmentCard` immediately displays the new quantity value without requiring local state to be reset

### Requirement: Bonus hint callout on equipment cards
Equipment items with a non-null `bonus_hint` SHALL display an amber callout on their card. The callout SHALL render the `bonus_hint` text verbatim. Items with null `bonus_hint` SHALL show no callout.

#### Scenario: Augmentation with bonus_hint shows amber callout
- **WHEN** an equipment card is rendered for an item with bonus_hint set
- **THEN** an amber callout containing the bonus_hint text is visible on the card

#### Scenario: Ammunition card shows no callout
- **WHEN** an ammunition equipment card is rendered
- **THEN** no bonus hint callout is present

### Requirement: Description popover on equipment cards
Equipment items with a non-null `description` SHALL display an info icon button on their card. Pressing the button SHALL open a popover showing the description text. Items with a null `description` SHALL show no icon button.

#### Scenario: Equipment card with description shows info button
- **WHEN** an equipment card is rendered for an item with a description
- **THEN** an info icon button is visible on the card

#### Scenario: Pressing info button opens description popover
- **WHEN** the owner presses the info icon button on an equipment card
- **THEN** a popover appears containing the description text

#### Scenario: Equipment card without description shows no info button
- **WHEN** an equipment card is rendered for an item with null description
- **THEN** no info icon button is present on the card

### Requirement: Capacity, usage, and hands stat cells on equipment cards
Equipment items with non-null `capacity`, `usage`, or `hands` values SHALL display those stats as labelled cells on their card (e.g. "Capacity: 20", "Usage: 2", "Hands: 2"). Items where all three values are null SHALL show no such cells.

#### Scenario: Equipment card with capacity shows capacity cell
- **WHEN** an equipment card is rendered for an item with a capacity value
- **THEN** a "Capacity" labelled stat cell is visible on the card

#### Scenario: Equipment card with usage shows usage cell
- **WHEN** an equipment card is rendered for an item with a usage value
- **THEN** a "Usage" labelled stat cell is visible on the card

#### Scenario: Equipment card with hands shows hands cell
- **WHEN** an equipment card is rendered for an item with a hands value
- **THEN** a "Hands" labelled stat cell is visible on the card

#### Scenario: Equipment card with all three null shows no stat cells
- **WHEN** an equipment card is rendered for an item where capacity, usage, and hands are all null
- **THEN** no capacity, usage, or hands cells are present on the card

### Requirement: Equipment section layout
The Equipment subsection in the Inventory section SHALL group items into four sub-groups rendered in order:
1. **Shields** (category `shield`)
2. **Augmentations & Upgrades** (categories `augmentation_cybernetic`, `augmentation_biotech`, `personal_upgrade`)
3. **Ammunition** (category `ammunition`)
4. **Items** (categories `computer`, `magic_item`, `trap`, `technological`, `personal`)

Each sub-group SHALL show a placeholder when empty. The picker SHALL use a grouped `CommandGroup`-per-category layout with no tab bar — search filters across all groups.

#### Scenario: Empty shields sub-group shows placeholder
- **WHEN** a character has no shields in inventory
- **THEN** the Shields sub-group displays a placeholder message

#### Scenario: Empty augmentations sub-group shows placeholder
- **WHEN** a character has no augmentations or upgrades
- **THEN** the Augmentations & Upgrades sub-group displays a placeholder message

#### Scenario: Empty ammunition sub-group shows placeholder
- **WHEN** a character has no ammunition items
- **THEN** the Ammunition sub-group displays a placeholder message

#### Scenario: Empty items sub-group shows placeholder
- **WHEN** a character has no items of any new category
- **THEN** the Items sub-group displays a placeholder message

#### Scenario: Items appear under correct sub-group
- **WHEN** a character has a shield, a cybernetic augmentation, a battery, and a computer in inventory
- **THEN** each item appears under its correct sub-group heading

#### Scenario: Picker search filters across all categories
- **WHEN** the owner opens the equipment picker and types a search term
- **THEN** matching items appear from any category with no tab selection required
