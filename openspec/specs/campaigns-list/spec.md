## ADDED Requirements

### Requirement: Campaigns list page
The system SHALL render a list of campaigns at `/dashboard/campaigns` for the authenticated user, showing all campaigns where they are the DM or where a character they own is a member.

#### Scenario: DM campaigns appear in list
- **WHEN** an authenticated user who is the DM of one or more campaigns visits `/dashboard/campaigns`
- **THEN** those campaigns are displayed with a "DM" role indicator

#### Scenario: Player campaigns appear in list
- **WHEN** an authenticated user has a character that is a member of a campaign
- **THEN** that campaign appears in the list with a "Player" role indicator

#### Scenario: Campaign appearing in both roles shows once as DM
- **WHEN** a user is both the DM of a campaign and has a character that is a member
- **THEN** the campaign appears once with the "DM" role indicator

#### Scenario: Empty state when no campaigns
- **WHEN** an authenticated user has no campaigns as DM and no character memberships
- **THEN** a message indicating no campaigns are found is displayed

### Requirement: Campaign list service
The system SHALL provide a `listCampaignsForUser(userId)` function in `src/services/campaigns.ts` that returns a deduplicated list of campaigns with a role label (`'dm'` or `'player'`) for each.

#### Scenario: Service merges DM and player campaigns
- **WHEN** `listCampaignsForUser` is called for a user who is DM of one campaign and player in another
- **THEN** both campaigns are returned, each with the correct role label

#### Scenario: Service deduplicates on collision
- **WHEN** the same campaign appears in both the DM and player result sets
- **THEN** it is returned once with role `'dm'`
