## 1. Database Schema and Migration

- [x] 1.1 Add `battles` and `battle_combatants` table definitions to `src/db/schema.ts` with all columns, FK references, and exported Drizzle types
- [x] 1.2 Generate Drizzle migration file for both new tables
- [x] 1.3 Add both tables to the Supabase realtime publication in the migration (ALTER PUBLICATION supabase_realtime ADD TABLE ...)
- [x] 1.4 Apply migration to the database and verify both tables exist

## 2. DB Queries and Server Actions

- [x] 2.1 Add `src/db/queries/battles.ts` with: `getActiveBattleForCampaign`, `createBattle`, `deleteBattle`, `updateBattleTurn`
- [x] 2.2 Add battle combatant queries: `getBattleCombatants`, `insertPcCombatants`, `insertEnemyCombatant`, `updateCombatantInitiative`, `updateCombatantDefeated`, `updateCombatantHidden`, `updateCombatantSortOrder`
- [x] 2.3 Add `src/app/dashboard/campaigns/[id]/initiative/actions.ts` with server actions: `startBattleAction`, `submitInitiativeAction`, `addEnemyAction`, `beginBattleAction`, `finishTurnAction`, `markDefeatedAction`, `revealEnemyAction`, `updateEnemyStatsAction`, `endInitiativeAction`
- [x] 2.4 Add authorization checks to each action: DM-only actions reject non-DM callers; `submitInitiativeAction` verifies character ownership or DM; `finishTurnAction` verifies current-player ownership or DM
- [x] 2.5 Add a query to load party combat data for the battle screen: character names, `character_combat_stats`, equipped armor (eacBonus, kacBonus), ability scores (STR, DEX) — used to compute EAC, KAC, ATK display values

## 3. Initiative Route — Page and Layout

- [x] 3.1 Create `src/app/dashboard/campaigns/[id]/initiative/page.tsx` as a server component that loads current battle state and party data, determines `isDm`, and passes to client
- [x] 3.2 Wire the Initiative button on `src/app/dashboard/campaigns/[id]/page.tsx` from `cursor: default` placeholder to a `<Link href="/dashboard/campaigns/[id]/initiative">` 

## 4. Idle State UI

- [x] 4.1 Create idle state view: DM sees "New Battle" button; players see "Waiting for DM to start battle" message
- [x] 4.2 Implement `startBattleAction` trigger from "New Battle" button with optimistic navigation to setup view

## 5. Setup Phase UI

- [x] 5.1 Create setup phase view listing all PC combatants; each player sees their own character with a d20 roll input and submit button
- [x] 5.2 Implement initiative submission: input validates as integer 1–20, calls `submitInitiativeAction`, displays computed total (`roll + initiativeMiscMod`) after submission
- [x] 5.3 Create enemy addition form (DM only): name input, initiative total input, optional HP/EAC/KAC inputs, hidden toggle, "Add Enemy" button calling `addEnemyAction`
- [x] 5.4 Display submitted and pending combatants in the setup list, updating in real-time as players submit
- [x] 5.5 "Begin Battle" button (DM only): disabled until all PC combatants have `initiative_total != null`; calls `beginBattleAction` which assigns `sort_order` and flips status to active

## 6. Active Phase UI

- [x] 6.1 Create active phase initiative order list sorted by `sort_order`; highlight current turn row
- [x] 6.2 Render defeated combatants as greyed/struck-through; render hidden enemies as "???" for players, actual name for DM
- [x] 6.3 "Finish Turn" button: visible on current combatant row; enabled for DM and current PC's owner; calls `finishTurnAction`
- [x] 6.4 "Reveal" button on hidden enemy rows (DM only): calls `revealEnemyAction`
- [x] 6.5 Defeat control on enemy rows (DM only): calls `markDefeatedAction`
- [x] 6.6 Round counter display ("Round N") in the battle header
- [x] 6.7 "End Initiative" button (DM only): calls `endInitiativeAction`, returns all clients to idle state

## 7. PC Combatant Cards

- [x] 7.1 Create PC card component showing: name, EAC, KAC, melee ATK, ranged ATK (computed read-only), SP current/total, HP current/total, RP current/total
- [x] 7.2 SP/HP/RP current values are editable inline for character owner and DM using the debounced save pattern (writes to `character_combat_stats`)
- [x] 7.3 Other players see SP/HP/RP as read-only display values

## 8. Enemy Stat Panel (DM Only)

- [x] 8.1 DM view of enemy rows includes inline editable HP current/total, EAC, KAC fields
- [x] 8.2 Enemy stat edits call `updateEnemyStatsAction` (server action only, no realtime)
- [x] 8.3 Verify enemy stat columns are stripped from client realtime event handler before any state update

## 9. Realtime Sync

- [x] 9.1 Create `src/app/dashboard/campaigns/[id]/initiative/_battle-realtime-sync.tsx`: subscribes to `battle-{campaignId}` channel watching `battles` (filter: `campaign_id=eq.{id}`) and `battle_combatants` (filter: `battle_id=eq.{battleId}`)
- [x] 9.2 Handle `battles` events: UPDATE → update local `status`, `current_round`, `current_turn_index` state; DELETE → transition all clients to idle state
- [x] 9.3 Handle `battle_combatants` events: upsert combatant in local list; strip `hp_total`, `hp_current`, `eac`, `kac` from payload before applying
- [x] 9.4 Add `character_combat_stats` subscription for all campaign character IDs (same pattern as `CharacterRealtimeSync`); update PC health values in local state on events
- [x] 9.5 Fetch initial battle state via server action on mount before subscribing; realtime delivers only deltas after that point

## 10. Lint, Typecheck, Verify

- [x] 10.1 Run `npm run lint` and fix all errors
- [x] 10.2 Run `npx tsc --noEmit` and fix all type errors
- [ ] 10.3 Manually verify: DM creates battle, players submit rolls, DM adds hidden enemy, DM begins battle, turns advance correctly, defeated enemy is skipped, reveal works, HP edits propagate to character sheet, End Initiative resets to idle
