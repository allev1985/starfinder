## MODIFIED Requirements

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
