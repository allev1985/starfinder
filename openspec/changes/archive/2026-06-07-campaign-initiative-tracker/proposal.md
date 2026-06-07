## Why

Campaigns have no live combat management tool — the Initiative button on the campaign page is a non-functional placeholder. Groups playing Starfinder need a shared, real-time tracker for initiative order, turn advancement, and character health during battle.

## What Changes

- Activate the Initiative button on the campaign detail page (route: `/dashboard/campaigns/[id]/initiative`)
- Add two new database tables: `battles` and `battle_combatants`
- New battle setup flow: DM creates a battle, players submit their own initiative rolls, DM adds enemies
- Active battle view: sorted initiative order, turn advancement, defeated tracking, per-enemy reveal
- PC health (SP/HP/RP) editable on the battle screen by character owner or DM; writes to existing `character_combat_stats` table
- DM-only enemy stat tracking (HP, EAC, KAC) — never exposed to players via client
- Full real-time sync via Supabase `postgres_changes` across all connected clients

## Capabilities

### New Capabilities

- `battle-data-model`: New `battles` and `battle_combatants` DB tables, schema, migration, and Drizzle types
- `battle-initiative-tracker`: The live initiative tracker UI — setup phase, active phase, turn advancement, defeated marking, enemy reveal
- `battle-realtime-sync`: Supabase realtime channel (`battle-{campaignId}`) watching `battles` and `battle_combatants` for all clients; enemy stat columns excluded from client payload

### Modified Capabilities

- `campaign-detail`: Wire the Initiative button to `/dashboard/campaigns/[id]/initiative` (currently `cursor: default` placeholder)
- `character-realtime-sync`: Battle screen subscribes to `character_combat_stats` for all campaign character IDs — same pattern, new consumer

## Impact

- **New DB tables**: `battles`, `battle_combatants` — new Drizzle migration required
- **New route**: `src/app/dashboard/campaigns/[id]/initiative/`
- **Writes to existing table**: `character_combat_stats` (SP/HP/RP current values) — propagates to character sheets automatically via existing realtime
- **Dependencies**: Supabase realtime (already in use), `@supabase/ssr` client (already configured)
- **No breaking changes** to existing routes or tables
