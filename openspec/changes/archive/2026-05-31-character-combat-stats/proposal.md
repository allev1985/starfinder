## Why

The character sheet currently surfaces ability scores and their modifiers but has no combat stats section. Initiative — a frequently referenced combat value — is missing entirely. Building a dedicated `character_combat_stats` table now establishes the foundation for all future combat stats (EAC, KAC, saves, attack bonuses) while delivering initiative as the first visible value.

## What Changes

- New `character_combat_stats` table: 1:1 with `characters`, `character_id` as PK, starting with `initiative_misc_mod INT DEFAULT 0`
- Row inserted eagerly on character creation (all defaults)
- New `src/lib/ability.ts` utility exporting the `modifier(score)` helper (extracted from `ability-scores-section.tsx`)
- New **Combat Stats** section on the character sheet, initially showing initiative (total, DEX modifier breakdown, editable misc modifier)
- Initiative total is derived client-side from `dexScore` + `initiativeMiscMod`; total is never stored

## Capabilities

### New Capabilities
- `character-combat-stats`: Persistent storage and display of per-character combat stat misc modifiers, beginning with initiative

### Modified Capabilities
- `character-ability-scores`: The `modifier()` helper moves from a private function to an exported utility in `src/lib/ability.ts`; no behavior change, no spec-level requirement change

## Impact

- **DB**: New migration adding `character_combat_stats` table; character creation query gains an INSERT into this table
- **Schema**: New Drizzle table definition and inferred types
- **Services**: `createCharacterForUser` must insert a `character_combat_stats` row
- **UI**: New `CombatStatsSection` component on the character detail page
- **Utility**: `ability-scores-section.tsx` refactored to import `modifier` from `src/lib/ability.ts`
