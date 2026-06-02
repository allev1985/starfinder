## ADDED Requirements

### Requirement: currentCharges column on character_equipment
The `character_equipment` table SHALL have a `current_charges` column (nullable integer). A `null` value SHALL mean the active unit is fully loaded. A non-null value SHALL represent the number of charges remaining in the active unit.

#### Scenario: Existing rows default to null
- **WHEN** the migration runs on an existing `character_equipment` row
- **THEN** the `current_charges` column is `null` (interpreted as full)

#### Scenario: New ammo row inserts with null current_charges
- **WHEN** a new ammunition item is added to a character's inventory
- **THEN** the `character_equipment` row is created with `current_charges = null`

### Requirement: Charge stepper on ammo cards
The system SHALL display a +/− charge stepper on ammunition inventory cards for the owner. The stepper SHALL show total charges across all units as `<totalCharges> / <totalCapacity>`, where `totalCharges = activeCharges + (quantity − 1) × capacity` and `totalCapacity = quantity × capacity`. When `currentCharges` is `null`, the active unit is treated as fully loaded. Non-owners SHALL see the total charge display as read-only text.

#### Scenario: Owner sees stepper at full charge
- **WHEN** an ammo card is rendered with `currentCharges = null` and `quantity = 1`
- **THEN** the stepper displays `<capacity> / <capacity>` and both +/− buttons are visible

#### Scenario: Total charges reflect multiple units
- **WHEN** an ammo card has `quantity = 3`, `capacity = 20`, and `currentCharges = 15`
- **THEN** the display shows `55 / 60`

#### Scenario: Owner decrements charge
- **WHEN** the owner presses − on an ammo card with `currentCharges = null`
- **THEN** `currentCharges` is set to `ammoCapacity − 1` and the stepper updates

#### Scenario: Owner decrements charge from tracked value
- **WHEN** the owner presses − on an ammo card with `currentCharges = 5`
- **THEN** `currentCharges` is updated to 4 in the database and the stepper reflects 4

#### Scenario: − button disabled at zero charges
- **WHEN** `currentCharges = 0`
- **THEN** the − button is disabled

#### Scenario: + button disabled when full
- **WHEN** `currentCharges = null` or `currentCharges = ammoCapacity`
- **THEN** the + button is disabled

#### Scenario: Non-owner sees read-only charge display
- **WHEN** a non-owner views an ammo card
- **THEN** total charges are displayed as static text with no stepper controls

### Requirement: Reload action on ammo cards
The system SHALL provide a Reload button on ammunition inventory cards for the owner. Pressing Reload SHALL set `currentCharges` to `null` (reset the active unit to full). Reload SHALL NOT change `quantity`. Unit count is managed separately via the unit stepper.

#### Scenario: Owner reloads active unit
- **WHEN** the owner presses Reload on an ammo card with `currentCharges = 7`
- **THEN** `currentCharges` is set to `null` (full) and quantity is unchanged

#### Scenario: Reload on already-full active unit
- **WHEN** the owner presses Reload on an ammo card with `currentCharges = null`
- **THEN** `currentCharges` remains `null` and quantity is unchanged

### Requirement: Unit quantity stepper on ammo cards
The system SHALL display a +/− unit stepper on ammunition inventory cards for the owner showing how many units are carried. The − button SHALL be disabled when `quantity = 1`. Non-owners SHALL see the unit count as read-only text.

#### Scenario: Owner increments unit count
- **WHEN** the owner presses + on the unit stepper
- **THEN** `quantity` is incremented by 1 and the total charges display updates

#### Scenario: Owner decrements unit count
- **WHEN** the owner presses − on the unit stepper with `quantity > 1`
- **THEN** `quantity` is decremented by 1 and the total charges display updates

#### Scenario: − button disabled at one unit
- **WHEN** `quantity = 1`
- **THEN** the unit − button is disabled

#### Scenario: Non-owner sees read-only unit count
- **WHEN** a non-owner views an ammo card
- **THEN** unit count is displayed as static text with no stepper controls
