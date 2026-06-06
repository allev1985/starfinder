## Why

The app is multiplayer: GMs and players can all view a character sheet simultaneously, but state changes made by the owner (HP damage, level-up, etc.) are invisible to other viewers until they manually reload the page. Additionally, `EquipmentCard` duplicates context state into local `useState`, causing stale display values when the context updates — a bug that would silently break the realtime layer before it even reaches equipment.

## What Changes

- **New**: `CharacterRealtimeSync` component that subscribes to Supabase Realtime Postgres Changes on `character_combat_stats` and `characters` tables, filtered by `characterId`, and maps incoming DB row events to existing `CharacterContext` setters
- **New**: Supabase Realtime publication enabled on `characters` and `character_combat_stats` via DB migration
- **Fixed**: `EquipmentCard` removes duplicated `quantity` and `currentCharges` local state; these are now driven directly from the `entry` prop (which comes from `CharacterContext`), making context the single source of truth
- The `CharacterRealtimeSync` component mounts for all viewers (owner and non-owner alike), giving owners free two-tab sync

## Capabilities

### New Capabilities

- `character-realtime-sync`: Supabase Realtime subscription layer on the character sheet; listens for Postgres Changes on `characters` and `character_combat_stats` filtered by `characterId`; maps row events to `CharacterContext` setters; mounts inside `CharacterProvider` for all viewers

### Modified Capabilities

- `character-equipment-inventory`: `EquipmentCard` must not duplicate context state — `quantity` and `currentCharges` must be derived from the `entry` prop, not from local `useState`

## Impact

- `src/app/dashboard/characters/[id]/_components/` — new `CharacterRealtimeSync` component
- `src/app/dashboard/characters/[id]/_components/equipment-inventory.tsx` — remove `useState` for `quantity` and `currentCharges` in `EquipmentCard`
- `src/lib/supabase/client.ts` — browser Supabase client already exists; used by the new component
- New Drizzle migration to run `alter publication supabase_realtime add table characters, character_combat_stats`
- No changes to server actions, `CharacterProvider`, or `useDebouncedSave`
- RLS policies on `characters` and `character_combat_stats` must allow campaign members to read rows they don't own (may require policy additions)
