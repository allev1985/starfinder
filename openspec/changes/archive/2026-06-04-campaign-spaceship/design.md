## Context

Campaigns exist but have no starship. Characters already follow a well-established pattern: a DB table, queries in `src/db/queries/campaigns.ts`, server actions in `actions.ts`, and sidebar navigation in `CampaignSidebar`. The spaceship feature mirrors that pattern with a simpler data model (name only) and a one-per-campaign constraint.

## Goals / Non-Goals

**Goals:**
- Any campaign participant can create a spaceship if one doesn't exist yet
- Any campaign participant can rename the spaceship
- One spaceship per campaign, enforced at the DB level
- Sidebar reflects whether a ship exists

**Non-Goals:**
- Configuring ship stats, frame, speed, weapons, etc. (future work)
- Per-character crew roles or assignments
- Ship combat mechanics

## Decisions

### One route, two states (create or view/edit)
`/dashboard/campaigns/[id]/spaceship` is a single page that conditionally renders a create form (no ship) or the ship name with inline editing (ship exists). This avoids a separate `/spaceships/new` route and keeps the URL stable as a bookmarkable ship page once created.

Alternative considered: redirect from `/spaceship` to `/spaceship/new` when no ship exists. Rejected — adds a route, a redirect, and a redirect back without any benefit at this scope.

### Unique constraint on `campaignId` in `spaceships` table
The DB enforces one-per-campaign rather than application code. This is simpler and prevents race conditions.

### Inline name editing with debounced onChange (600 ms)
Consistent with the rest of the app (see `ability-scores-section.tsx` canonical pattern). No separate "save" button.

### Spaceship queries co-located with campaign queries
`src/db/queries/campaigns.ts` already owns related entities. Adding `createSpaceship`, `getSpaceshipByCampaign`, and `updateSpaceship` there keeps ship data access alongside campaign data access. A separate file would be premature at this scope.

### Layout loads spaceship, passes to sidebar
The campaign layout already loads campaign + characters. Adding spaceship to the same fetch keeps the sidebar fully server-rendered without a client-side data fetch.

## Risks / Trade-offs

- [Race condition on create] Two participants click "Create" simultaneously → second insert fails with unique constraint violation → server action should catch and treat as "already exists", then reload → Mitigation: wrap create action in try/catch on unique constraint error, revalidate path so the page re-fetches and shows the existing ship.

## Migration Plan

1. Add `spaceships` table via Supabase migration
2. Deploy application changes (schema, queries, actions, UI)
3. No backfill needed — all existing campaigns simply have no ship yet

Rollback: drop `spaceships` table; revert layout, sidebar, and route changes.
