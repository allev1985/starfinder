## ADDED Requirements

### Requirement: Campaign characters can be assigned to crew roles on a spaceship
The system SHALL support assigning campaign characters to the following crew roles: `captain`, `pilot`, `engineer`, `gunner`, `science_officer`. Assignments SHALL be persisted in a `spaceship_crew` table linked to the spaceship. A character MAY hold multiple roles simultaneously.

#### Scenario: Assign a character to a multi-slot role
- **WHEN** a user selects a campaign character and clicks Add for engineer, gunner, or science_officer
- **THEN** a new row is inserted in `spaceship_crew` with the given character_id and role, and the character's name appears in that role group in the UI

#### Scenario: Remove a character from a role
- **WHEN** a user clicks the remove button next to a character in a role group
- **THEN** the corresponding `spaceship_crew` row is deleted and the character no longer appears in that role group

#### Scenario: Assign a character to a second role
- **WHEN** a user assigns a character who already holds one role to a different role
- **THEN** a second row is inserted in `spaceship_crew` and the character appears in both role groups

### Requirement: Captain and pilot roles are limited to one character each
The database SHALL enforce that at most one character holds the `captain` role per spaceship, and at most one character holds the `pilot` role per spaceship, via a partial unique index on `(spaceship_id, role)` where role is `captain` or `pilot`.

#### Scenario: Assign a captain when none exists
- **WHEN** no character is assigned as captain and a user selects a character for the captain role
- **THEN** the assignment is saved and the character's name appears in the Captain slot

#### Scenario: Replace the current captain
- **WHEN** a character is already assigned as captain and a user selects a different character for the captain role
- **THEN** the previous captain assignment is deleted, the new one is inserted, and only the new character appears in the Captain slot

#### Scenario: Pilot follows the same singleton rule
- **WHEN** a character is assigned as pilot
- **THEN** the database enforces at most one pilot per spaceship with the same replace behavior as captain

### Requirement: Crew section displays assigned characters grouped by role
The crew UI section SHALL display five role groups: Captain, Pilot, Engineers, Gunners, Science Officers. Each group SHALL show the names of currently assigned characters. Singleton roles (captain, pilot) SHALL use a select dropdown populated with campaign characters. Multi-slot roles SHALL use a select dropdown to add additional members, with each member shown as a removable chip or row.

#### Scenario: No crew assigned yet
- **WHEN** no crew assignments exist for the spaceship
- **THEN** all role groups are shown with empty state and selection controls

#### Scenario: Crew section shows current assignments on page load
- **WHEN** the spaceship page loads
- **THEN** existing crew assignments are fetched and each character's name appears in the correct role group
