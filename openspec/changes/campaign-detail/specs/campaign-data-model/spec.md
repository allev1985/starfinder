## ADDED Requirements

### Requirement: getCampaignWithCharacters query
The system SHALL provide a `getCampaignWithCharacters(campaignId)` function in `src/db/queries/campaigns.ts` that returns the campaign row and all characters joined to it via `campaign_characters`.

#### Scenario: Returns campaign and characters
- **WHEN** `getCampaignWithCharacters` is called with a valid campaign id
- **THEN** the campaign row and all joined character rows are returned

#### Scenario: Returns null for unknown campaign
- **WHEN** `getCampaignWithCharacters` is called with an id that does not exist
- **THEN** null is returned for the campaign

### Requirement: isCampaignMember query
The system SHALL provide an `isCampaignMember(campaignId, userId)` function in `src/db/queries/campaigns.ts` that returns true if the user is the campaign DM or owns a character in `campaign_characters` for that campaign.

#### Scenario: DM is a member
- **WHEN** `isCampaignMember` is called with the campaign's dm_id
- **THEN** true is returned

#### Scenario: Character owner is a member
- **WHEN** `isCampaignMember` is called for a user who owns a character in the campaign
- **THEN** true is returned

#### Scenario: Unrelated user is not a member
- **WHEN** `isCampaignMember` is called for a user with no connection to the campaign
- **THEN** false is returned
