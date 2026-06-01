## MODIFIED Requirements

### Requirement: Inventory section on the character sheet
The character sheet inventory SHALL be split across two tabs. The Weapons subsection SHALL appear in the Stats tab right column, below Attack Bonuses. The Armour and Equipment subsections SHALL appear in the Abilities & Gear tab right column. The standalone "Inventory" section wrapper and heading are removed; each subsection uses its own section header label.

#### Scenario: Weapons appear in Stats tab
- **WHEN** the Stats tab is active
- **THEN** the Weapons subsection is visible in the right column below Attack Bonuses

#### Scenario: Armour and Equipment appear in Abilities & Gear tab
- **WHEN** the Abilities & Gear tab is active
- **THEN** the Armour subsection and Equipment subsection are visible in the right column

#### Scenario: Inventory wrapper removed
- **WHEN** either tab renders
- **THEN** there is no top-level "Inventory" heading wrapping all three subsections together
