## ADDED Requirements

### Requirement: Description popover on equipment cards
Equipment cards (`ShieldCard`, `EquipmentCard`, `ItemCard`) SHALL display the item name as a `PopoverTrigger` when the item has a non-null description. The trigger SHALL render an `Info` icon followed by the item name as its label. The `PopoverContent` SHALL show the item name as a heading and the description as body text. When description is null, the item name SHALL render as plain text with no popover or info icon.

#### Scenario: Item with description shows popover trigger
- **WHEN** an equipment card is rendered for an item with a non-null description
- **THEN** the item name is rendered as a popover trigger with an Info icon

#### Scenario: Clicking the trigger opens the description popover
- **WHEN** the user clicks the item name / Info icon on a card with a description
- **THEN** a popover opens showing the item name as heading and description text as body

#### Scenario: Item without description shows plain name
- **WHEN** an equipment card is rendered for an item with a null description
- **THEN** the item name is plain text with no Info icon or popover

### Requirement: Capacity, usage, and hands stat cells on equipment cards
Equipment cards SHALL render `StatCell` entries for `capacity`, `usage`, and `hands` when those values are non-null. Each SHALL only render when its value is non-null. The labels SHALL be "Capacity", "Usage", and "Hands" respectively.

#### Scenario: Card with all three new fields shows all three stat cells
- **WHEN** an equipment card is rendered for an item with capacity, usage, and hands set
- **THEN** stat cells for Capacity, Usage, and Hands are all visible on the card

#### Scenario: Card with only hands set shows only hands stat cell
- **WHEN** an equipment card is rendered for an item with only hands non-null
- **THEN** only the Hands stat cell appears; no Capacity or Usage cell is shown

#### Scenario: Card with no new fields shows no new stat cells
- **WHEN** an equipment card is rendered for an item where capacity, usage, and hands are all null
- **THEN** no Capacity, Usage, or Hands stat cell appears
