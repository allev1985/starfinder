## MODIFIED Requirements

### Requirement: Campaign creation via Server Action
The system SHALL process campaign creation through a Server Action that reads the authenticated user's id as the DM, generates a join code, sets `edition_id` to the Starfinder 1e edition UUID, and persists the campaign. No edition picker is shown to the user.

#### Scenario: Successful campaign creation
- **WHEN** a valid campaign name is submitted
- **THEN** the campaign is created with the current user as DM, a generated join code, `edition_id` set to the 1e UUID, and the user is redirected to `/dashboard/campaigns`

#### Scenario: Empty name rejected
- **WHEN** an empty or blank campaign name is submitted
- **THEN** the campaign is not created and an inline error is displayed

#### Scenario: Unauthenticated submission rejected
- **WHEN** a campaign creation is attempted without a valid session
- **THEN** the Server Action returns an error and no campaign is created
