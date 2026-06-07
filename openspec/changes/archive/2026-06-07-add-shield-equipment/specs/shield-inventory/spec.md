## ADDED Requirements

### Requirement: Shield stat columns on equipment table
The `equipment` table SHALL have four nullable integer columns: `eac_bonus`, `kac_bonus`, `ac_penalty`, and `max_dex_bonus`. These columns SHALL be populated only for rows with `category = 'shield'` and SHALL default to `null` for all other categories.

#### Scenario: Shield row has stat columns populated
- **WHEN** a shield equipment row is inserted with eac_bonus, kac_bonus, ac_penalty, and max_dex_bonus values
- **THEN** all four columns are stored and retrievable

#### Scenario: Non-shield row has null stat columns
- **WHEN** an augmentation or ammunition row is inserted
- **THEN** eac_bonus, kac_bonus, ac_penalty, and max_dex_bonus are null

### Requirement: Wielded state on character_equipment
The `character_equipment` table SHALL have a `wielded` boolean column (default `false`). For shield items, `wielded = true` means the character is currently benefiting from the shield. Only one shield may be wielded at a time per character.

#### Scenario: Wielded defaults to false on insert
- **WHEN** a new character_equipment row is inserted without specifying wielded
- **THEN** the wielded column reads back as false

#### Scenario: Only one shield wielded at a time
- **WHEN** the owner marks a shield as wielded
- **THEN** any other shield entries for that character have wielded set to false

### Requirement: Shields section in equipment inventory
The Equipment section SHALL render a "Shields" sub-group between Augmentations & Upgrades and Ammunition. Each shield card SHALL display: name, item level, price, EAC bonus, KAC bonus, AC penalty, max DEX (or "—" if null), and bulk. The owner SHALL see a "Wielded" checkbox; non-owners SHALL see a read-only wielded indicator only when wielded is true.

#### Scenario: Shield card displays all stats
- **WHEN** a shield is in the character's equipment inventory
- **THEN** the card shows EAC, KAC, AC penalty, and max DEX values

#### Scenario: Empty shields sub-group shows placeholder
- **WHEN** a character has no shields in inventory
- **THEN** the Shields sub-group displays a placeholder message

#### Scenario: Non-owner sees no wielded toggle
- **WHEN** a non-owner views the character sheet
- **THEN** the Wielded checkbox is not rendered on shield cards

### Requirement: Shield picker filter tab
The equipment picker dialog SHALL include a "Shields" filter tab alongside "All", "Augments", and "Ammo". Selecting the Shields tab SHALL show only items with `category = 'shield'`.

#### Scenario: Shields tab filters to shield items only
- **WHEN** the owner opens the equipment picker and selects the Shields tab
- **THEN** only shield-category items are listed

### Requirement: Shield proficiency determines AC contribution
When a character wields a shield, the shield's `eac_bonus` and `kac_bonus` SHALL contribute to EAC and KAC totals only if the character has at least one feat with `is_shield_proficiency = true`. If the character is not proficient, the shield bonus is 0 for AC purposes (the shield is still shown in inventory).

#### Scenario: Proficient character gains shield AC bonus
- **WHEN** a character with the Shield Proficiency feat wields a shield with eac_bonus 1 and kac_bonus 2
- **THEN** EAC total increases by 1 and KAC total increases by 2

#### Scenario: Non-proficient character gains no shield AC bonus
- **WHEN** a character without the Shield Proficiency feat wields a shield
- **THEN** EAC and KAC totals are unchanged from their unshielded values

#### Scenario: Unwielded shield contributes no AC bonus
- **WHEN** a shield is in inventory but wielded is false
- **THEN** EAC and KAC totals are unchanged

### Requirement: Shield ACP stacks with armor ACP
When a shield is wielded, the shield's `ac_penalty` SHALL be added to the armor's `armorCheckPenalty` when computing the total armor check penalty applied to skill checks.

#### Scenario: Shield and armor ACP stack
- **WHEN** a character wears armor with armorCheckPenalty -2 and wields a shield with ac_penalty -1
- **THEN** skill checks that apply ACP use -3 as the total penalty

#### Scenario: No armor equipped, shield ACP still applies
- **WHEN** a character has no armor but wields a shield with ac_penalty -1
- **THEN** applicable skill checks use -1 as the ACP

### Requirement: Max DEX uses the lower of armor and shield caps
When both equipped armor and a wielded shield have a non-null `max_dex_bonus`, the effective DEX modifier for AC SHALL be capped at the lower of the two values.

#### Scenario: Shield max DEX is lower — shield cap applies
- **WHEN** armor has max_dex_bonus 4 and the wielded shield has max_dex_bonus 2
- **THEN** effectiveDex is capped at 2

#### Scenario: Armor max DEX is lower — armor cap applies
- **WHEN** armor has max_dex_bonus 1 and the wielded shield has max_dex_bonus 3
- **THEN** effectiveDex is capped at 1

#### Scenario: Only shield has a max DEX cap
- **WHEN** armor has max_dex_bonus null and the wielded shield has max_dex_bonus 2
- **THEN** effectiveDex is capped at 2

#### Scenario: Neither has a max DEX cap
- **WHEN** both armor and shield have max_dex_bonus null
- **THEN** effectiveDex equals the full DEX modifier with no cap
