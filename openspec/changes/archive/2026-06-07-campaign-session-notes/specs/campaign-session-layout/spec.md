## ADDED Requirements

### Requirement: Sidebar shows Sessions section
The campaign sidebar SHALL include a Sessions navigation entry below the Spaceship section. The entry SHALL link to `/dashboard/campaigns/[id]/sessions` and SHALL be visually distinguished when any route under `/dashboard/campaigns/[id]/sessions` is active.

#### Scenario: Participant navigates to sessions via sidebar
- **WHEN** any campaign participant clicks the Sessions entry in the sidebar
- **THEN** the sessions list loads in the main content area and the sidebar remains mounted

#### Scenario: Sessions entry is highlighted when active
- **WHEN** the current URL matches `/dashboard/campaigns/[id]/sessions` or any sub-route beneath it
- **THEN** the Sessions sidebar entry is rendered in an active/highlighted state

#### Scenario: Sessions entry is not highlighted on other routes
- **WHEN** the current URL does not match any sessions route
- **THEN** the Sessions sidebar entry is rendered in its default (non-highlighted) state
