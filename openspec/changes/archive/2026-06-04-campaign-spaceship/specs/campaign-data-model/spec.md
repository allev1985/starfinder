## ADDED Requirements

### Requirement: Spaceships table
The system SHALL define a `spaceships` table with columns: `id` (uuid PK, default `gen_random_uuid()`), `campaign_id` (uuid, not null, FK → campaigns.id with cascade delete, unique), `name` (text, not null), `created_at` (timestamptz, default now()). The unique constraint on `campaign_id` enforces one ship per campaign.

#### Scenario: Spaceship row is created
- **WHEN** a valid spaceship insert is executed for a campaign with no existing ship
- **THEN** a row exists in `spaceships` with a generated uuid, the campaign id, the provided name, and a created_at timestamp

#### Scenario: Cascade delete on campaign removal
- **WHEN** a campaign row is deleted
- **THEN** the associated spaceship row is automatically deleted

### Requirement: Spaceship query functions
The system SHALL provide `createSpaceship`, `getSpaceshipByCampaign`, and `updateSpaceshipName` functions in `src/db/queries/campaigns.ts`.

#### Scenario: createSpaceship inserts and returns
- **WHEN** `createSpaceship` is called with a valid campaignId and name
- **THEN** a new row is inserted and the created spaceship is returned

#### Scenario: getSpaceshipByCampaign returns null when none exists
- **WHEN** `getSpaceshipByCampaign` is called for a campaign with no ship
- **THEN** `null` is returned

#### Scenario: getSpaceshipByCampaign returns the ship
- **WHEN** `getSpaceshipByCampaign` is called for a campaign with a ship
- **THEN** the spaceship row is returned

#### Scenario: updateSpaceshipName updates and returns
- **WHEN** `updateSpaceshipName` is called with a valid spaceship id and new name
- **THEN** the row is updated and the updated spaceship is returned
