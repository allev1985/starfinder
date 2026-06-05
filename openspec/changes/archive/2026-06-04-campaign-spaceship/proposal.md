## Why

Starfinder campaigns revolve around a party starship, but the app has no way to represent it. Any campaign participant should be able to create a ship (when none exists yet) or update its name, giving the party a shared vessel to build on in future configuration work.

## What Changes

- Add a `spaceships` table to the database (one per campaign, enforced by a unique constraint on `campaignId`)
- Add DB queries: create, get by campaign, update name
- Add server actions for create and update
- Add a `/dashboard/campaigns/[id]/spaceship` route — single page that shows a create form when no ship exists, or the ship name with inline editing when one does
- Update `CampaignSidebar` to include a "Spaceship" section that links to the ship page (or prompts creation)
- Update the campaign layout to load and pass spaceship data to the sidebar

## Capabilities

### New Capabilities

- `campaign-spaceship`: Creation and naming of a campaign's starship; one ship per campaign; accessible to all campaign participants

### Modified Capabilities

- `campaign-session-layout`: Sidebar gains a Spaceship section alongside the existing Characters section
- `campaign-data-model`: Schema gains the `spaceships` table and exported types

## Impact

- `src/db/schema.ts` — new `spaceships` table and type exports
- `src/db/queries/campaigns.ts` — new spaceship query functions
- `src/app/dashboard/campaigns/[id]/spaceship/` — new route directory
- `src/app/dashboard/campaigns/[id]/layout.tsx` — loads spaceship and passes to sidebar
- `src/app/dashboard/campaigns/[id]/_components/campaign-sidebar.tsx` — Spaceship nav section
- Supabase migration required
