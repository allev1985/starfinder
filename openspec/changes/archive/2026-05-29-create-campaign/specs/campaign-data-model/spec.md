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

### Requirement: Campaigns service layer
The system SHALL provide `src/services/campaigns.ts` that owns join code generation and campaign creation orchestration. Services SHALL call query functions and SHALL NOT import from `app/` or interact with HTTP.

#### Scenario: Join code is generated as 6-char uppercase alphanumeric
- **WHEN** the campaign service creates a new campaign
- **THEN** the `join_code` stored is exactly 6 characters, uppercase alphanumeric ([A-Z0-9])

#### Scenario: Service retries on join code collision
- **WHEN** a generated join code already exists in the database
- **THEN** the service generates a new code and retries the insert
