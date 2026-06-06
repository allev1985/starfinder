## Why

The spaceship editor has no way to track systems, expansion bays, cargo/passengers, or general ship notes. Players currently have nowhere to record this information on the sheet.

## What Changes

- Add a `spaceship_notes` DB table with `(id, spaceshipId, section, note, createdAt)`
- Add server actions to create and delete spaceship notes
- Add four new note-list sections to the spaceship editor UI: Systems, Expansion Bays, Cargo/Passengers, and Notes
- Each section lets players add freetext note lines and delete individual lines

## Capabilities

### New Capabilities
- `spaceship-note-sections`: Freetext note lists for Systems, Expansion Bays, Cargo/Passengers, and Notes sections on the spaceship editor

### Modified Capabilities

## Impact

- New DB migration: `spaceship_notes` table
- `src/db/schema.ts`: new table and exported types
- `src/db/queries/campaigns.ts`: new query functions
- `src/app/dashboard/campaigns/[id]/spaceship/actions.ts`: new server actions
- `src/app/dashboard/campaigns/[id]/spaceship/page.tsx`: fetch notes on load
- `src/app/dashboard/campaigns/[id]/spaceship/_name-editor.tsx`: render four new sections
