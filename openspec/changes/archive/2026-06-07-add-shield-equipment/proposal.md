## Why

Starfinder supports shields as wieldable equipment that contribute to a character's EAC and KAC, but the character sheet has no way to track or apply shield bonuses. Players using shields must manually account for them in misc mods, which is error-prone and loses the proficiency-gating the rules require.

## What Changes

- Add `shield` as a new value in the `equipmentCategory` enum
- Add nullable stat columns to the `equipment` table: `eacBonus`, `kacBonus`, `acPenalty`, `maxDexBonus`
- Add `wielded` boolean (default `false`) to `character_equipment`
- Add `isShieldProficiency` boolean to the `feats` table
- Admin feats UI gets an "Shield Prof" checkbox alongside the existing "Combat Feat" checkbox
- New admin route `/shields` under `[editionSlug]` for shield catalog CRUD (mirroring the armor admin)
- "Shields" nav card added to the edition admin index page
- Equipment inventory UI gains a Shields section with wielded toggle, stat display, and a Shields filter tab in the picker
- EAC/KAC formula updated to add shield bonus when the character has a feat with `isShieldProficiency = true`
- ACP from shield stacks with armor ACP in skill penalty calculation
- Max DEX cap uses the lower of armor's and shield's `maxDexBonus` when both are present
- Alignment bonus (move-action variant) is out of scope for v1

## Capabilities

### New Capabilities

- `shield-inventory`: Shield items as a wielded equipment category on the character sheet — stat display, wielded toggle, proficiency-gated AC contribution
- `admin-shields-crud`: Admin CRUD page for managing the shield catalog per edition

### Modified Capabilities

- `character-armor-class`: EAC/KAC formula now includes a proficiency-gated shield bonus; max DEX uses the lower of armor and shield caps when both apply
- `character-equipment-inventory`: Shields section added with wielded toggle and stat display; equipment picker gains a Shields filter tab
- `admin-feats-crud`: `isShieldProficiency` boolean flag added to feat form and table

## Impact

- **DB schema**: `equipment` table gains 4 nullable columns; `character_equipment` gains `wielded`; `feats` gains `isShieldProficiency`; `equipmentCategory` enum gains `shield` — all additive, no breaking changes to existing rows
- **Character sheet**: `vitals-strip.tsx`, `combat-stats-section.tsx`, `skills-section.tsx`, `character-context.tsx`, `equipment-inventory.tsx`
- **Admin**: new `admin-shields.ts` query file, new `/shields` route, updated edition index nav
- **Existing equipment**: unaffected — new columns are nullable with sensible defaults
