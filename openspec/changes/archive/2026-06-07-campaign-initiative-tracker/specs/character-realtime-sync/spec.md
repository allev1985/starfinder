## ADDED Requirements

### Requirement: Battle screen subscribes to character_combat_stats for all party members
The initiative tracker client SHALL subscribe to `postgres_changes` on `character_combat_stats` for all campaign character IDs (not just the viewer's own character). This uses the same Supabase browser client and channel pattern as `CharacterRealtimeSync`. Each character's SP/HP/RP values in the battle screen's local state SHALL update when any `character_combat_stats` row changes for a campaign character.

#### Scenario: Subscriber sees another PC's HP change in real-time
- **WHEN** a player edits their HP on their character sheet or the battle screen
- **THEN** all other connected clients viewing the battle screen see the updated HP within ~500ms

#### Scenario: Channel closed when leaving battle screen
- **WHEN** a user navigates away from the initiative tracker page
- **THEN** the `character_combat_stats` subscription for all campaign characters is removed
