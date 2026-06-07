## Context

The character sheet already handles armor (separate `armor` table, `character_armor` junction, `equippedArmor` in context) and general equipment (augmentations, ammo) via the `equipment` table and `character_equipment` junction. Shields need stat columns (eacBonus, kacBonus, acPenalty, maxDexBonus) that the equipment table doesn't currently have, and a "wielded" state that the junction table doesn't currently have.

## Goals / Non-Goals

**Goals:**
- Shields are first-class items in the equipment catalog and character inventory
- Shield bonuses are applied to EAC/KAC only when the character has the Shield Proficiency feat
- Admin can manage the shield catalog per edition
- ACP and max DEX from shields stack correctly with armor

**Non-Goals:**
- Alignment bonus (move-action variant) — out of scope for v1
- Class-level shield proficiency grants — classes assign the Shield Proficiency feat directly; no `classShieldProficiency` table
- Armor upgrade slots on shields

## Decisions

### Decision: Extend `equipment` table rather than create a new `shields` table

**Chosen**: Add nullable stat columns (`eac_bonus`, `kac_bonus`, `ac_penalty`, `max_dex_bonus`) to `equipment` and add `shield` to the `equipmentCategory` enum. Add `wielded` boolean to `character_equipment`.

**Alternative considered**: New `shields` table + `character_shields` junction (mirrors the armor pattern).

**Rationale**: Fewer tables, no new FK relationships, and equipment inventory UI already iterates `character_equipment`. The nullable column pattern already exists on `equipment` (`ammo_type`, `ammo_capacity`, `system` are all category-specific nullables). The only addition to the junction is `wielded`, which defaults to `false` and is harmless for non-shield rows.

### Decision: Proficiency via `feats.isShieldProficiency` flag

**Chosen**: Add `is_shield_proficiency` boolean (default `false`) to the `feats` table. `hasShieldProficiency` is derived client-side from `feats[]` in character context.

**Alternative considered**: Name-matching on the feat ("Shield Proficiency"). Rejected — brittle, breaks silently on typos.

**Alternative considered**: `classShieldProficiency` table. Rejected for v1 — the user confirmed classes will simply include the feat in the character's feat list, keeping the system uniform.

### Decision: `equippedShield` derived from `character_equipment` with `wielded = true`

Character context already tracks `equippedArmor` (the single worn armor item). A parallel `equippedShield` is derived from `equipmentInventory` filtered to `category === "shield" && wielded === true`. Only one shield can be wielded at a time — toggling one on sets all others off (same pattern as armor's `worn`).

### Decision: Max DEX cap uses `Math.min` of armor and shield values

When both armor and shield have a non-null `maxDexBonus`, `effectiveDex = Math.min(dexMod, armor.maxDexBonus, shield.maxDexBonus)`. If only one has a cap, that cap applies. This matches the rules text.

## Risks / Trade-offs

- **Sparse columns on `equipment`**: Shield stat columns are null for all non-shield rows. Acceptable given the existing precedent for nullable category-specific columns on the same table.
- **`wielded` on `character_equipment` for non-shields**: Defaults to `false` and is never set for non-shield rows, so it's inert. Risk is low.
- **Enum migration**: Adding `shield` to the Postgres `equipmentCategory` enum requires a migration. Enum additions in Postgres are non-destructive but irreversible — acceptable here.

## Migration Plan

1. Migration adds `shield` to `equipment_category` enum
2. Migration adds nullable `eac_bonus`, `kac_bonus`, `ac_penalty`, `max_dex_bonus` to `equipment`
3. Migration adds `wielded` boolean (default `false`) to `character_equipment`
4. Migration adds `is_shield_proficiency` boolean (default `false`) to `feats`
5. No data backfill needed — all new columns default safely
6. Rollback: enum values cannot be removed from Postgres enums; columns can be dropped. Acceptable risk given all changes are additive.
