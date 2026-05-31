## MODIFIED Requirements

### Requirement: Inventory section on the character sheet
The character sheet SHALL have an Inventory section rendered below the combat stats section. The Inventory section SHALL contain three subsections in order: Armor (top), Weapons (middle), and Equipment (bottom). The section SHALL use the heading "Inventory".

#### Scenario: Inventory section is visible on the character sheet
- **WHEN** a user navigates to any character's sheet
- **THEN** an "Inventory" section is present below the combat stats section

#### Scenario: Subsections appear in correct order
- **WHEN** the Inventory section is rendered
- **THEN** the Armor subsection appears first, Weapons second, and Equipment third

### Requirement: Armor subsection within Inventory
The Inventory section SHALL contain the armor picker as its Armor subsection. The armor picker behavior and display SHALL be unchanged — only its location on the page changes (moved from combat section to Inventory).

#### Scenario: Armor picker behaves identically in its new location
- **WHEN** the owner uses the armor picker inside the Inventory section
- **THEN** equipping, changing, and clearing armor behaves identically to the prior combat-section location

### Requirement: Weapons subsection within Inventory
The Inventory section SHALL contain a Weapons subsection showing all carried weapon stat cards followed by an "Add Weapon" control for the owner. When no weapons are in inventory, the subsection SHALL display a placeholder message. Each weapon card SHALL display the weapon's `ammo_type` as a badge when `ammo_type` is not null.

#### Scenario: Empty weapons inventory shows placeholder
- **WHEN** a character has no weapons in inventory
- **THEN** the Weapons subsection displays "No weapons in inventory" (or equivalent placeholder)

#### Scenario: Weapons subsection shows all carried weapons
- **WHEN** a character has two weapons in inventory
- **THEN** both weapon stat cards are rendered in the Weapons subsection

#### Scenario: Weapon card shows ammo type badge for ranged weapons
- **WHEN** a ranged weapon card is rendered and the weapon has ammo_type set
- **THEN** the card displays a badge showing the ammo type (e.g., "Battery", "Small Arm Rounds")

#### Scenario: Weapon card shows no ammo badge for melee weapons
- **WHEN** a melee weapon card is rendered
- **THEN** no ammo type badge is displayed

### Requirement: Equipment subsection within Inventory
The Inventory section SHALL contain an Equipment subsection as its third and final subsection. The Equipment subsection SHALL render the character's equipment inventory as defined in the `character-equipment-inventory` capability. The subsection heading SHALL be "Equipment".

#### Scenario: Equipment subsection is present in the Inventory section
- **WHEN** the Inventory section is rendered
- **THEN** an "Equipment" subsection with heading "Equipment" is visible below the Weapons subsection
