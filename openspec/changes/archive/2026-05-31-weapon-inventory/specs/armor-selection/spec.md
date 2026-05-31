## MODIFIED Requirements

### Requirement: Character can equip armor from the picker
The character owner SHALL be able to select an armor from a searchable combobox in the **Inventory section** (relocated from the combat section). Selecting an armor SHALL persist `equipped_armor_id` on the character immediately (no debounce — it is a discrete selection, not a continuous input). The combobox SHALL only display armor types the character's class is proficient with.

#### Scenario: Owner selects armor from the combobox
- **WHEN** the owner opens the armor combobox and selects an armor
- **THEN** `equipped_armor_id` is updated on the character and the sheet reflects the new armor's stats

#### Scenario: Combobox is filterable by name
- **WHEN** the owner types in the armor combobox search field
- **THEN** the list narrows to armor whose name contains the typed text (case-insensitive)

#### Scenario: Combobox only shows class-proficient armor
- **WHEN** the character's class is Envoy (light proficiency only)
- **THEN** the combobox contains only light armor rows, no heavy or powered

#### Scenario: Combobox is empty when no class is set
- **WHEN** the character has no class assigned
- **THEN** the combobox shows a placeholder message "Select a class to enable armor selection" and no armor options

#### Scenario: Non-owner cannot change equipped armor
- **WHEN** a non-owner views the character sheet
- **THEN** the armor picker is displayed as read-only text showing the currently equipped armor name (or "None")

### Requirement: Owner can clear equipped armor
The character owner SHALL be able to clear the equipped armor, returning the character to no armor equipped (`equipped_armor_id = NULL`).

#### Scenario: Owner clears equipped armor
- **WHEN** the owner selects the "None" option in the armor combobox
- **THEN** `equipped_armor_id` is set to NULL and the AC grid shows 0 armor bonus

### Requirement: Equipped armor stats are displayed
When an armor is equipped, a compact stat strip SHALL be displayed below the AC grid showing: Max DEX (or "—" if no cap), ACP, Speed adjustment (formatted as "–5 ft" or "0 ft"), Bulk, and Upgrade Slots.

#### Scenario: Stat strip shows correct values for equipped armor
- **WHEN** a character has an armor with max_dex_bonus = 3, armor_check_penalty = -2, speed_adjustment = -5, bulk = '2', upgrade_slots = 1 equipped
- **THEN** the stat strip displays: Max DEX +3 | ACP –2 | Speed –5 ft | Bulk 2 | Slots 1

#### Scenario: Stat strip is hidden when no armor is equipped
- **WHEN** a character has no equipped armor
- **THEN** the stat strip is not rendered
