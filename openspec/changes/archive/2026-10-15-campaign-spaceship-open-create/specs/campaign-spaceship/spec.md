## MODIFIED Requirements

### Requirement: Campaign participants can view and manage a fleet of spaceships
Each campaign SHALL support zero or more shared spaceship records. Each spaceship SHALL be accessible to all campaign participants via its own URL in the campaign session layout. Any campaign participant may create, edit, and delete any ship at any time.

#### Scenario: DM views a ship's panel
- **WHEN** a DM navigates to `/campaigns/[id]/spaceship/[shipId]`
- **THEN** the spaceship stats, systems, and crew roles for that specific ship are displayed

#### Scenario: Player views a ship's panel
- **WHEN** a campaign participant who is not the DM navigates to `/campaigns/[id]/spaceship/[shipId]`
- **THEN** the spaceship stats, systems, and crew roles are displayed in the same layout as the DM view

#### Scenario: No spaceship exists yet
- **WHEN** a campaign has no spaceship records and any participant navigates to the spaceship section
- **THEN** an empty state is shown with an option, available to any participant, to create the first spaceship

#### Scenario: No spaceship exists yet — campaign overview page
- **WHEN** a campaign has no spaceship records and any participant views the campaign overview page
- **THEN** the Starship section label and an empty-state message are shown, with a "+ Add ship" link shown to any participant

### Requirement: Spaceship section is accessible from the campaign sidebar as a fleet list
The campaign session sidebar SHALL include a "Spaceship" section listing all ships in the campaign by name. Each entry links to that ship's editor URL. An "Add ship" entry, available to any campaign participant, appears at the bottom of the section.

#### Scenario: Participant clicks a ship in the sidebar
- **WHEN** any campaign participant clicks a ship entry in the sidebar
- **THEN** that ship's editor loads in the main content area and the sidebar entry becomes active

## REMOVED Requirements

### Requirement: Only the DM can create or edit the spaceship
**Reason**: Replaced by "Any campaign participant can create, edit, or delete the spaceship" — edit/delete were already unrestricted in the implementation (only the written spec claimed otherwise), and creation is no longer GM-only either.
**Migration**: No data migration needed. UI gates that redirected non-GM participants away from spaceship creation have been removed.

## ADDED Requirements

### Requirement: Any campaign participant can create, edit, or delete the spaceship
Any campaign participant — the GM or a user who owns a character in the campaign — SHALL be able to create a new spaceship, and edit or delete any spaceship in the campaign. There is no read-only mode for non-GM participants.

#### Scenario: Non-GM participant creates a ship
- **WHEN** a campaign participant who is not the GM navigates to the spaceship creation flow
- **THEN** they can submit a name and a new spaceship is created for the campaign

#### Scenario: Non-GM participant edits a field
- **WHEN** a non-GM participant views a spaceship's panel
- **THEN** all fields are interactive and save via the standard debounced onChange pattern (600 ms), identical to the GM's experience

#### Scenario: Non-GM participant deletes a ship
- **WHEN** a non-GM participant confirms the delete dialog for a spaceship
- **THEN** the spaceship is deleted, identical to the GM's experience

#### Scenario: Non-participant cannot access
- **WHEN** a user who is not a participant in the campaign (not the GM, no character in the campaign) attempts to view or mutate a spaceship
- **THEN** access is denied, per the existing `isCampaignParticipant` check already enforced by the campaign layout and every spaceship server action
