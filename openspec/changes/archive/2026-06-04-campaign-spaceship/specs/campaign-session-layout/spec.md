## ADDED Requirements

### Requirement: Sidebar shows Spaceship section
The campaign sidebar SHALL include a "Spaceship" section below the Characters section. The section SHALL link to `/dashboard/campaigns/[id]/spaceship` with label reflecting ship state.

#### Scenario: No ship exists
- **WHEN** the campaign has no spaceship
- **THEN** the sidebar shows a "Create spaceship" link pointing to `/dashboard/campaigns/[id]/spaceship`

#### Scenario: Ship exists
- **WHEN** the campaign has a spaceship
- **THEN** the sidebar shows the ship name as a navigation link pointing to `/dashboard/campaigns/[id]/spaceship`

#### Scenario: Active highlight on spaceship page
- **WHEN** the current URL is `/dashboard/campaigns/[id]/spaceship`
- **THEN** the spaceship sidebar entry is rendered in the active/highlighted state consistent with the character link active style
