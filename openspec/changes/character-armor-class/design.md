## Context

The character sheet already has a Combat Stats section rendering Initiative and Base Attack Bonus. The `character_combat_stats` table is the established home for manual-entry and derived combat numbers. Armor Class (EAC and KAC) follows the same pattern: two manual inputs per type (armor bonus, misc modifier) with a derived total displayed client-side.

## Goals / Non-Goals

**Goals:**
- Add EAC, KAC, and KAC vs. Combat Maneuvers rows to the Combat Stats section
- Persist armor bonus and misc modifier for both EAC and KAC to `character_combat_stats`
- Derive all totals at render time, never store them

**Non-Goals:**
- Redesigning the Combat Stats layout (page redesign is planned separately)
- Tracking individual armor item bonuses or armor type selection
- Automatic armor bonus lookup from equipment

## Decisions

**Store AC inputs in `character_combat_stats`, not a new table.**
AC bonus and misc mod are simple scalar integers with no independent lifecycle. Adding four columns to the existing table avoids a join and stays consistent with how initiative misc mod and BAB are stored. A dedicated table would only be warranted if we needed per-item armor tracking.

**AC sub-grid inside `CombatStatsSection`, not a separate component.**
The page will be redesigned later, so investing in a clean split now is premature. A sub-grid below the BAB row with its own column headers (Total | Armor Bonus | DEX Mod | Misc) keeps the feature self-contained without touching the initiative/BAB grid layout.

**Four server actions, following the existing per-field action pattern.**
`updateEacArmorBonusAction`, `updateEacMiscModAction`, `updateKacArmorBonusAction`, `updateKacMiscModAction` — each mirrors `updateInitiativeMiscModAction`. This is verbose but matches the established pattern and keeps each field independently saveable.

**KAC vs. CM is purely derived — no storage, no input.**
`8 + KAC total` is a read-only display row. No additional DB columns or actions needed.

## Risks / Trade-offs

- Four new server actions is repetitive. → Acceptable for now; refactoring to a generic `updateCombatStatField` action can happen in a future cleanup pass.
- The AC sub-grid has different column headers than the initiative/BAB grid above it. → Accepted; a future page redesign will unify layout. For now, separate column headers per grid section is clearest.

## Migration Plan

1. Generate and apply a Drizzle migration adding four columns (`eac_armor_bonus`, `eac_misc_mod`, `kac_armor_bonus`, `kac_misc_mod`) with `DEFAULT 0` — existing rows get `0` automatically.
2. Deploy schema change before UI changes (additive, non-breaking).
3. No rollback complexity: columns can be dropped if reverted.
