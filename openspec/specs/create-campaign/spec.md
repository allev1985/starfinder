## ADDED Requirements

### Requirement: Create campaign form
The system SHALL provide a form at `/dashboard/campaigns/new` where an authenticated user can create a new campaign by entering a name.

#### Scenario: Form renders for authenticated user
- **WHEN** an authenticated user navigates to `/dashboard/campaigns/new`
- **THEN** a form with a campaign name input and submit button is displayed

### Requirement: Campaign creation via Server Action
The system SHALL process campaign creation through a Server Action that reads the authenticated user's id as the DM, generates a join code, and persists the campaign.

#### Scenario: Successful campaign creation
- **WHEN** a valid campaign name is submitted
- **THEN** the campaign is created with the current user as DM, a generated join code is assigned, and the user is redirected to `/dashboard/campaigns`

#### Scenario: Empty name rejected
- **WHEN** an empty or blank campaign name is submitted
- **THEN** the campaign is not created and an inline error is displayed

#### Scenario: Unauthenticated submission rejected
- **WHEN** a campaign creation is attempted without a valid session
- **THEN** the Server Action returns an error and no campaign is created

### Requirement: Campaign name is required
The campaign name field SHALL be required and non-empty. Validation SHALL occur in the Server Action before any database operation.

#### Scenario: Whitespace-only name rejected
- **WHEN** a name consisting only of whitespace is submitted
- **THEN** the Server Action returns a validation error and no row is inserted
