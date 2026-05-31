## 1. Database Migration

- [x] 1.1 Create a migration that adds `base_attack_bonus INT NOT NULL DEFAULT 0` to `character_combat_stats`

## 2. Type Updates

- [x] 2.1 Add `base_attack_bonus` to the `CharacterCombatStats` TypeScript type/interface
- [x] 2.2 Update any fetch/upsert functions that read or write `character_combat_stats` to include the new field

## 3. UI

- [x] 3.1 Add a Base Attack Bonus input row to the Combat Stats section on the character sheet, following the debounced onChange save pattern used by other fields
