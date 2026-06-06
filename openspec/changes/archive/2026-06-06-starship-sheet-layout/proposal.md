## Why

The spaceship sheet is currently a linear single-column form that makes it hard to find related data quickly during play. The official Starfinder Ship Sheet (Page 1 — Play Sheet) groups data spatially so players can scan the sheet at a glance; matching that layout makes the app genuinely useful at the table.

## What Changes

- Reorganize `_name-editor.tsx` JSX into the PDF's spatial zones — no logic, state, or data changes
- Ship identity fields display in a compact 2-column sub-grid (Size|Frame, Speed|Maneuverability paired)
- Top row becomes three zones on desktop: Identity | Shields compass | AC/TL/HP stats
- Weapons arcs render as a horizontally scrollable strip on mobile/tablet; 5-column grid on desktop (lg+)
- Bottom info row: Crew | Notes | Expansion Bays (3-col on sm+)
- Systems row: Power Core + Drift Engine | Systems notes | Cargo/Passengers (3-col on sm+)
- Critical Damage remains full-width at the bottom
- `max-w-2xl` constraint removed; layout expands to `max-w-6xl`

## Capabilities

### New Capabilities

- `spaceship-sheet-layout`: Responsive spatial layout for the spaceship play sheet matching the PDF Page 1 zone structure

### Modified Capabilities

- `spaceship-core-attributes`: Identity fields now display in a compact paired grid rather than stacked list
- `spaceship-weapons`: Weapon arcs now render in a scrollable horizontal strip (mobile/tablet) or 5-column grid (desktop)
- `spaceship-note-sections`: Note sections are placed in specific spatial zones rather than stacked at the bottom

## Impact

- `src/app/dashboard/campaigns/[id]/spaceship/_name-editor.tsx` — JSX restructure only
- No schema, DB, or server action changes
- No new dependencies
