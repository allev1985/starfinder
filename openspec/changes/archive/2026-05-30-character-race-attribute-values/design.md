## Context

The character sheet (`/dashboard/characters/[id]`) currently shows name, race, class, theme, level, and campaigns. The `race_attributes` table is fully seeded with `type='description'` rows for all 8 races. A query `getRaceAttributes(raceId)` already exists. There is no table yet to store user-supplied values for those attributes.

## Goals / Non-Goals

**Goals:**
- Store per-character values for race description attributes
- Render a Description section on the character detail page driven entirely by the race's attributes
- Inline auto-save on blur for the owning player
- Read-only display for non-owners

**Non-Goals:**
- Class or theme attribute values (future work)
- Attribute types other than `description`
- Validation beyond a non-empty string (Starfinder values are free-form text)

## Decisions

### 1. Dedicated `character_race_attribute_values` table (not a generic attributes table)

Race, class, and theme attributes have parallel but separate tables. A unified `character_attribute_values` table with nullable FK columns gets messy fast. Start with a focused table for race; class and theme can follow the same pattern later.

Schema:
```sql
character_race_attribute_values (
  character_id   uuid  NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  attribute_id   uuid  NOT NULL REFERENCES race_attributes(id) ON DELETE CASCADE,
  value          text  NOT NULL DEFAULT '',
  PRIMARY KEY (character_id, attribute_id)
)
```

### 2. Upsert on blur, not a save button

Character sheets are living documents — players update them mid-session. A save button adds friction. Each field auto-saves individually on `onBlur`. The server action does a single-row upsert keyed on `(character_id, attribute_id)`.

### 3. Fetch race attributes + saved values server-side, merge in the page

The character detail page is a server component. We fetch:
1. `getRaceAttributes(raceId, 'description')` — the attribute definitions for this race
2. `getCharacterRaceAttributeValues(characterId)` — any saved values

Merge into `{ attribute: RaceAttribute; value: string }[]` and pass to the `DescriptionSection` component. This keeps zero loading states for the read path.

### 4. `DescriptionSection` is a client component only for the owner

The component receives `attributes`, `savedValues`, `characterId`, and `isOwner`. When `isOwner` is false, it renders static text. When true, it renders controlled inputs with an `onBlur` handler that calls the server action. This avoids shipping client JS for non-owners.

## Risks / Trade-offs

- **Race change mid-sheet**: If a character's race is changed (via the edit form), existing `character_race_attribute_values` rows for the old race's attributes become orphaned. They won't show up (since we filter by current race's attribute IDs), but they'll sit in the DB. Acceptable for now — a future cleanup migration can handle it.
- **Concurrent saves**: Two tabs saving simultaneously could race on the upsert. Postgres `ON CONFLICT DO UPDATE` handles this correctly; last write wins, which is fine for a single-player character sheet.

## Migration Plan

1. Add migration file for `character_race_attribute_values`
2. Update Drizzle schema
3. Push to local Supabase (`supabase db push` or `drizzle-kit push`)
4. No rollback complexity — table can be dropped without affecting existing character data
