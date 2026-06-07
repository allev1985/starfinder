## ADDED Requirements

### Requirement: Realtime publication enabled on relevant tables
The database SHALL have `characters` and `character_combat_stats` included in the `supabase_realtime` publication so that row-level change events are broadcast to subscribers.

#### Scenario: Migration enables realtime on both tables
- **WHEN** the migration runs
- **THEN** `select tablename from pg_publication_tables where pubname = 'supabase_realtime'` includes both `characters` and `character_combat_stats`

### Requirement: RLS permits campaign members to read character rows
Campaign members (characters in the same campaign as the target character) SHALL be able to read rows from `characters` and `character_combat_stats` for any character in their campaign, regardless of ownership.

#### Scenario: GM can read another player's combat stats
- **WHEN** a user whose character is in the same campaign subscribes to changes for a character they do not own
- **THEN** Supabase Realtime delivers row events to that subscriber

#### Scenario: Unrelated user cannot read private character rows
- **WHEN** a user with no campaign relationship to a character subscribes to changes for that character
- **THEN** no row events are delivered (RLS filters them out)

### Requirement: CharacterRealtimeSync component subscribes on mount
The `CharacterRealtimeSync` component SHALL, on mount, open a Supabase Realtime channel and subscribe to `postgres_changes` events (`INSERT` and `UPDATE`) on `character_combat_stats` filtered by `characterId` and on `characters` filtered by `id = characterId`. It SHALL use the browser Supabase client from `src/lib/supabase/client.ts`.

#### Scenario: Component mounts and subscription opens
- **WHEN** the character sheet page renders and `CharacterRealtimeSync` mounts
- **THEN** a Supabase Realtime channel is opened for the character's ID

#### Scenario: Component unmounts and subscription closes
- **WHEN** the user navigates away from the character sheet
- **THEN** the channel is removed and no further events are received

### Requirement: Incoming combat stats events update context
When a `character_combat_stats` row event is received, the component SHALL call `setHealthValues` and `setCombatMods` on `CharacterContext` with values extracted from the event's new row.

#### Scenario: HP change from another client is reflected
- **WHEN** the owner reduces HP on their client, causing a DB write to `character_combat_stats`
- **THEN** an observer's `CharacterContext.healthValues.hitPointsCurrent` is updated within ~500ms without a page reload

#### Scenario: Combat stat change propagates to observer
- **WHEN** the owner updates BAB on their client
- **THEN** an observer's `CharacterContext.combatMods.baseAttackBonus` reflects the new value within ~500ms

### Requirement: Incoming character row events update context
When a `characters` row event is received, the component SHALL call `setLevel`, `setScores`, `setCredits`, and `setXpEarned` on `CharacterContext` with values extracted from the event's new row.

#### Scenario: Level change propagates to observer
- **WHEN** the owner levels up their character
- **THEN** an observer's displayed level updates within ~500ms without a page reload

#### Scenario: Ability score change propagates to observer
- **WHEN** the owner changes an ability score
- **THEN** an observer's ability score display reflects the new value within ~500ms

### Requirement: Subscription is mounted for all viewers
`CharacterRealtimeSync` SHALL be mounted inside `CharacterProvider` regardless of whether the current viewer is the owner. This ensures the owner also receives updates from other tabs or windows.

#### Scenario: Owner's second tab stays in sync
- **WHEN** the owner has the character sheet open in two browser tabs and makes a change in Tab 1
- **THEN** Tab 2 reflects the change within ~500ms without a page reload

### Requirement: character_conditions table included in realtime publication
The `character_conditions` table SHALL be added to the `supabase_realtime` publication so that INSERT and DELETE events are broadcast to subscribers.

#### Scenario: Migration adds character_conditions to publication
- **WHEN** the migration runs
- **THEN** `select tablename from pg_publication_tables where pubname = 'supabase_realtime'` includes `character_conditions`

### Requirement: CharacterRealtimeSync subscribes to character_conditions events
The `CharacterRealtimeSync` component SHALL subscribe to `postgres_changes` events (`INSERT` and `DELETE`) on `character_conditions` filtered by `character_id = characterId`, in addition to its existing subscriptions.

#### Scenario: Component subscribes to condition events on mount
- **WHEN** the character sheet page renders and `CharacterRealtimeSync` mounts
- **THEN** the Supabase Realtime channel includes a subscription for `character_conditions` filtered by `character_id`

### Requirement: Incoming condition events update CharacterContext
When a `character_conditions` INSERT event is received, the component SHALL add the corresponding condition to `CharacterContext.activeConditions`. When a DELETE event is received, it SHALL remove the condition from `activeConditions`.

#### Scenario: Condition added by owner propagates to observer
- **WHEN** the owner toggles a condition on, causing an INSERT into `character_conditions`
- **THEN** an observer's character sheet shows the new condition chip within ~500ms without a page reload

#### Scenario: Condition removed by owner propagates to observer
- **WHEN** the owner toggles a condition off, causing a DELETE from `character_conditions`
- **THEN** the condition chip disappears from an observer's character sheet within ~500ms without a page reload

### Requirement: Battle screen subscribes to character_combat_stats for all party members
The initiative tracker client SHALL subscribe to `postgres_changes` on `character_combat_stats` for all campaign character IDs (not just the viewer's own character). This uses the same Supabase browser client and channel pattern as `CharacterRealtimeSync`. Each character's SP/HP/RP values in the battle screen's local state SHALL update when any `character_combat_stats` row changes for a campaign character.

#### Scenario: Subscriber sees another PC's HP change in real-time
- **WHEN** a player edits their HP on their character sheet or the battle screen
- **THEN** all other connected clients viewing the battle screen see the updated HP within ~500ms

#### Scenario: Channel closed when leaving battle screen
- **WHEN** a user navigates away from the initiative tracker page
- **THEN** the `character_combat_stats` subscription for all campaign characters is removed
