## ADDED Requirements

### Requirement: One spaceship per campaign
A campaign SHALL have at most one spaceship. The database SHALL enforce this with a unique constraint on `spaceships.campaign_id`.

#### Scenario: First spaceship created
- **WHEN** a participant creates a spaceship for a campaign that has none
- **THEN** a new row is inserted into `spaceships` linked to that campaign

#### Scenario: Second create attempt is rejected at DB level
- **WHEN** a spaceship row already exists for a campaign and another insert is attempted
- **THEN** the database rejects the insert with a unique constraint violation

### Requirement: Any participant can create the campaign spaceship
Any authenticated user who is a participant (DM or player) in a campaign SHALL be able to create a spaceship for that campaign if one does not yet exist.

#### Scenario: DM creates spaceship
- **WHEN** the DM of a campaign submits a valid name
- **THEN** the spaceship is created and the ship page shows the ship name with editing enabled

#### Scenario: Player creates spaceship
- **WHEN** a player participant submits a valid name
- **THEN** the spaceship is created and the ship page shows the ship name with editing enabled

#### Scenario: Non-participant cannot reach the page
- **WHEN** a user who is not a campaign participant navigates to `/dashboard/campaigns/[id]/spaceship`
- **THEN** they are redirected (handled by campaign layout auth)

### Requirement: Spaceship name is required
A spaceship SHALL require a non-empty name. The create and update forms SHALL not submit without a name value.

#### Scenario: Empty name is rejected
- **WHEN** a participant submits the create or edit form with an empty name
- **THEN** the form does not submit

### Requirement: Any participant can rename the spaceship
Any campaign participant SHALL be able to update the spaceship name via inline editing on the spaceship page.

#### Scenario: Participant edits name
- **WHEN** a participant changes the name in the inline input
- **THEN** the name is saved automatically after a 600 ms debounce with no explicit save button

### Requirement: Spaceship page handles both states
The `/dashboard/campaigns/[id]/spaceship` route SHALL render a create form when no ship exists and an inline-editable name when one does.

#### Scenario: No ship exists
- **WHEN** a participant navigates to the spaceship page and no ship exists
- **THEN** a create form is shown with a name input and submit button

#### Scenario: Ship exists
- **WHEN** a participant navigates to the spaceship page and a ship exists
- **THEN** the ship name is shown in an editable input field with no separate save button
