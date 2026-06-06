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
