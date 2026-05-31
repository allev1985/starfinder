## Requirements

### Requirement: Equipped armor stats are displayed
When an armor is marked `worn` in the character's inventory, a compact stat strip SHALL be displayed in the armor inventory card for that armor showing: EAC bonus, KAC bonus, Max DEX (or "—" if no cap), ACP, Speed adjustment (formatted as "–5 ft" or "0 ft"), Bulk, and Upgrade Slots. The stat strip is shown inline within the inventory row, not below the AC grid.

#### Scenario: Stat strip shows correct values for worn armor
- **WHEN** a character has a worn armor with max_dex_bonus = 3, armor_check_penalty = -2, speed_adjustment = -5, bulk = '2', upgrade_slots = 1
- **THEN** the armor row displays: EAC +4 | KAC +6 | Max DEX +3 | ACP –2 | Speed –5 ft | Bulk 2 | Slots 1

#### Scenario: Stat strip is shown for all inventory armor (not just worn)
- **WHEN** a character has multiple armor in inventory
- **THEN** each armor row displays its stat strip regardless of worn status
