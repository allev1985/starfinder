## Requirements

### Requirement: Campaign detail page access control
The campaign detail page SHALL only render for users who are campaign members (DM or player with a character in the campaign). Non-members SHALL be redirected to `/dashboard/campaigns`. This check is enforced by the parent `campaigns/[id]/layout.tsx` and SHALL NOT be duplicated in the page component itself.

#### Scenario: Member accesses campaign page
- **WHEN** an authenticated campaign member navigates to `/dashboard/campaigns/[id]`
- **THEN** the campaign detail page is rendered inside the two-panel layout

#### Scenario: Non-member is redirected
- **WHEN** an authenticated user who is not a campaign member navigates to `/dashboard/campaigns/[id]`
- **THEN** they are redirected to `/dashboard/campaigns` (handled by the layout)

#### Scenario: Non-existent campaign redirects
- **WHEN** an authenticated user navigates to `/dashboard/campaigns/[id]` for a campaign that does not exist
- **THEN** they are redirected to `/dashboard/campaigns` (handled by the layout)

### Requirement: Join code visible to DM only
The campaign join code SHALL be displayed on the campaign detail page only when the viewing user is the DM.

#### Scenario: DM sees join code
- **WHEN** the DM views the campaign detail page
- **THEN** the join code is displayed

#### Scenario: Player does not see join code
- **WHEN** a player (non-DM) views the campaign detail page
- **THEN** the join code is not rendered

### Requirement: Edit and Delete controls on campaign detail page
The campaign detail page SHALL display Edit and Delete buttons visible only to the DM.

#### Scenario: DM sees Edit and Delete buttons
- **WHEN** the DM views the campaign detail page
- **THEN** an Edit button linking to `/dashboard/campaigns/[id]/edit` and a Delete button are displayed

#### Scenario: Non-DM does not see Edit or Delete buttons
- **WHEN** a player views the campaign detail page
- **THEN** no Edit or Delete controls are rendered

### Requirement: Delete confirmation dialog
The Delete button on the campaign detail page SHALL trigger an AlertDialog asking the DM to confirm before the deletion proceeds.

#### Scenario: Confirmation required before delete
- **WHEN** the DM clicks the Delete button
- **THEN** an AlertDialog is shown with a confirm and cancel option before any data is changed

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

### Requirement: Initiative button links to initiative tracker
The Initiative button in the Encounter section of the campaign detail page SHALL be a navigation link to `/dashboard/campaigns/[id]/initiative`. It SHALL be accessible to all campaign members (DM and players). It SHALL NOT use `cursor: default` or appear non-interactive.

#### Scenario: DM navigates to initiative tracker
- **WHEN** the DM clicks the Initiative button on the campaign detail page
- **THEN** they are navigated to `/dashboard/campaigns/[id]/initiative`

#### Scenario: Player navigates to initiative tracker
- **WHEN** a player clicks the Initiative button on the campaign detail page
- **THEN** they are navigated to `/dashboard/campaigns/[id]/initiative`
