## Context

Character sheets use a `CharacterProvider` React context holding 13+ pieces of state. The owner's client writes optimistic updates immediately, then flushes to DB via `useDebouncedSave` (600ms). Server actions write directly to Postgres (Supabase). No mechanism exists to push those DB writes to other connected clients. The Supabase JS client is already configured for browser use at `src/lib/supabase/client.ts`.

The equipment bug is a prerequisite: `EquipmentCard` initialises `quantity` and `currentCharges` from `entry` props via `useState`, so re-renders with new props (e.g., from a realtime event) do not update the displayed values.

## Goals / Non-Goals

**Goals:**
- All clients viewing a character sheet receive near-realtime pushes of HP/SP/RP, combat stats, ability scores, level, credits, and XP when the owner makes changes
- Owner's two-tab scenario works automatically (same mechanism)
- `EquipmentCard` is corrected to treat `CharacterContext` as the single source of truth for quantity and charges

**Non-Goals:**
- Campaign-overview page does not get realtime character summaries (future work)
- Skills, inventory, feats, spells, and languages are not realtime-synced in this change (combat-critical fields only for first pass)
- Conflict resolution — Model A means only the owner writes; no concurrent-write handling needed

## Decisions

### 1. Supabase Realtime Postgres Changes over alternatives

**Decision**: Use Supabase Realtime with `postgres_changes` event type.

**Rationale**: No new infrastructure. The Supabase client is already present. Auth and row filtering are inherited from RLS. Server actions need no modification — the DB write automatically triggers the broadcast.

**Alternatives considered**:
- *Broadcast channel*: Faster (no DB round-trip), but requires modifying every server action to send a broadcast after writing. High coupling, easy to miss.
- *Polling via `router.refresh()`*: Dead simple but ~5-30s lag and wasteful. Not "near realtime."
- *WebSockets / SSE via Next.js route handler*: Full control but significant new infrastructure to build and maintain.

### 2. Always subscribe, not just for non-owners

**Decision**: `CharacterRealtimeSync` mounts inside `CharacterProvider` unconditionally.

**Rationale**: Owners benefit from two-tab sync at zero extra cost. For the owner's primary tab, realtime events arrive ~100-300ms after the DB write, calling `setX` with the value already reflected by the optimistic update — no visible change.

### 3. Two tables cover the first-pass scope

**Decision**: Subscribe to `character_combat_stats` and `characters` only.

**Rationale**:
- `character_combat_stats` contains all of HP, SP, RP, saves, BAB, AC mods, initiative — everything that matters in combat.
- `characters` contains level, ability scores, credits, XP.
- Together these cover ~80% of what a GM needs to observe in play.
- Skills, inventory, feats, etc. are less time-sensitive and can be added in a follow-up.

### 4. Component placement: inside CharacterProvider, not the page

**Decision**: `CharacterRealtimeSync` is a render-null component placed as a child of `CharacterProvider` in the character sheet layout/page.

**Rationale**: It needs access to `useCharacter()` to call the context setters. Placing it inside the provider means no prop-drilling. It renders nothing to the DOM.

### 5. Equipment fix: remove local useState, drive from props

**Decision**: Delete `const [quantity, setQuantity] = useState(entry.quantity)` and `const [currentCharges, setCurrentCharges] = useState(...)` from `EquipmentCard`. Use `entry.quantity` and `entry.currentCharges` directly. Optimistic updates flow through `onQuantityChange` / `onChargesChange` → parent → `setEquipmentInventory` → context → new `entry` prop on next render.

**Rationale**: The parent `EquipmentInventory` already calls `onInventoryChange` for every mutation, which updates `CharacterContext`. Local state was redundant and breaks context-driven updates (e.g., realtime events).

## Risks / Trade-offs

**RLS policies may block GM subscriptions** → Before implementing, verify that `characters` and `character_combat_stats` have read policies that allow campaign members to read rows they don't own. If missing, add a policy: `allow select where character_id in (select character_id from campaign_characters where campaign_id in (select campaign_id from campaign_characters where character_id = auth.uid()))` (or equivalent).

**Realtime must be explicitly enabled on tables** → `alter publication supabase_realtime add table characters, character_combat_stats` must run as a migration. Without this, subscriptions connect but receive no events.

**Removing EquipmentCard local state changes event timing** → Previously the card could update before the parent context. After the fix, all updates flow through context — one render cycle later. This is imperceptible at human timescales.

**`character_combat_stats` uses `characterId` as primary key** → Row events from Postgres Changes will always be UPDATE (not INSERT) after first creation. The component must handle both UPDATE and INSERT event types for robustness.

## Migration Plan

1. Add Drizzle migration: `alter publication supabase_realtime add table characters, character_combat_stats`
2. Verify (or add) RLS read policies for campaign members on both tables
3. Implement `CharacterRealtimeSync` component
4. Mount it in the character sheet page/layout
5. Remove local state from `EquipmentCard`
6. Manual test: open character sheet in two browsers; confirm HP change in one reflects in the other within ~500ms

**Rollback**: Remove the component mount and the `alter publication` migration. No data is mutated; rollback is non-destructive.
