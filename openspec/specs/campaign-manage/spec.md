## ADDED Requirements

### Requirement: isCampaignDm authorization utility
The system SHALL provide `isCampaignDm(campaignId, userId)` in `src/lib/authorization.ts` that returns true only when the user is the DM of the specified campaign.

#### Scenario: DM passes check
- **WHEN** `isCampaignDm` is called with the campaign's dm_id
- **THEN** true is returned

#### Scenario: Non-DM participant fails check
- **WHEN** `isCampaignDm` is called for a user who owns a character in the campaign but is not the DM
- **THEN** false is returned

### Requirement: Edit campaign page
The system SHALL provide a page at `/dashboard/campaigns/[id]/edit` accessible only to the campaign DM, with a form to update the campaign name and a button to regenerate the join code.

#### Scenario: Non-DM redirected from edit page
- **WHEN** a non-DM campaign participant navigates to `/dashboard/campaigns/[id]/edit`
- **THEN** they are redirected to `/dashboard/campaigns/[id]`

#### Scenario: DM updates campaign name
- **WHEN** the DM submits a valid new name on the edit page
- **THEN** the campaign name is updated and the DM is redirected to `/dashboard/campaigns/[id]`

#### Scenario: Empty name rejected on edit
- **WHEN** the DM submits an empty or whitespace-only name
- **THEN** the name is not updated and an inline error is displayed

#### Scenario: DM regenerates join code
- **WHEN** the DM clicks "Regenerate join code"
- **THEN** a new unique join code is generated and the page reflects the new code

### Requirement: Delete campaign
The system SHALL allow the DM to delete a campaign from the campaign detail page. A confirmation dialog SHALL be shown before deletion proceeds.

#### Scenario: DM confirms deletion
- **WHEN** the DM confirms the delete dialog
- **THEN** the campaign and all its campaign_characters rows are deleted and the DM is redirected to `/dashboard/campaigns`

#### Scenario: DM cancels deletion
- **WHEN** the DM dismisses the delete dialog without confirming
- **THEN** no data is changed

#### Scenario: Non-DM cannot delete
- **WHEN** a non-DM user attempts to invoke the delete action
- **THEN** the action returns an error and no data is changed
