## MODIFIED Requirements

### Requirement: Campaign participants can view and manage a fleet of spaceships
Each campaign SHALL support zero or more shared spaceship records. Each spaceship SHALL be accessible to all campaign participants via its own URL in the campaign session layout. The DM may create, edit, and delete any ship at any time.

#### Scenario: DM views a ship's panel
- **WHEN** a DM navigates to `/campaigns/[id]/spaceship/[shipId]`
- **THEN** the spaceship stats, systems, and crew roles for that specific ship are displayed

#### Scenario: Player views a ship's panel
- **WHEN** a campaign participant who is not the DM navigates to `/campaigns/[id]/spaceship/[shipId]`
- **THEN** the spaceship stats, systems, and crew roles are displayed in the same layout as the DM view

#### Scenario: No spaceship exists yet
- **WHEN** a campaign has no spaceship records and any participant navigates to the spaceship section
- **THEN** an empty state is shown with an option (available to DM only) to create the first spaceship

#### Scenario: No spaceship exists yet — campaign overview page
- **WHEN** a campaign has no spaceship records and any participant views the campaign overview page
- **THEN** the Starship section label and an empty-state message are shown, with a "+ Add ship" link additionally shown to the DM only

