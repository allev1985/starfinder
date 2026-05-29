## ADDED Requirements

### Requirement: Character queries layer
The system SHALL provide `src/db/queries/characters.ts` with typed Drizzle query functions for character operations. No business logic SHALL exist in query files.

#### Scenario: getCharactersByOwner returns owned characters
- **WHEN** `getCharactersByOwner(ownerId)` is called
- **THEN** all characters with `owner_id = ownerId` are returned

#### Scenario: createCharacter inserts a row
- **WHEN** `createCharacter(data)` is called with valid data
- **THEN** a new character row is inserted and returned

#### Scenario: updateCharacter updates name
- **WHEN** `updateCharacter(id, { name })` is called
- **THEN** the character row reflects the new name

#### Scenario: deleteCharacter removes membership rows then character
- **WHEN** `deleteCharacter(id)` is called
- **THEN** all `campaign_characters` rows for the character are deleted, then the character row is deleted

#### Scenario: getCharacterWithCampaigns returns character and joined campaigns
- **WHEN** `getCharacterWithCampaigns(characterId)` is called
- **THEN** the character row and all campaigns joined via `campaign_characters` are returned

#### Scenario: findCampaignByJoinCode returns matching campaign
- **WHEN** `findCampaignByJoinCode(code)` is called with a valid join code
- **THEN** the matching campaign row is returned

#### Scenario: findCampaignByJoinCode returns null for unknown code
- **WHEN** `findCampaignByJoinCode(code)` is called with an unknown join code
- **THEN** null is returned

#### Scenario: joinCampaign inserts campaign_characters row
- **WHEN** `joinCampaign(campaignId, characterId)` is called
- **THEN** a new `campaign_characters` row is inserted
