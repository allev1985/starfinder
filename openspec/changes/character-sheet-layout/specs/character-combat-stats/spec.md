## MODIFIED Requirements

### Requirement: Combat Stats section on character sheet
The character detail page SHALL render combat stats within the Stats tab right column. Each derived value (Initiative total, EAC, KAC, saving throw totals, attack totals) SHALL be displayed using a formula-box layout: a bordered cell for the total, an equals sign, then bordered cells for each component (base, ability modifier, misc modifier), with column labels above each cell.

#### Scenario: Formula-box layout for Initiative
- **WHEN** the Stats tab renders the Initiative row
- **THEN** the total is shown in a bordered cell followed by `=`, a read-only DEX modifier cell, and an editable misc modifier cell (owner) or static misc modifier cell (non-owner), each with a label above

#### Scenario: Formula-box layout for EAC and KAC
- **WHEN** the Stats tab renders Armor Class
- **THEN** EAC shows `[total] = 10 + [armor bonus] + [DEX mod] + [misc mod]` and KAC shows the same pattern, each value in its own bordered cell with a label

#### Scenario: Formula-box layout for Saving Throws
- **WHEN** the Stats tab renders Saving Throws
- **THEN** each of Fortitude, Reflex, and Will shows `[total] = [base save] + [ability mod] + [misc mod]` with each value in its own bordered cell

#### Scenario: Formula-box layout for Attack Bonuses
- **WHEN** the Stats tab renders Attack Bonuses
- **THEN** Melee, Ranged, and Thrown each show `[total] = [BAB] + [ability mod] + [misc mod]` with each value in its own bordered cell
