## ADDED Requirements

### Requirement: Battle realtime publication
The `battles` and `battle_combatants` tables SHALL be included in the Supabase realtime publication so that `postgres_changes` events are broadcast to subscribers.

#### Scenario: Tables included in publication after migration
- **WHEN** the migration runs
- **THEN** `select tablename from pg_publication_tables where pubname = 'supabase_realtime'` includes both `battles` and `battle_combatants`

### Requirement: Battle realtime channel subscription
The initiative tracker client component SHALL, on mount, open a Supabase Realtime channel named `battle-{campaignId}` and subscribe to `postgres_changes` events on `battles` (filtered by `campaign_id`) and `battle_combatants` (filtered by `battle_id`). It SHALL use the browser Supabase client from `src/lib/supabase/client.ts`.

#### Scenario: Channel opens on mount
- **WHEN** a campaign member navigates to the initiative page and a battle exists
- **THEN** a Supabase Realtime channel `battle-{campaignId}` is opened

#### Scenario: Channel closes on unmount
- **WHEN** the user navigates away from the initiative page
- **THEN** the channel is removed and no further events are received

### Requirement: Battle row changes update local state
When a `postgres_changes` event arrives on the `battles` table, the client SHALL update local state for `status`, `current_round`, and `current_turn_index`.

#### Scenario: Turn advancement propagates to all clients
- **WHEN** the DM or current player advances the turn
- **THEN** all connected clients update `current_turn_index` within ~500ms without a page reload

#### Scenario: Round increment propagates
- **WHEN** a new round begins
- **THEN** all clients display the updated `current_round`

#### Scenario: Status change transitions all clients
- **WHEN** the DM begins the battle
- **THEN** all clients transition from setup view to active view

#### Scenario: Battle deletion transitions all clients to idle
- **WHEN** the DM ends initiative and the `battles` row is deleted
- **THEN** all clients receive a DELETE event on the `battles` channel and transition to the idle state

### Requirement: Combatant row changes update local state
When a `postgres_changes` event arrives on `battle_combatants`, the client SHALL update the corresponding combatant in local state.

#### Scenario: Player initiative submission visible to all
- **WHEN** a player submits their initiative roll
- **THEN** all clients see that combatant's `initiative_total` update within ~500ms

#### Scenario: Enemy reveal propagates to all clients
- **WHEN** the DM reveals a hidden enemy
- **THEN** all clients see the enemy's name replace "???" within ~500ms

#### Scenario: Defeated status propagates
- **WHEN** the DM marks an enemy as defeated
- **THEN** all clients apply the defeated visual state to that combatant within ~500ms

### Requirement: Enemy stat columns excluded from client realtime payload
The client realtime event handler for `battle_combatants` events SHALL NOT apply or expose `hp_total`, `hp_current`, `eac`, or `kac` from incoming payloads. These columns SHALL be stripped before any state update, regardless of what the Supabase payload contains.

#### Scenario: Enemy stat columns are not applied on player client
- **WHEN** the DM updates an enemy's HP and a realtime event fires on a player's client
- **THEN** no HP, EAC, or KAC values are applied to the player's local state or rendered in the UI

### Requirement: Initial state loaded before realtime subscription
On mount, the initiative page SHALL fetch the current battle state via a server action before opening the realtime subscription. Realtime events SHALL deliver only deltas from that point forward.

#### Scenario: Late-joining client sees current battle state
- **WHEN** a campaign member navigates to the initiative page during an active battle
- **THEN** the current round, turn, and all combatants are displayed immediately from the server-fetched initial state, and subsequent changes arrive via realtime

### Requirement: PC health realtime on battle screen
The initiative tracker client SHALL also subscribe to `postgres_changes` on `character_combat_stats` for all campaign character IDs, using the same pattern as `CharacterRealtimeSync`. Health edits made on the battle screen SHALL write to `character_combat_stats` directly, causing updates to propagate to all battle screen viewers and any open character sheets simultaneously.

#### Scenario: HP edit on battle screen propagates to character sheet
- **WHEN** the character owner or DM edits HP current on the battle screen
- **THEN** the character's open character sheet reflects the new value within ~500ms

#### Scenario: HP edit on character sheet propagates to battle screen
- **WHEN** a player updates their HP on their character sheet
- **THEN** the battle screen shows the updated HP value within ~500ms
