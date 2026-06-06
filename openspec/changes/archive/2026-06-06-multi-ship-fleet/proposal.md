## Why

Campaigns need to support fleets — a party may operate a main ship plus a shuttle, or a GM may run a multi-ship encounter. The current one-per-campaign constraint prevents this real gameplay scenario.

## What Changes

- **BREAKING**: Remove the `UNIQUE` constraint on `spaceships.campaign_id` — a campaign now supports zero or more ships instead of zero or one.
- The campaign sidebar "Spaceship" section becomes a list of ships (mirroring the Characters section), each linking to its own URL.
- The spaceship editor moves from `/campaigns/[id]/spaceship` to `/campaigns/[id]/spaceship/[shipId]`.
- `/campaigns/[id]/spaceship` becomes a redirect or an empty-state landing page when no ships exist.
- The campaign layout fetches a list of spaceships instead of a single spaceship.
- All child tables (`spaceship_weapons`, `spaceship_notes`, `spaceship_crew`) are already scoped to `spaceship_id` — no changes needed there.
- Crew assignments are per-ship and non-exclusive: a character may appear on multiple ships' crew lists simultaneously.

## Capabilities

### New Capabilities

- `fleet-management`: Listing, creating, navigating, and deleting multiple ships within a campaign. Covers the sidebar ship list, the `/spaceship` root landing/redirect, and the ship-specific URL scheme.

### Modified Capabilities

- `campaign-spaceship`: The requirement that each campaign SHALL support **exactly one** shared spaceship changes to **zero or more**. The creation gate (DM-only, shown when none exists) generalises to an always-available "Add ship" action.
- `campaign-data-model`: The `spaceships` table drops its `UNIQUE` constraint on `campaign_id`. The query `getSpaceshipByCampaign` (single result) is replaced by `getSpaceshipsByCampaign` (array).

## Impact

- `src/db/schema.ts` — remove `.unique()` from `spaceships.campaignId`
- `src/db/queries/campaigns.ts` — replace `getSpaceshipByCampaign` with `getSpaceshipsByCampaign`
- `src/app/dashboard/campaigns/[id]/layout.tsx` — fetch array, pass to sidebar
- `src/app/dashboard/campaigns/[id]/_components/campaign-sidebar.tsx` — render ship list section
- `src/app/dashboard/campaigns/[id]/spaceship/page.tsx` — becomes landing/redirect
- `src/app/dashboard/campaigns/[id]/spaceship/[shipId]/page.tsx` — new route, current editor logic moved here
- Supabase migration required to drop the unique constraint
