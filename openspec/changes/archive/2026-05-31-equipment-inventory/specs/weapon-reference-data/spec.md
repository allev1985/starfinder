## MODIFIED Requirements

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
- `ammo_type` — text, nullable — identifies the ammo type this weapon uses (e.g., `'battery'`, `'small_arm_rounds'`, `'longarm_rounds'`, `'heavy_rounds'`, `'sniper_rounds'`, `'petrochem_fuel'`, `'shells'`, `'darts'`, `'missiles'`); null for melee weapons and grenades
- `source_book` — text, not null, default `"crb"`

#### Scenario: Schema is created by migration
- **WHEN** the schema migration runs on a fresh database
- **THEN** the `weapons` table exists with all columns and the `weapon_category` enum exists

#### Scenario: Melee weapon has null range, capacity, usage, and ammo_type
- **WHEN** a melee weapon row is inserted with null range, capacity, usage, and ammo_type
- **THEN** the insert succeeds and those columns read back as null

#### Scenario: Critical effect without dice has null critical_dice
- **WHEN** a weapon with criticalEffect `"Wound"` is inserted with null critical_dice
- **THEN** the insert succeeds and critical_dice reads back as null

#### Scenario: Energy weapon has ammo_type set to battery
- **WHEN** a laser pistol row is queried
- **THEN** `ammo_type` reads back as `'battery'`

#### Scenario: Ballistic small arm has ammo_type set to small_arm_rounds
- **WHEN** a semi-auto pistol row is queried
- **THEN** `ammo_type` reads back as `'small_arm_rounds'`

#### Scenario: Grenade has null ammo_type
- **WHEN** a grenade row is queried
- **THEN** `ammo_type` is null

### Requirement: CRB weapons seeded by category
The system SHALL seed all CRB weapons via SQL migrations, one migration file per weapon category. Stats SHALL be sourced from Archives of Nethys (aonprd.com). The seed SHALL cover all 8 categories: small arms, longarms, heavy weapons, sniper weapons, basic melee, advanced melee, grenades, and special weapons. All energy-using weapons SHALL have `ammo_type` set; all melee weapons and grenades SHALL have `ammo_type` null.

#### Scenario: All weapon categories are populated after seed migrations
- **WHEN** all seed migrations run on a fresh database
- **THEN** the `weapons` table contains at least one row for each of the 8 weapon categories

#### Scenario: Damage types are stored as full English words
- **WHEN** a seed migration inserts a Fire weapon
- **THEN** `damage_types` reads back as `["Fire"]`, not `["F"]`

#### Scenario: Multi-type damage weapon stores all types
- **WHEN** a seed migration inserts a weapon with Piercing and Slashing damage
- **THEN** `damage_types` reads back as `["Piercing", "Slashing"]`

#### Scenario: All seeded ranged weapons have ammo_type set
- **WHEN** all seed migrations run
- **THEN** every ranged weapon row has a non-null `ammo_type`
