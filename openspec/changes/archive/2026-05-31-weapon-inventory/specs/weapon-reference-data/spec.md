## ADDED Requirements

### Requirement: weaponCategory enum
The database SHALL have a `weapon_category` Postgres enum with values: `small_arms`, `longarms`, `heavy`, `sniper`, `melee_basic`, `melee_advanced`, `grenade`, `special`.

#### Scenario: Enum values are enforced at the DB level
- **WHEN** an INSERT into `weapons` uses a value not in the enum
- **THEN** the database rejects the insert with a constraint violation

### Requirement: weapons reference table schema
The system SHALL have a `weapons` table with the following columns:
- `id` — uuid, primary key, default random
- `name` — text, not null
- `item_level` — integer, not null
- `category` — `weapon_category` enum, not null
- `damage_dice` — text, not null (e.g., `"1d6"`)
- `damage_types` — text array, not null (e.g., `["Fire"]`, `["Piercing", "Slashing"]`)
- `critical_effect` — text, nullable (e.g., `"Burn"`, `"Wound"`)
- `critical_dice` — text, nullable (e.g., `"1d4"`) — only set when the critical effect involves a dice roll
- `range` — text, nullable — null for melee weapons (e.g., `"30 ft"`)
- `capacity` — integer, nullable — null for melee and unlimited-ammo weapons
- `usage` — integer, nullable — ammo consumed per shot; null for melee
- `bulk` — text, not null (e.g., `"L"`, `"1"`, `"2"`)
- `special` — text, nullable (e.g., `"Line"`, `"Blast"`)
- `source_book` — text, not null, default `"crb"`

#### Scenario: Schema is created by migration
- **WHEN** the schema migration runs on a fresh database
- **THEN** the `weapons` table exists with all columns and the `weapon_category` enum exists

#### Scenario: Melee weapon has null range, capacity, and usage
- **WHEN** a melee weapon row is inserted with null range, capacity, and usage
- **THEN** the insert succeeds and those columns read back as null

#### Scenario: Critical effect without dice has null critical_dice
- **WHEN** a weapon with criticalEffect `"Wound"` is inserted with null critical_dice
- **THEN** the insert succeeds and critical_dice reads back as null

### Requirement: CRB weapons seeded by category
The system SHALL seed all CRB weapons via SQL migrations, one migration file per weapon category. Stats SHALL be sourced from Archives of Nethys (aonprd.com). The seed SHALL cover all 8 categories: small arms, longarms, heavy weapons, sniper weapons, basic melee, advanced melee, grenades, and special weapons.

#### Scenario: All weapon categories are populated after seed migrations
- **WHEN** all seed migrations run on a fresh database
- **THEN** the `weapons` table contains at least one row for each of the 8 weapon categories

#### Scenario: Damage types are stored as full English words
- **WHEN** a seed migration inserts a Fire weapon
- **THEN** `damage_types` reads back as `["Fire"]`, not `["F"]`

#### Scenario: Multi-type damage weapon stores all types
- **WHEN** a seed migration inserts a weapon with Piercing and Slashing damage
- **THEN** `damage_types` reads back as `["Piercing", "Slashing"]`
