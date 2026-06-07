## ADDED Requirements

### Requirement: Active conditions are displayed on the character sheet
The character sheet SHALL display a `ConditionsSection` immediately after the health/resolve section. When the character has active conditions, each SHALL be shown as a chip with the condition name and a remove button (owner only). When no conditions are active, an empty state with an "Add Condition" prompt SHALL be shown.

#### Scenario: Active conditions shown as chips
- **WHEN** a character has one or more active conditions
- **THEN** each condition name appears as a chip in the conditions section

#### Scenario: Empty state when no conditions active
- **WHEN** a character has no active conditions
- **THEN** the conditions section shows an empty state with an "Add Condition" prompt

#### Scenario: Non-owner sees active conditions but cannot remove them
- **WHEN** a campaign participant who does not own the character views the sheet
- **THEN** active condition chips are visible but the remove button is not shown

### Requirement: Condition description is shown in a Popover
Each active condition chip SHALL have a trigger (info icon or tap on the chip itself) that opens a Popover displaying the condition's description text.

#### Scenario: Popover opens on tap/click
- **WHEN** a user taps or clicks the info trigger on a condition chip
- **THEN** a Popover opens showing the condition's full description

#### Scenario: Popover closes on tap-outside
- **WHEN** a user taps outside the open Popover
- **THEN** the Popover closes

### Requirement: Owner can toggle conditions via a dialog
An "+ Add" button (owner only) SHALL open a dialog listing all conditions for the character's edition. Each condition SHALL show its name and description. Active conditions SHALL be visually distinguished (checked / filled). Tapping a condition SHALL immediately toggle it on or off and persist the change.

#### Scenario: Add dialog opens with all conditions
- **WHEN** owner taps "+ Add" in the conditions section
- **THEN** a dialog opens listing all conditions for the edition

#### Scenario: Active conditions are visually marked in the dialog
- **WHEN** the add-condition dialog opens
- **THEN** conditions the character currently has are shown as checked/active

#### Scenario: Toggling a condition on persists it
- **WHEN** owner selects an inactive condition in the dialog
- **THEN** the condition is added to the character's active conditions and the chip appears on the sheet

#### Scenario: Toggling a condition off persists removal
- **WHEN** owner deselects an active condition in the dialog
- **THEN** the condition is removed from the character's active conditions and its chip disappears

#### Scenario: Removing a chip directly removes the condition
- **WHEN** owner taps the × button on an active condition chip
- **THEN** the condition is removed immediately without a confirmation dialog

### Requirement: Conditions state is managed via CharacterContext
`CharacterContext` SHALL expose `activeConditions: Condition[]` and `setActiveConditions: (conditions: Condition[]) => void`. The character sheet page SHALL fetch active conditions server-side and pass them as `initialActiveConditions` to `CharacterProvider`.

#### Scenario: Initial active conditions loaded from server
- **WHEN** the character sheet page renders
- **THEN** any conditions previously toggled on are immediately visible without a client-side fetch

### Requirement: Condition toggles are saved via server actions
Toggling a condition on/off SHALL call a server action (`toggleConditionAction`) that inserts or deletes the appropriate `character_conditions` row. No debounce is needed — each toggle is an immediate discrete action.

#### Scenario: Toggle insert on activation
- **WHEN** a condition is toggled on
- **THEN** a row is inserted into `character_conditions` for the character

#### Scenario: Toggle delete on deactivation
- **WHEN** a condition is toggled off
- **THEN** the corresponding `character_conditions` row is deleted
