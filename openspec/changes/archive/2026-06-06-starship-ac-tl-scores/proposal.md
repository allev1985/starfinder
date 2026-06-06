## Why

The spaceship sheet currently has no way to track Armor Class (AC) or Targeting Lock (TL) — two core defensive scores every ship needs during starship combat. Without them, players must calculate and track these values off-sheet.

## What Changes

- **New**: Six integer fields added to `spaceships`: `pilotRank`, `sizeMod`, `armorBonus`, `acMiscMod`, `countermeasures`, `tlMiscMod`
- **New**: AC/TL section in the spaceship editor displaying inputs for each component and computed totals
- Formulas:
  - `AC = 10 + pilotRank + armorBonus + sizeMod + acMiscMod`
  - `TL = 10 + pilotRank + countermeasures + sizeMod + tlMiscMod`
- `pilotRank` and `sizeMod` are shared inputs; `armorBonus`/`acMiscMod` are AC-only; `countermeasures`/`tlMiscMod` are TL-only

## Capabilities

### New Capabilities

- `spaceship-ac-tl`: AC and TL defensive scores for the spaceship — component inputs (all manual entry), shared fields (pilot rank, size mod), and computed totals

### Modified Capabilities

- `campaign-spaceship`: Spaceship record gains six new integer fields; spaceship editor gains the AC/TL section

## Impact

- `src/db/schema.ts` — six new integer columns on `spaceships`, all `NOT NULL DEFAULT 0`
- New migration required
- `src/app/dashboard/campaigns/[id]/spaceship/actions.ts` — new fields added to the `updateSpaceshipAction` pick type
- `src/app/dashboard/campaigns/[id]/spaceship/_name-editor.tsx` — new AC/TL section with debounced inputs and computed totals
