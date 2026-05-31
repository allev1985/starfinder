## MODIFIED Requirements

### Requirement: character_combat_stats table
The database SHALL have a `character_combat_stats` table with `character_id` as its primary key (referencing `characters.id`), an `initiative_misc_mod` integer column NOT NULL with a default of `0`, a `base_attack_bonus` integer column NOT NULL with a default of `0`, six integer columns for health and resolve (`stamina_points_total`, `stamina_points_current`, `hit_points_total`, `hit_points_current`, `resolve_points_total`, `resolve_points_current` — all NOT NULL DEFAULT 0), four integer columns for armor class (`eac_armor_bonus`, `eac_misc_mod`, `kac_armor_bonus`, `kac_misc_mod` — all NOT NULL DEFAULT 0), and six integer columns for saving throws (`fort_base_save`, `fort_misc_mod`, `ref_base_save`, `ref_misc_mod`, `will_base_save`, `will_misc_mod` — all NOT NULL DEFAULT 0).

#### Scenario: Table structure
- **WHEN** all migrations have run
- **THEN** `character_combat_stats` exists with all previously specified columns plus `fort_base_save INT NOT NULL DEFAULT 0`, `fort_misc_mod INT NOT NULL DEFAULT 0`, `ref_base_save INT NOT NULL DEFAULT 0`, `ref_misc_mod INT NOT NULL DEFAULT 0`, `will_base_save INT NOT NULL DEFAULT 0`, `will_misc_mod INT NOT NULL DEFAULT 0`
