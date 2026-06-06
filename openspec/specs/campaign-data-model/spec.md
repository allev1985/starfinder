## ADDED Requirements

### Requirement: Campaigns table
The system SHALL define a `campaigns` table with columns: `id` (uuid PK, default `gen_random_uuid()`), `name` (text, not null), `dm_id` (uuid, not null), `join_code` (text, not null, unique), `created_at` (timestamptz, default now()).

#### Scenario: Campaign row is created
- **WHEN** a valid campaign insert is executed
- **THEN** a row exists in `campaigns` with a generated uuid, the provided name, the DM's user id, a unique join code, and a created_at timestamp

#### Scenario: Duplicate join code is rejected
- **WHEN** an insert is attempted with a `join_code` that already exists in the table
- **THEN** the database rejects the insert with a unique constraint violation

### Requirement: Characters table
The system SHALL define a `characters` table with columns: `id` (uuid PK, default `gen_random_uuid()`), `name` (text, not null), `owner_id` (uuid, not null), `created_at` (timestamptz, default now()).

#### Scenario: Character row is created
- **WHEN** a valid character insert is executed
- **THEN** a row exists in `characters` with a generated uuid, the provided name, the owner's user id, and a created_at timestamp

### Requirement: Campaign characters join table
The system SHALL define a `campaign_characters` table with columns: `campaign_id` (uuid, not null, FK → campaigns.id), `character_id` (uuid, not null, FK → characters.id), `joined_at` (timestamptz, default now()). The primary key SHALL be the composite `(campaign_id, character_id)`.

#### Scenario: Character joined to campaign
- **WHEN** a valid row is inserted into `campaign_characters`
- **THEN** the row links the campaign and character with a joined_at timestamp

#### Scenario: Duplicate membership rejected
- **WHEN** the same `(campaign_id, character_id)` pair is inserted a second time
- **THEN** the database rejects the insert with a primary key violation

### Requirement: Queries data access layer
The system SHALL provide `src/db/queries/campaigns.ts` exposing typed Drizzle query functions. No business logic SHALL exist in query files — only database operations.

#### Scenario: createCampaign inserts a row
- **WHEN** `createCampaign` is called with valid campaign data
- **THEN** a new row is inserted and the created campaign is returned

#### Scenario: getCampaignsByDm returns campaigns for a user
- **WHEN** `getCampaignsByDm` is called with a user id
- **THEN** all campaigns where `dm_id` matches are returned

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

### Requirement: getCampaignWithCharacters query
The system SHALL provide a `getCampaignWithCharacters(campaignId)` function in `src/db/queries/campaigns.ts` that returns the campaign row and all characters joined to it via `campaign_characters`.

#### Scenario: Returns campaign and characters
- **WHEN** `getCampaignWithCharacters` is called with a valid campaign id
- **THEN** the campaign row and all joined character rows are returned

#### Scenario: Returns null for unknown campaign
- **WHEN** `getCampaignWithCharacters` is called with an id that does not exist
- **THEN** null is returned for the campaign

### Requirement: getCharacterById query
The system SHALL provide a `getCharacterById(characterId)` function in `src/db/queries/campaigns.ts` that returns the character row or null if not found.

#### Scenario: Returns character
- **WHEN** `getCharacterById` is called with a valid character id
- **THEN** the character row is returned

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

### Requirement: Campaigns service layer
The system SHALL provide `src/services/campaigns.ts` that owns join code generation and campaign creation orchestration. Services SHALL call query functions and SHALL NOT import from `app/` or interact with HTTP.

#### Scenario: Join code is generated as 6-char uppercase alphanumeric
- **WHEN** the campaign service creates a new campaign
- **THEN** the `join_code` stored is exactly 6 characters, uppercase alphanumeric ([A-Z0-9])

#### Scenario: Service retries on join code collision
- **WHEN** a generated join code already exists in the database
- **THEN** the service generates a new code and retries the insert

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

### Requirement: Spaceships table
The system SHALL define a `spaceships` table with columns: `id` (uuid PK, default `gen_random_uuid()`), `campaign_id` (uuid, not null, FK → campaigns.id), `frame_tier` (integer, not null), `speed` (integer, not null), `maneuverability` (text, not null), `hull_points` (integer, not null), `shield_fore` (integer, not null, default 0), `shield_aft` (integer, not null, default 0), `shield_port` (integer, not null, default 0), `shield_starboard` (integer, not null, default 0), `power_core_pcu` (integer, not null), `drift_engine_rating` (integer, not null, default 0), `expansion_bays` (jsonb, not null, default `'[]'`), `crew` (jsonb, not null, default `'{}'`), `created_at` (timestamptz, default now()). The `campaign_id` column SHALL NOT have a unique constraint — multiple ships per campaign are permitted.

#### Scenario: Spaceship row is created
- **WHEN** a valid spaceship insert is executed
- **THEN** a row exists in `spaceships` linked to the campaign with all required fields populated and a generated uuid

#### Scenario: Second spaceship for same campaign is accepted
- **WHEN** an insert is attempted with a `campaign_id` that already has one or more spaceship rows
- **THEN** the database accepts the insert and a new spaceship row exists alongside the existing ones

### Requirement: Spaceship query functions
The system SHALL provide spaceship query functions in `src/db/queries/campaigns.ts`. No business logic SHALL exist in query files.

#### Scenario: getSpaceshipsByCampaign returns all ships for a campaign
- **WHEN** `getSpaceshipsByCampaign(campaignId)` is called with a valid campaign id
- **THEN** an array of all spaceship rows linked to that campaign is returned, ordered by `created_at` ascending; an empty array is returned if none exist

#### Scenario: createSpaceship inserts a row
- **WHEN** `createSpaceship(data)` is called with valid spaceship data
- **THEN** a new spaceship row is inserted and returned

#### Scenario: updateSpaceship updates fields
- **WHEN** `updateSpaceship(spaceshipId, data)` is called with a partial update
- **THEN** the specified fields are updated and the updated row is returned

#### Scenario: deleteSpaceship removes the row
- **WHEN** `deleteSpaceship(spaceshipId)` is called
- **THEN** the spaceship row and all child rows (weapons, notes, crew) are deleted via cascade
