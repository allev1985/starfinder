## Requirements

### Requirement: Sessions list page at /campaigns/[id]/sessions
The system SHALL provide a page at `/dashboard/campaigns/[id]/sessions` that lists all sessions for the campaign, sorted newest first. The page SHALL be accessible to any campaign participant.

#### Scenario: Sessions exist
- **WHEN** a campaign participant navigates to the sessions list page
- **THEN** all sessions for the campaign are shown, each displaying its title, optional session number, and optional date, sorted newest first

#### Scenario: No sessions yet
- **WHEN** a campaign participant navigates to the sessions list page and no sessions exist
- **THEN** an empty state message is shown with a prompt to create the first session

### Requirement: Any participant can create a session
The sessions list page SHALL include a button to create a new session. Any campaign participant (DM or player) SHALL be able to create a session.

#### Scenario: Participant creates a session
- **WHEN** a campaign participant submits the create-session form with a title
- **THEN** a new session row is inserted and the participant is redirected to the session detail page

#### Scenario: Title is required
- **WHEN** a participant attempts to create a session with an empty title
- **THEN** the form prevents submission and shows a validation message

### Requirement: Session list entries link to the detail page
Each session entry in the list SHALL be a link to `/dashboard/campaigns/[id]/sessions/[sessionId]`.

#### Scenario: Participant clicks a session
- **WHEN** a campaign participant clicks a session entry in the list
- **THEN** they are navigated to that session's detail page

### Requirement: Campaign overview "Session notes" tile links to sessions list
The existing "Session notes" tile on the campaign overview page SHALL navigate to `/dashboard/campaigns/[id]/sessions` when clicked.

#### Scenario: Participant clicks the Session notes tile
- **WHEN** any campaign participant clicks the "Session notes" tile on the campaign overview
- **THEN** they are navigated to `/dashboard/campaigns/[id]/sessions`
