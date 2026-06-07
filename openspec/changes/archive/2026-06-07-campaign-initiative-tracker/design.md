## Context

The campaign detail page has a non-functional Initiative button in its Encounter section. Supabase Realtime is already in production use via `postgres_changes` on `character_combat_stats` (see `character-realtime-sync.tsx`). The `@supabase/ssr` browser client is configured in `src/lib/supabase/client.ts`. The DM/player role distinction is established via `campaign.dmId === user.id`. Character combat stats (SP, HP, RP, EAC/KAC mods, BAB) are stored in `character_combat_stats`; equipped armor bonuses are in `character_armor` → `armor`.

## Goals / Non-Goals

**Goals:**
- Real-time shared battle tracker for all campaign participants
- Setup phase where DM creates battle and players submit their own initiative rolls
- Active phase with turn advancement, defeated tracking, per-enemy reveal
- PC health (SP/HP/RP) editable on battle screen by character owner or DM; writes propagate to character sheets via existing realtime
- DM-only enemy stat display (HP, EAC, KAC) — excluded from client realtime payload

**Non-Goals:**
- Battle history or session note linking
- Per-turn event logging or damage tracking
- Row-Level Security policies — client-side filtering is sufficient
- Supabase Realtime presence (who is online)
- Initiative auto-calculation (player enters raw d20 result; server adds `initiativeMiscMod`)

## Decisions

### D1: Two-table schema over JSON blob

Storing battle state as two relational tables (`battles` + `battle_combatants`) rather than a JSONB blob on the campaign row.

**Rationale**: `postgres_changes` fires per-row. Individual combatant rows mean each update (one enemy revealed, one PC submitting their roll) triggers a targeted event. A blob approach would require full-replacement writes and broadcast the entire state on every change, including enemy stat columns that must stay private.

**Alternative considered**: JSONB column on `campaigns` — rejected because it makes column-level privacy impossible and forces coarse-grained realtime events.

### D2: Two separate realtime concerns

- **Battle channel** (`battle-{campaignId}`): watches `battles` and `battle_combatants` for initiative order, turn state, defeated, hidden. All clients subscribe.
- **Health channel**: watches `character_combat_stats` for all campaign character IDs — same `postgres_changes` pattern already used by character sheets. Battle screen adds a second subscriber.

**Rationale**: Separating concerns keeps the battle channel from needing to carry health data (which changes frequently and already has its own sync path). Health edits on the battle screen write directly to `character_combat_stats` — character sheets update automatically at no extra cost.

### D3: Enemy stats excluded from client realtime via column selection

Enemy HP, EAC, KAC are stored in `battle_combatants` but never fetched client-side. The battle page server component passes enemy stats only to the DM's rendered output. The client realtime subscription selects only public columns (`id`, `battle_id`, `type`, `display_name`, `initiative_total`, `hidden`, `defeated`, `sort_order`).

**Rationale**: Supabase `postgres_changes` sends the full new row by default. To prevent leaking enemy stats, the client subscription uses a column filter via `.select("id,battle_id,type,display_name,initiative_total,hidden,defeated,sort_order")` in the channel config. Enemy stat updates (DM editing HP) happen via server actions only — no client realtime needed.

**Alternative considered**: Separate `battle_enemy_stats` table — rejected as unnecessary complexity when column selection on the subscription achieves the same privacy.

### D4: One active battle per campaign enforced in application logic; ended battles are deleted

No unique constraint on `battles.campaign_id` — instead, the "New Battle" server action checks for any existing `battles` row for the campaign before creating a new one. When the DM ends a battle, the `battles` row is hard-deleted (cascade removes all `battle_combatants`). The idle state is simply the absence of any row.

**Rationale**: Deleting on end keeps the DB clean, eliminates the need for an `'ended'` status value, and makes the idle check trivial (`battles` row exists = active; no row = idle). The `status` enum shrinks to just `'setup' | 'active'`.

### D5: sort_order set at "Begin Battle", not continuously

Initiative order is sorted and `sort_order` assigned once when the DM clicks "Begin Battle". Ties are resolved by the DM reordering during setup (drag-to-reorder on combatants with equal `initiative_total`). After battle starts, `sort_order` is immutable.

**Rationale**: Continuous re-sorting during an active battle would cause turn-order instability. Starfinder RAW resolves ties at initiative start, not mid-battle.

### D6: PC initiative entry by player, enemy entry by DM only

During setup, `battle_combatants` rows for PCs are pre-created with `initiative_total: null`. Each player submits their own raw d20 roll via a server action; the action verifies `character.ownerId === user.id` before writing `initiative_total = roll + initiativeMiscMod`. DM can enter or override any combatant's initiative.

**Rationale**: Matches tabletop play — each player rolls their own dice and reports the result. Prevents players from misreporting others' rolls.

### D7: "Finish Turn" available to current player and DM

The active turn's "Finish Turn" button is visible and actionable for the DM and for the player who owns the currently-active PC. Enemy turns are advanced by the DM only.

**Rationale**: Keeps the DM in control of pacing while reducing friction for players taking their own turns.

## Risks / Trade-offs

- **`postgres_changes` column filter reliability**: Supabase's column filter in realtime subscriptions is a client-side feature in some SDK versions — verify the selected columns approach works as expected in tests. Fallback: strip enemy stat keys in the client handler before setting state. → Mitigation: always strip hp_total/hp_current/eac/kac in the realtime event handler regardless of subscription config.

- **Initiative submission race**: Two players submitting simultaneously could cause a conflict. `battle_combatants` rows are pre-created one per PC, so each player's submission is an UPDATE to their own row — no insert collision risk.

- **Stale battle on reconnect**: If a client reconnects mid-battle, `postgres_changes` only delivers events from the moment of subscription. → Mitigation: on mount, always fetch current battle state via a server action before subscribing; realtime delivers only deltas thereafter.

- **Single active battle**: The one-battle-per-campaign constraint means a second battle can't start until the first ends. This is intentional but requires the DM to explicitly end battles.

## Migration Plan

1. Write Drizzle migration adding `battles` and `battle_combatants` tables
2. Enable Supabase Realtime for both new tables in the Supabase dashboard (tables must be added to the realtime publication)
3. Deploy — no backfill required (all new data)
4. Rollback: drop both tables; revert Initiative button to `cursor: default`

## Open Questions

- Should the DM be able to add new enemies after a battle has started (mid-battle reinforcements), or is the combatant list locked at "Begin Battle"? *(Assumption: locked — can be relaxed later)*
- Should defeated enemies eventually be removable from the list, or permanently visible as struck-through for the battle's duration? *(Assumption: permanently visible until battle ends)*
