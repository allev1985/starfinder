## Requirements

### Requirement: Campaign routes share a persistent two-panel layout
All routes under `/dashboard/campaigns/[id]/` SHALL render within a two-panel layout consisting of a fixed-width sidebar on the left and a main content area on the right. The sidebar SHALL remain visible and mounted while navigating between character sheets or returning to the campaign overview.

#### Scenario: Navigating from overview to a character sheet
- **WHEN** a campaign participant clicks a character in the sidebar
- **THEN** the character sheet loads in the main content area and the sidebar remains visible without a full page reload

#### Scenario: Navigating between character sheets
- **WHEN** a campaign participant clicks a different character in the sidebar while viewing a character sheet
- **THEN** the new character sheet loads in the main content area and the sidebar stays mounted

### Requirement: Sidebar lists all campaign characters with active highlight
The campaign sidebar SHALL display the names of all characters in the campaign as navigation links. The link for the currently viewed character SHALL be visually distinguished from the others.

#### Scenario: Character is selected
- **WHEN** the current URL matches `/dashboard/campaigns/[id]/characters/[characterId]`
- **THEN** the sidebar entry for that character is rendered in an active/highlighted state

#### Scenario: No character is selected (campaign overview)
- **WHEN** the current URL is `/dashboard/campaigns/[id]`
- **THEN** no character entry in the sidebar is highlighted

### Requirement: Layout owns campaign participant auth
The two-panel layout SHALL verify that the authenticated user is a campaign participant before rendering any child content. Non-participants and unauthenticated users SHALL be redirected.

#### Scenario: Non-participant is redirected
- **WHEN** a user who is not a campaign participant navigates to any route under `/dashboard/campaigns/[id]/`
- **THEN** they are redirected to `/dashboard/campaigns`

#### Scenario: Unauthenticated user is redirected
- **WHEN** an unauthenticated user navigates to any route under `/dashboard/campaigns/[id]/`
- **THEN** they are redirected to `/`
