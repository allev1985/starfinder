## Requirements

### Requirement: Campaign sidebar lists all ships individually
The campaign session sidebar SHALL render a "Spaceship" section that lists each ship in the campaign by name, one entry per ship. Clicking a ship name SHALL navigate to that ship's editor. A "Add ship" entry SHALL always appear at the bottom of the section (DM only).

#### Scenario: Campaign has multiple ships
- **WHEN** a participant views the campaign sidebar and the campaign has two or more ships
- **THEN** each ship appears as a separate named link in the Spaceship section of the sidebar

#### Scenario: Campaign has no ships
- **WHEN** a participant views the campaign sidebar and the campaign has no ships
- **THEN** the Spaceship section shows no ship entries; the DM sees an "Add ship" link and non-DM participants see no entries

#### Scenario: Active ship is highlighted
- **WHEN** a participant is viewing a specific ship's editor
- **THEN** that ship's sidebar entry is visually highlighted (active state) matching the character sidebar pattern

### Requirement: Each ship has a dedicated bookmarkable URL
Every ship in a campaign SHALL be accessible at `/campaigns/[id]/spaceship/[shipId]`. The ship editor SHALL render at this URL.

#### Scenario: Participant navigates directly to a ship URL
- **WHEN** any campaign participant loads `/campaigns/[id]/spaceship/[shipId]`
- **THEN** the editor for that specific ship is displayed

#### Scenario: Ship URL for a ship not in the campaign returns 404
- **WHEN** a participant loads a `/campaigns/[id]/spaceship/[shipId]` URL where `shipId` does not belong to the campaign
- **THEN** the page returns a not-found response

### Requirement: Fleet root redirects to first ship or shows empty state
The route `/campaigns/[id]/spaceship` SHALL redirect to the first ship (ordered by `created_at` ascending) if any ships exist. If no ships exist, it SHALL display an empty state with an option for the DM to add a ship.

#### Scenario: Campaign has at least one ship
- **WHEN** any participant navigates to `/campaigns/[id]/spaceship`
- **THEN** they are redirected to `/campaigns/[id]/spaceship/[firstShipId]`

#### Scenario: Campaign has no ships — DM view
- **WHEN** the DM navigates to `/campaigns/[id]/spaceship` and no ships exist
- **THEN** an empty state is displayed with a "Create spaceship" action

#### Scenario: Campaign has no ships — non-DM view
- **WHEN** a non-DM participant navigates to `/campaigns/[id]/spaceship` and no ships exist
- **THEN** an empty state is displayed with no create action

### Requirement: DM can add ships at any time
The DM SHALL be able to create additional ships for a campaign at any point, even when ships already exist.

#### Scenario: DM adds a second ship
- **WHEN** the DM uses the "Add ship" action in the sidebar or landing page and submits a valid ship name
- **THEN** a new ship record is created, the sidebar updates to include the new ship, and the DM is navigated to the new ship's editor

### Requirement: Crew assignments are per-ship and non-exclusive
A character MAY be assigned to the crew of multiple ships simultaneously. The system SHALL not enforce exclusivity across ships.

#### Scenario: Character assigned to two ships
- **WHEN** the DM assigns a character to Ship A and also assigns the same character to Ship B
- **THEN** both assignments are persisted without error; the character appears in the crew list of both ships
