## ADDED Requirements

### Requirement: Persistent dashboard layout
The system SHALL wrap all `/dashboard/*` routes in a shared layout containing a top navigation bar and a content area below it.

#### Scenario: Layout applies to all dashboard routes
- **WHEN** a user navigates to any route under `/dashboard`
- **THEN** the top navigation bar is visible and the route's page content renders below it

### Requirement: Top bar app identity
The top navigation bar SHALL display the application name on the left side as a link to `/dashboard`.

#### Scenario: App name visible in top bar
- **WHEN** a user views any dashboard page
- **THEN** the application name is shown on the left of the top bar

### Requirement: Campaigns navigation item
The top bar SHALL include a Campaigns item that links to `/dashboard/campaigns` and provides a dropdown with a "Create new" option linking to `/dashboard/campaigns/new`.

#### Scenario: Campaigns label navigates to list
- **WHEN** a user clicks the "Campaigns" label
- **THEN** they are navigated to `/dashboard/campaigns`

#### Scenario: Campaigns dropdown reveals create option
- **WHEN** a user clicks the chevron next to "Campaigns"
- **THEN** a dropdown appears with a "Create new" option linking to `/dashboard/campaigns/new`

### Requirement: Characters navigation item
The top bar SHALL include a Characters item that links to `/dashboard/characters` and provides a dropdown with a "Create new" option linking to `/dashboard/characters/new`.

#### Scenario: Characters label navigates to list
- **WHEN** a user clicks the "Characters" label
- **THEN** they are navigated to `/dashboard/characters`

#### Scenario: Characters dropdown reveals create option
- **WHEN** a user clicks the chevron next to "Characters"
- **THEN** a dropdown appears with a "Create new" option linking to `/dashboard/characters/new`

### Requirement: Sign out in top bar
The top bar SHALL include a sign-out control on the right side that ends the user's session and redirects to `/`.

#### Scenario: Sign out clears session
- **WHEN** a user clicks "Sign out" in the top bar
- **THEN** the session is ended and the user is redirected to `/`

### Requirement: Campaigns stub page
The system SHALL serve a stub page at `/dashboard/campaigns`.

#### Scenario: Campaigns page renders
- **WHEN** an authenticated user navigates to `/dashboard/campaigns`
- **THEN** a page is rendered within the dashboard layout

### Requirement: Characters stub page
The system SHALL serve a stub page at `/dashboard/characters`.

#### Scenario: Characters page renders
- **WHEN** an authenticated user navigates to `/dashboard/characters`
- **THEN** a page is rendered within the dashboard layout
