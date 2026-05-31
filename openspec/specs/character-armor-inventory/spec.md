## Requirements

### Requirement: character_armor table schema
The database SHALL have a `character_armor` table with columns: `id` (uuid PK, default random), `character_id` (uuid, not null, FK → characters.id, ON DELETE CASCADE), `armor_id` (uuid, not null, FK → armor.id), `worn` (boolean, not null, default false).

#### Scenario: Table exists after migration
- **WHEN** the migration runs
- **THEN** the `character_armor` table exists with all specified columns

#### Scenario: Row is deleted when character is deleted
- **WHEN** a character row is deleted
- **THEN** all `character_armor` rows for that character are cascade-deleted

### Requirement: Character can add armor to their inventory
The character owner SHALL be able to add an armor from the reference catalog to their inventory via a searchable "Add Armor" picker. The picker SHALL only display armor types the character's class is proficient with. Adding creates a new `character_armor` row with `worn = false`.

#### Scenario: Owner adds an armor
- **WHEN** the owner selects an armor from the "Add Armor" picker
- **THEN** a `character_armor` row is inserted for that character and armor, and the armor appears in the inventory list

#### Scenario: Picker filters by class proficiency
- **WHEN** the character's class is Envoy (light proficiency only)
- **THEN** the "Add Armor" picker shows only light armor from the reference catalog

#### Scenario: Picker is unavailable when no class is set
- **WHEN** the character has no class assigned
- **THEN** the "Add Armor" button is disabled or shows a "Select a class first" message

#### Scenario: Same armor can be added twice
- **WHEN** the owner adds the same armor a second time
- **THEN** a second `character_armor` row is inserted (separate inventory entry)

### Requirement: Character can remove armor from their inventory
The character owner SHALL be able to remove an armor from their inventory. The corresponding `character_armor` row SHALL be deleted. If the removed armor was worn, the character has no armor worn after removal.

#### Scenario: Owner removes an armor
- **WHEN** the owner clicks "Remove" on an armor in the inventory
- **THEN** the `character_armor` row is deleted and the armor disappears from the list

#### Scenario: Removing the worn armor leaves no armor worn
- **WHEN** the owner removes the armor that was marked worn
- **THEN** no other armor is automatically marked worn; the character has no worn armor

### Requirement: Owner can mark one armor as worn
The character owner SHALL be able to mark any inventory armor as worn via a checkbox. Marking an armor worn SHALL set all other `character_armor` rows for that character to `worn = false` in the same transaction. At most one armor can be worn at a time.

#### Scenario: Owner checks the worn checkbox
- **WHEN** the owner checks the worn checkbox on an armor
- **THEN** that armor's `worn` flag is set to true and all other armor rows for the character are set to `worn = false`

#### Scenario: Only one armor is worn after toggle
- **WHEN** armor A is worn and the owner marks armor B as worn
- **THEN** armor A has `worn = false` and armor B has `worn = true`

#### Scenario: Owner can uncheck the worn checkbox
- **WHEN** the owner unchecks the worn checkbox on the currently worn armor
- **THEN** that armor's `worn` flag is set to false and no armor is worn

### Requirement: Worn armor stats flow into character sheet
The worn `character_armor` row's referenced `armor` SHALL be the `equippedArmor` value returned by `getCharacterById`. All downstream stat calculations (KAC, EAC, ACP, skills ACP) SHALL use this value unchanged.

#### Scenario: Worn armor EAC/KAC applies to stats
- **WHEN** a character has a worn armor with `eac_bonus = 4` and `kac_bonus = 6`
- **THEN** the character sheet AC grid shows those bonuses applied

#### Scenario: No worn armor returns null
- **WHEN** a character has armor in inventory but none marked worn
- **THEN** `equippedArmor` is null and AC grid shows 0 armor bonus

### Requirement: Non-owner sees armor inventory as read-only
Non-owners viewing the character sheet SHALL see the armor inventory list but SHALL NOT have access to add, remove, or toggle-worn controls.

#### Scenario: Non-owner views armor inventory
- **WHEN** a non-owner views the character sheet
- **THEN** the armor list is displayed without "Add Armor", "Remove", or worn checkbox controls
