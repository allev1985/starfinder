## REMOVED Requirements

### Requirement: characters table has equipped_armor_id FK
**Reason**: Replaced by `character_armor` join table which supports multiple owned armor with a `worn` flag. A direct FK on `characters` cannot represent an inventory.
**Migration**: Drop `equipped_armor_id` column from `characters`. Existing values are discarded. The worn armor is now determined by joining `character_armor WHERE worn = true`.

### Requirement: Character can equip armor from the picker
**Reason**: The single-select combobox that replaces the current equipped armor is superseded by the "Add Armor" picker in the new inventory UI (see `character-armor-inventory` spec).
**Migration**: Delete `armor-picker.tsx`. The "Add Armor" combobox in the new inventory component covers this capability with the same class-proficiency filtering.

### Requirement: Owner can clear equipped armor
**Reason**: Clearing is now handled by unchecking the worn checkbox on the currently worn armor row (or removing the armor entirely). The "None" option in the old combobox is no longer needed.
**Migration**: No explicit "clear" action needed. Unchecking worn or removing the armor achieves the same result.

## MODIFIED Requirements

### Requirement: Equipped armor stats are displayed
When an armor is marked `worn` in the character's inventory, a compact stat strip SHALL be displayed in the armor inventory card for that armor showing: EAC bonus, KAC bonus, Max DEX (or "—" if no cap), ACP, Speed adjustment (formatted as "–5 ft" or "0 ft"), Bulk, and Upgrade Slots. The stat strip is shown inline within the inventory row, not below the AC grid.

#### Scenario: Stat strip shows correct values for worn armor
- **WHEN** a character has a worn armor with max_dex_bonus = 3, armor_check_penalty = -2, speed_adjustment = -5, bulk = '2', upgrade_slots = 1
- **THEN** the armor row displays: EAC +4 | KAC +6 | Max DEX +3 | ACP –2 | Speed –5 ft | Bulk 2 | Slots 1

#### Scenario: Stat strip is shown for all inventory armor (not just worn)
- **WHEN** a character has multiple armor in inventory
- **THEN** each armor row displays its stat strip regardless of worn status
