## ADDED Requirements

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
