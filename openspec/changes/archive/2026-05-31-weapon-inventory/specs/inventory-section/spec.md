## ADDED Requirements

### Requirement: Inventory section on the character sheet
The character sheet SHALL have an Inventory section rendered below the combat stats section. The Inventory section SHALL contain two subsections in order: Armor (top) and Weapons (below). The section SHALL use the heading "Inventory".

#### Scenario: Inventory section is visible on the character sheet
- **WHEN** a user navigates to any character's sheet
- **THEN** an "Inventory" section is present below the combat stats section

#### Scenario: Armor subsection appears before weapons subsection
- **WHEN** the Inventory section is rendered
- **THEN** the Armor subsection appears above the Weapons subsection

### Requirement: Armor subsection within Inventory
The Inventory section SHALL contain the armor picker as its Armor subsection. The armor picker behavior and display SHALL be unchanged — only its location on the page changes (moved from combat section to Inventory).

#### Scenario: Armor picker behaves identically in its new location
- **WHEN** the owner uses the armor picker inside the Inventory section
- **THEN** equipping, changing, and clearing armor behaves identically to the prior combat-section location

### Requirement: Weapons subsection within Inventory
The Inventory section SHALL contain a Weapons subsection showing all carried weapon stat cards followed by an "Add Weapon" control for the owner. When no weapons are in inventory, the subsection SHALL display a placeholder message.

#### Scenario: Empty weapons inventory shows placeholder
- **WHEN** a character has no weapons in inventory
- **THEN** the Weapons subsection displays "No weapons in inventory" (or equivalent placeholder)

#### Scenario: Weapons subsection shows all carried weapons
- **WHEN** a character has two weapons in inventory
- **THEN** both weapon stat cards are rendered in the Weapons subsection
