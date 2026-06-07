## ADDED Requirements

### Requirement: Five new equipment category enum values
The `equipment_category` Postgres enum SHALL include five additional values: `computer`, `magic_item`, `trap`, `technological`, `personal`. These values SHALL be added via `ALTER TYPE … ADD VALUE` migrations and require no column changes.

#### Scenario: New enum values accepted by insert
- **WHEN** an INSERT into `equipment` uses category `computer`, `magic_item`, `trap`, `technological`, or `personal`
- **THEN** the insert succeeds without constraint violation

#### Scenario: Unknown category still rejected
- **WHEN** an INSERT uses a category value outside the full enum set
- **THEN** the database rejects the insert with a constraint violation

### Requirement: New category items tracked as pack inventory only
Items with categories `computer`, `magic_item`, `trap`, `technological`, or `personal` SHALL be tracked in `character_equipment` for pack-tracking purposes only. They SHALL NOT feed into any AC, attack, or derived stat calculation.

#### Scenario: Adding a computer to inventory does not affect AC
- **WHEN** a character has a computer in their equipment inventory
- **THEN** no EAC or KAC values are modified

### Requirement: Items section in character inventory
The character equipment inventory SHALL render a fourth sub-group labeled **Items** for all entries whose category is one of: `computer`, `magic_item`, `trap`, `technological`, `personal`. The Items section SHALL appear after Ammunition. Each card in this section SHALL show: name, level, category label, price, bulk, and a remove button (owner only). No charge controls, quantity steppers, or wielded toggles SHALL be shown.

#### Scenario: Items section appears when new-category items are present
- **WHEN** a character has a computer in inventory
- **THEN** it appears under the Items sub-group

#### Scenario: Items section shows placeholder when empty
- **WHEN** a character has no items of any new category
- **THEN** the Items sub-group displays a placeholder message

#### Scenario: Items card shows correct metadata
- **WHEN** an item card for a `technological` item is rendered
- **THEN** the card displays name, item level, "Technological" label, price, and bulk

### Requirement: Equipment picker uses grouped command list
The equipment picker dialog SHALL remove the horizontal tab bar and replace it with a `CommandGroup`-per-category layout within the existing `Command` component. Items SHALL be grouped under category headings in this order: Shields, Augmentations & Upgrades, Ammunition, Computers, Technological, Magic Items, Traps, Personal Items. The `CommandInput` search SHALL filter across all groups simultaneously. Groups with zero visible items SHALL be omitted from the rendered output.

#### Scenario: Picker shows all categories without tab selection
- **WHEN** the owner opens the equipment picker
- **THEN** items are visible under labeled category headings with no tab bar present

#### Scenario: Search filters across all categories
- **WHEN** the owner types a search term in the picker
- **THEN** only items matching the term are shown, regardless of category, and empty groups are hidden

#### Scenario: Already-carried non-stackable items hidden
- **WHEN** a non-ammo, non-shield item is already in the character's inventory
- **THEN** it does not appear in the picker list
