## ADDED Requirements

### Requirement: getCampaignsForUser query
The system SHALL provide a `getCampaignsForUser(userId)` function in `src/db/queries/campaigns.ts` that returns two arrays: the campaigns where the user is DM, and the campaigns where any character owned by the user is a `campaign_characters` member.

#### Scenario: Returns DM campaigns
- **WHEN** `getCampaignsForUser` is called for a user who is DM of campaigns
- **THEN** those campaigns are included in the DM result set

#### Scenario: Returns player campaigns via character membership
- **WHEN** `getCampaignsForUser` is called for a user who owns a character that is in `campaign_characters`
- **THEN** the associated campaign is included in the player result set

#### Scenario: No cross-contamination between result sets
- **WHEN** `getCampaignsForUser` is called
- **THEN** DM campaigns and player campaigns are returned as separate arrays, not merged
