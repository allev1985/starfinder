## MODIFIED Requirements

### Requirement: Quantity editing for ammunition
The system SHALL display the unit count (`quantity`) on ammunition inventory cards with a +/− stepper for the owner. The owner SHALL increment or decrement unit count via the stepper buttons. The − button SHALL be disabled when `quantity = 1`. Non-ammunition items SHALL NOT show a unit quantity control. Non-owners SHALL see the unit count as read-only text.

`EquipmentCard` MUST derive `quantity` directly from the `entry` prop rather than storing it in local `useState`. Optimistic updates SHALL be written to `CharacterContext` via the `onQuantityChange` callback, which updates `equipmentInventory` in the context. The context update causes the parent to re-render `EquipmentCard` with the new `entry.quantity` prop.

#### Scenario: Owner adjusts unit count via stepper
- **WHEN** the owner presses + or − on the unit stepper of an ammo card
- **THEN** `quantity` is updated accordingly and the total charge display reflects the new unit count

#### Scenario: Unit − button disabled at one unit
- **WHEN** `quantity = 1`
- **THEN** the − button on the unit stepper is disabled

#### Scenario: Augmentation card shows no quantity control
- **WHEN** an augmentation item card is rendered
- **THEN** no quantity input or control is visible

#### Scenario: Context update propagates to card display
- **WHEN** `CharacterContext.equipmentInventory` is updated (e.g., by a realtime event or any other external write)
- **THEN** the `EquipmentCard` immediately displays the new quantity value without requiring local state to be reset

### Requirement: Ammo charge tracking
The system SHALL display and allow editing of ammunition charge counts per `EquipmentCard`. `currentCharges` MUST be derived directly from `entry.currentCharges` (from `CharacterContext`) rather than stored in local `useState`. Mutations SHALL be written optimistically through the `onChargesChange` callback to `CharacterContext`.

#### Scenario: Charge decrement updates display immediately
- **WHEN** the owner clicks the − charge button
- **THEN** the displayed charge count decreases immediately via the context update

#### Scenario: Reload resets charges to full
- **WHEN** the owner clicks the reload button
- **THEN** `currentCharges` is set to `null` (meaning full) and the display shows full capacity

#### Scenario: Context-driven charge update propagates to card
- **WHEN** `CharacterContext.equipmentInventory` has a charge value updated externally
- **THEN** the `EquipmentCard` displays the updated charge value without stale local state
