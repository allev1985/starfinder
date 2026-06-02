## MODIFIED Requirements

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
