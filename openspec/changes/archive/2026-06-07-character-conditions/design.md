## Context

The character sheet has no way to track which Starfinder conditions (Prone, Fatigued, Blinded, etc.) a character currently has. Conditions are reference data owned by admins (per edition), and characters accumulate a small active set during play. The existing sheet uses a `CharacterContext` provider for shared state, a debounced-save pattern for mutations, and a `CharacterRealtimeSync` component to broadcast changes to campaign participants.

The project already has `character_feats` as the canonical junction-table pattern for reference-data-to-character relationships, and `languages` (text[]) as the pattern for simple string lists. Conditions need a reference table (they have names, slugs, and descriptions) so the junction table pattern applies.

## Goals / Non-Goals

**Goals:**
- Admin CRUD for a `conditions` reference table per edition
- Character sheet section showing active conditions as chips with description popovers
- Dialog to toggle any condition on/off (multi-select style)
- Realtime broadcast so all campaign members see condition changes live
- Mobile-first: all interactions work on touch devices

**Non-Goals:**
- Condition effect automation (no stat penalties applied automatically)
- Duration tracking ("Burning for 3 rounds") — conditions are boolean only
- Per-character condition notes or metadata

## Decisions

### 1. Junction table over text array

**Decision**: `character_conditions(characterId, conditionId)` junction table, not a `text[]` column on `characters`.

**Rationale**: Conditions are reference data with descriptions managed by admins. A junction table gives referential integrity, cascade delete (removing a condition definition cleans up all characters), and clean querying. The `character_feats` table is the direct precedent.

**Alternative considered**: `conditions text[]` on `characters` (like `languages`). Rejected because conditions are not free-form text — they are foreign-keyed to an admin-managed reference table.

### 2. Popover over Tooltip for condition descriptions

**Decision**: Use shadcn `Popover` on each active condition chip to show its description.

**Rationale**: The character sheet is mobile-first. CSS `hover` tooltips don't fire on touch devices. A Popover opens on tap/click and works identically on desktop and mobile. The add-condition dialog also shows descriptions inline, so users always have access to descriptions regardless of device.

**Alternative considered**: shadcn `Tooltip`. Rejected because it is hover-only and the project explicitly requires mobile support. `Tooltip` is not currently installed.

### 3. Realtime via `character_conditions` table publication

**Decision**: Add `character_conditions` to the `supabase_realtime` publication. The `CharacterRealtimeSync` component subscribes to `INSERT` and `DELETE` events on `character_conditions` filtered by `characterId` and calls `setActiveConditions` on context.

**Rationale**: The existing sync pattern (subscribe to postgres_changes per table, filtered by characterId) is already established for `characters` and `character_combat_stats`. Extending it to a third table is consistent and requires no new infrastructure.

**Alternative considered**: Broadcast the full conditions array through the existing `characters` row event by storing conditions as a JSON column on `characters`. Rejected because it couples unrelated data, requires updating the full row on every condition toggle, and breaks the junction table decision above.

### 4. Slug as the stable identifier for conditions

**Decision**: Each condition has a `slug` (kebab-case, unique per edition) in addition to a display `name`. The slug is pre-populated from the name on creation.

**Rationale**: Slugs provide a stable, human-readable identifier for conditions (useful for future automation hooks like "character has 'flat-footed'"). The admin can edit the display name without breaking any slug-based references.

### 5. Conditions section placement on the sheet

**Decision**: Render `ConditionsSection` immediately after `HealthResolveSection` in the character sheet, before combat stats.

**Rationale**: Conditions are most relevant during combat alongside HP/Stamina/Resolve. Placing them adjacently groups combat-state information.

## Risks / Trade-offs

- **Realtime table addition**: Adding `character_conditions` to the realtime publication requires a migration. If the publication doesn't exist yet, the migration must handle that gracefully. → Mitigation: mirror existing migration pattern from `character-realtime-sync` spec.

- **Popover on mobile tap-away**: Popovers require an explicit close action (tap outside or close button). On a crowded mobile sheet this could be annoying if accidental. → Mitigation: keep popover content compact (just the description text); tap-outside closes automatically via shadcn defaults.

- **Large condition list in dialog**: 34+ conditions in the toggle dialog may feel long on small screens. → Mitigation: simple scrollable list with clear active/inactive states; no pagination needed at this scale.

## Migration Plan

1. Create and apply Drizzle migration adding `conditions` and `character_conditions` tables
2. Add `character_conditions` to the supabase_realtime publication (ALTER PUBLICATION)
3. Deploy admin CRUD page — conditions list is empty until admin populates it; no character data at risk
4. Deploy character sheet section — `activeConditions` defaults to `[]`; existing characters unaffected

**Rollback**: Drop `character_conditions` and `conditions` tables; revert schema and component changes. No existing data is modified by this change.

## Open Questions

- None — all decisions resolved during explore session.
