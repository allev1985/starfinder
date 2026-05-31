## ADDED Requirements

### Requirement: chassis table in schema
The system SHALL define a `chassis` table in `src/db/schema.ts` using Drizzle's `pgTable` helper and export the corresponding inferred TypeScript types (`Chassis`, `NewChassis`).

#### Scenario: Schema exports are typed
- **WHEN** a developer uses `typeof chassis.$inferSelect`
- **THEN** TypeScript resolves the correct row shape including `bonusSkillId`, `defaultStr`, `defaultDex`, `defaultInt`, `defaultWis`, and `defaultCha`

### Requirement: chassisId column on characters table
The system SHALL add a nullable `chassis_id` UUID FK column to the `characters` table in `src/db/schema.ts`, referencing `chassis.id`.

#### Scenario: Existing character rows unaffected by migration
- **WHEN** the migration adding `chassis_id` runs on a database with existing character rows
- **THEN** all existing rows have `chassis_id = null`

#### Scenario: Android character can reference a chassis
- **WHEN** a character row is inserted with a valid `chassis_id`
- **THEN** the row is stored and the FK resolves to the chassis row

### Requirement: mechanicCharacterId column on characters table
The system SHALL add a nullable `mechanic_character_id` UUID self-referential FK column to the `characters` table in `src/db/schema.ts`, referencing `characters.id`.

#### Scenario: Existing character rows unaffected by migration
- **WHEN** the migration adding `mechanic_character_id` runs on a database with existing character rows
- **THEN** all existing rows have `mechanic_character_id = null`

#### Scenario: Android character can reference a mechanic character
- **WHEN** a character row is updated with a valid `mechanic_character_id`
- **THEN** the FK resolves to the referenced character row

#### Scenario: Mechanic character can be referenced by multiple androids
- **WHEN** two android character rows both set `mechanic_character_id` to the same character id
- **THEN** both rows are stored successfully with no constraint violation
