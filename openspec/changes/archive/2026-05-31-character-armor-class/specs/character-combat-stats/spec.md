## MODIFIED Requirements

### Requirement: character_combat_stats table
The database SHALL have a `character_combat_stats` table with `character_id` as its primary key (referencing `characters.id`), an `initiative_misc_mod` integer column NOT NULL with a default of `0`, a `base_attack_bonus` integer column NOT NULL with a default of `0`, six integer columns for health and resolve (`stamina_points_total`, `stamina_points_current`, `hit_points_total`, `hit_points_current`, `resolve_points_total`, `resolve_points_current` — all NOT NULL DEFAULT 0), and four integer columns for armor class: `eac_armor_bonus`, `eac_misc_mod`, `kac_armor_bonus`, `kac_misc_mod` — all NOT NULL with a default of `0`.

#### Scenario: Table structure
- **WHEN** all migrations have run
- **THEN** `character_combat_stats` exists with columns `character_id UUID PK`, `initiative_misc_mod INT NOT NULL DEFAULT 0`, `base_attack_bonus INT NOT NULL DEFAULT 0`, `stamina_points_total INT NOT NULL DEFAULT 0`, `stamina_points_current INT NOT NULL DEFAULT 0`, `hit_points_total INT NOT NULL DEFAULT 0`, `hit_points_current INT NOT NULL DEFAULT 0`, `resolve_points_total INT NOT NULL DEFAULT 0`, `resolve_points_current INT NOT NULL DEFAULT 0`, `eac_armor_bonus INT NOT NULL DEFAULT 0`, `eac_misc_mod INT NOT NULL DEFAULT 0`, `kac_armor_bonus INT NOT NULL DEFAULT 0`, `kac_misc_mod INT NOT NULL DEFAULT 0`

#### Scenario: Backfill on migration
- **WHEN** the armor class migration runs against a database with existing `character_combat_stats` rows
- **THEN** the four AC columns are present with value `0` on every existing row

### Requirement: Combat stats row created with character
A `character_combat_stats` row SHALL be inserted atomically when a new character is created, with all columns at their defaults including all four armor class columns at `0`.

#### Scenario: New character has combat stats row
- **WHEN** a new character is created
- **THEN** a `character_combat_stats` row exists for that character with `eac_armor_bonus = 0`, `eac_misc_mod = 0`, `kac_armor_bonus = 0`, `kac_misc_mod = 0`, and all other columns at their defaults
