## Why

The spaceship sheet has no way to track which campaign characters fill which crew roles during starship combat. Players and GMs need to see at a glance who is captain, pilot, engineer(s), gunner(s), and science officer(s).

## What Changes

- New `spaceship_crew` database table linking spaceship → character → role
- Partial unique index enforcing at most one captain and one pilot per spaceship
- New crew assignment UI section added to the bottom of the spaceship editor
- New server actions and DB queries for reading and writing crew assignments
- Spaceship page fetches campaign characters alongside existing spaceship data

## Capabilities

### New Capabilities

- `spaceship-crew`: Assign campaign characters to crew roles on a spaceship. Singleton roles (captain, pilot) allow only one character each; multi-slot roles (engineer, gunner, science_officer) allow any number. A single character may hold multiple roles simultaneously.

### Modified Capabilities

- `campaign-spaceship`: Spaceship page now fetches campaign characters and passes crew assignments to the editor component.

## Impact

- **DB schema**: new `spaceship_crew` table + partial unique index (new migration required)
- **Queries**: `getCampaignWithCharacters` already exists; new `getCrewBySpaceship` query needed
- **Server actions**: new `upsertCrewAction` / `removeCrewAction` in the spaceship actions file
- **UI**: new `_crew-section.tsx` client component, imported by `_name-editor.tsx`
- **No breaking changes** to existing spaceship fields or other pages
