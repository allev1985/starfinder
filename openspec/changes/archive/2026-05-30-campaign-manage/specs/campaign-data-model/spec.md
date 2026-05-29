## ADDED Requirements

### Requirement: updateCampaign query
The system SHALL provide `updateCampaign(campaignId, data: { name: string })` in `src/db/queries/campaigns.ts` that updates the campaign name and returns the updated row. The DM field SHALL NOT be updatable via this function.

#### Scenario: Name is updated
- **WHEN** `updateCampaign` is called with a valid new name
- **THEN** the campaign row reflects the new name and the updated campaign is returned

### Requirement: regenerateJoinCode query
The system SHALL provide `regenerateJoinCode(campaignId)` in `src/db/queries/campaigns.ts` that generates a new unique join code, updates the campaign row, and returns the new code.

#### Scenario: Join code is replaced
- **WHEN** `regenerateJoinCode` is called
- **THEN** the campaign row has a new join_code value distinct from the previous one

### Requirement: deleteCampaign query
The system SHALL provide `deleteCampaign(campaignId)` in `src/db/queries/campaigns.ts` that deletes all `campaign_characters` rows for the campaign and then deletes the campaign row.

#### Scenario: Campaign and members deleted
- **WHEN** `deleteCampaign` is called
- **THEN** all campaign_characters rows for that campaign are removed and the campaign row is deleted
