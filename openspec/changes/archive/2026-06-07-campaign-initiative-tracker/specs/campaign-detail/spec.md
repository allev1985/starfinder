## MODIFIED Requirements

### Requirement: Initiative button links to initiative tracker
The Initiative button in the Encounter section of the campaign detail page SHALL be a navigation link to `/dashboard/campaigns/[id]/initiative`. It SHALL be accessible to all campaign members (DM and players). It SHALL NOT use `cursor: default` or appear non-interactive.

#### Scenario: DM navigates to initiative tracker
- **WHEN** the DM clicks the Initiative button on the campaign detail page
- **THEN** they are navigated to `/dashboard/campaigns/[id]/initiative`

#### Scenario: Player navigates to initiative tracker
- **WHEN** a player clicks the Initiative button on the campaign detail page
- **THEN** they are navigated to `/dashboard/campaigns/[id]/initiative`
