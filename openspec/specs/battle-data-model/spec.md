## Requirements

### Requirement: battles table
The database SHALL have a `battles` table with columns: `id` (uuid PK), `campaign_id` (uuid FK → campaigns, not null), `status` (text enum: `setup` | `active`, not null, default `setup`), `current_round` (integer, not null, default 1), `current_turn_index` (integer, not null, default 0), `created_at` (timestamp with timezone, default now()).

#### Scenario: Battle row is created for a campaign
- **WHEN** a DM starts a new battle for their campaign
- **THEN** a row is inserted into `battles` with `status = 'setup'`, `current_round = 1`, `current_turn_index = 0`

#### Scenario: Battle status transitions to active
- **WHEN** the DM clicks "Begin Battle"
- **THEN** the `battles` row `status` is updated to `'active'`

#### Scenario: Battle record is deleted on end
- **WHEN** the DM clicks "End Initiative"
- **THEN** the `battles` row is deleted from the database; cascade delete removes all associated `battle_combatants` rows

### Requirement: battle_combatants table
The database SHALL have a `battle_combatants` table with columns: `id` (uuid PK), `battle_id` (uuid FK → battles, cascade delete, not null), `type` (text enum: `pc` | `enemy`, not null), `character_id` (uuid FK → characters, nullable — PC rows only), `display_name` (text, not null), `initiative_total` (integer, nullable — null until submitted), `hidden` (boolean, not null, default false), `defeated` (boolean, not null, default false), `sort_order` (integer, nullable — set at battle start), `hp_total` (integer, nullable — enemies only), `hp_current` (integer, nullable — enemies only), `eac` (integer, nullable — enemies only), `kac` (integer, nullable — enemies only).

#### Scenario: PC combatant row pre-created at battle start
- **WHEN** a new battle is created
- **THEN** one `battle_combatants` row is inserted per campaign character with `type = 'pc'`, `character_id` set, `initiative_total = null`, `defeated = false`, `hidden = false`

#### Scenario: Enemy combatant row created by DM
- **WHEN** the DM adds an enemy during setup
- **THEN** a `battle_combatants` row is inserted with `type = 'enemy'`, `character_id = null`, `display_name` set to the DM-entered name, `initiative_total` set to the DM-entered value

#### Scenario: Cascade delete on battle deletion
- **WHEN** a `battles` row is deleted
- **THEN** all associated `battle_combatants` rows are deleted automatically

### Requirement: Drizzle schema and types
The Drizzle schema in `src/db/schema.ts` SHALL include typed table definitions for `battles` and `battle_combatants` with all columns and foreign key references. Exported inferred types SHALL be available for use in server queries and actions.

#### Scenario: Schema compiles without errors
- **WHEN** `npx tsc --noEmit` is run after adding the schema definitions
- **THEN** no TypeScript errors are reported

### Requirement: Drizzle migration
A Drizzle migration file SHALL be generated that creates both `battles` and `battle_combatants` tables and enables them in the Supabase realtime publication.

#### Scenario: Migration runs cleanly
- **WHEN** the migration is applied to the database
- **THEN** both tables exist and `select tablename from pg_publication_tables where pubname = 'supabase_realtime'` includes `battles` and `battle_combatants`
