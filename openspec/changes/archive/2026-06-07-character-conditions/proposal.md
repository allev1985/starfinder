## Why

During gameplay, Starfinder characters can be afflicted by conditions (Prone, Fatigued, Blinded, etc.) that affect their stats and actions. There is currently no way to track these on the character sheet, forcing players to rely on notes or memory. Conditions need to be toggleable mid-session and visible to all players in a campaign in real time.

## What Changes

- New `conditions` reference table managed by admins (name, slug, description, per edition)
- New `character_conditions` junction table linking characters to their active conditions
- Admin CRUD page at `/dashboard/admin/data/[editionSlug]/conditions`
- "Conditions" added to the admin data index
- New `conditions-section.tsx` on the character sheet showing active conditions as removable chips with description popovers; a dialog for toggling any condition on/off
- Character context and realtime sync updated to include active conditions

## Capabilities

### New Capabilities

- `conditions-reference-data`: Admin CRUD for the conditions reference table (name, slug, description per edition)
- `character-conditions`: Character sheet conditions section — display active conditions, toggle on/off via dialog, description popover on each chip, realtime sync

### Modified Capabilities

- `character-realtime-sync`: Conditions toggle actions must be broadcast so all session participants see condition changes live

## Impact

- **Database**: Two new tables (`conditions`, `character_conditions`) — migration required
- **Schema**: New Drizzle table definitions in `src/db/schema.ts`
- **Admin**: New page + server actions + queries under `src/app/dashboard/admin/data/[editionSlug]/conditions/`
- **Character queries**: `src/db/queries/characters.ts` updated to join active conditions
- **Character context**: `CharacterContext` and `CharacterProvider` extended with `activeConditions` / `setActiveConditions`
- **Character sheet**: New `conditions-section.tsx` component; wired into the character sheet page
- **Realtime sync**: `character-realtime-sync.tsx` extended to handle condition change events
- **Dependencies**: shadcn `Popover` component added (not currently installed)
