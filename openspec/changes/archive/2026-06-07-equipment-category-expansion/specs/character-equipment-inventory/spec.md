## MODIFIED Requirements

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
