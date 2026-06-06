## ADDED Requirements

### Requirement: Each firing arc displays a list of weapons and an add form
The spaceship editor SHALL display a Weapons section divided into four arcs: Forward, Port, Starboard, and Aft. Each arc SHALL show all weapons assigned to it in insertion order, and SHALL provide an inline form to add a new weapon.

#### Scenario: No weapons exist for an arc
- **WHEN** a spaceship has no weapons in a given arc
- **THEN** that arc shows an empty list and an add form

#### Scenario: Weapons are listed in insertion order
- **WHEN** multiple weapons exist for an arc
- **THEN** they are displayed in the order they were added, oldest first

#### Scenario: Weapon list shows all four fields
- **WHEN** a weapon exists with Name, Damage, Range, and Special values
- **THEN** all four values are displayed in the weapon row

### Requirement: A weapon is added via inline form with four free-text fields
Each arc's add form SHALL contain four inputs — Name (required), Damage, Range, and Special — all free text. Submitting the form SHALL persist a new weapon row linked to the spaceship and arc, then immediately display it in the list without a page reload.

#### Scenario: User submits a weapon with name only
- **WHEN** the user enters a name and leaves Damage, Range, and Special blank, then submits
- **THEN** a weapon row is created with the given name and null values for the other fields, and it appears in the arc list

#### Scenario: User submits a fully filled weapon
- **WHEN** the user fills all four fields and submits
- **THEN** a weapon row is created with all four values and displayed in the arc list

#### Scenario: Submit with empty name is blocked
- **WHEN** the user attempts to submit the add form with no name entered
- **THEN** the weapon is not created and the form remains open

#### Scenario: Add form clears after successful submit
- **WHEN** a weapon is successfully added
- **THEN** all four input fields reset to empty

### Requirement: A weapon can be deleted from its arc list
Each weapon row SHALL display a delete control. Activating it SHALL remove the weapon immediately from the list and delete the record from the database.

#### Scenario: User deletes a weapon
- **WHEN** the user activates the delete control on a weapon row
- **THEN** the weapon is removed from the list immediately and the database record is deleted

### Requirement: All campaign participants can manage weapons
Any authenticated campaign participant (DM or player) SHALL be able to add and delete weapons. There is no read-only mode for the weapons section.

#### Scenario: Player adds a weapon
- **WHEN** a non-DM campaign participant adds a weapon to an arc
- **THEN** the weapon is saved and displayed in the list
