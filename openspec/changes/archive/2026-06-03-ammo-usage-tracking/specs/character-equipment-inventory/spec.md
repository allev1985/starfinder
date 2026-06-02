## MODIFIED Requirements

### Requirement: Quantity editing for ammunition
The system SHALL display the unit count (`quantity`) on ammunition inventory cards with a +/− stepper for the owner. The owner SHALL increment or decrement unit count via the stepper buttons. The − button SHALL be disabled when `quantity = 1`. Non-ammunition items SHALL NOT show a unit quantity control. Non-owners SHALL see the unit count as read-only text.

#### Scenario: Owner adjusts unit count via stepper
- **WHEN** the owner presses + or − on the unit stepper of an ammo card
- **THEN** `quantity` is updated accordingly and the total charge display reflects the new unit count

#### Scenario: Unit − button disabled at one unit
- **WHEN** `quantity = 1`
- **THEN** the − button on the unit stepper is disabled

#### Scenario: Augmentation card shows no quantity control
- **WHEN** an augmentation item card is rendered
- **THEN** no quantity input or control is visible
