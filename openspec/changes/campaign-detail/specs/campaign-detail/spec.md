## ADDED Requirements

### Requirement: Campaign detail page access control
The system SHALL only render the campaign detail page for users who are campaign members (DM or player with a character in the campaign). Non-members SHALL be redirected to `/dashboard/campaigns`.

#### Scenario: Member accesses campaign page
- **WHEN** an authenticated campaign member navigates to `/dashboard/campaigns/[id]`
- **THEN** the campaign detail page is rendered

#### Scenario: Non-member is redirected
- **WHEN** an authenticated user who is not a campaign member navigates to `/dashboard/campaigns/[id]`
- **THEN** they are redirected to `/dashboard/campaigns`

#### Scenario: Non-existent campaign redirects
- **WHEN** an authenticated user navigates to `/dashboard/campaigns/[id]` for a campaign that does not exist
- **THEN** they are redirected to `/dashboard/campaigns`

### Requirement: Campaign detail page roster
The campaign detail page SHALL display the campaign name and a list of all characters joined to the campaign, each linking to their character detail page.

#### Scenario: Character roster is shown
- **WHEN** a campaign member views the campaign detail page
- **THEN** all characters in `campaign_characters` for that campaign are listed by name

#### Scenario: Each character links to their detail page
- **WHEN** a campaign member clicks a character name
- **THEN** they are navigated to `/dashboard/campaigns/[id]/characters/[characterId]`

### Requirement: Join code visible to DM only
The campaign join code SHALL be displayed on the campaign detail page only when the viewing user is the DM.

#### Scenario: DM sees join code
- **WHEN** the DM views the campaign detail page
- **THEN** the join code is displayed

#### Scenario: Player does not see join code
- **WHEN** a player (non-DM) views the campaign detail page
- **THEN** the join code is not rendered

### Requirement: Character detail page access control
The character detail page at `/dashboard/campaigns/[id]/characters/[characterId]` SHALL only be accessible to campaign members. Non-members SHALL be redirected to `/dashboard/campaigns`.

#### Scenario: Campaign member accesses character page
- **WHEN** an authenticated campaign member navigates to a character detail page within that campaign
- **THEN** the character detail page is rendered

#### Scenario: Non-member is redirected from character page
- **WHEN** an authenticated user who is not a campaign member navigates to a character detail page
- **THEN** they are redirected to `/dashboard/campaigns`

### Requirement: Character detail page content
The character detail page SHALL display the character's name. Additional character sheet content is deferred to a future change.

#### Scenario: Character name is shown
- **WHEN** a campaign member views a character detail page
- **THEN** the character's name is displayed
