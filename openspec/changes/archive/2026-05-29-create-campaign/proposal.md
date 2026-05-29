## Why

The app needs its first real domain entities. Campaigns are the top-level organising unit of a Starfinder game — a DM creates one, shares the join code, and players use it to attach characters. Building the data model and create-campaign flow unlocks all subsequent character and campaign features.

## What Changes

- **BREAKING**: Replace the `placeholder` table in `schema.ts` with three real tables: `campaigns`, `characters`, `campaign_characters`
- Introduce a layered data architecture: `db/queries/` for raw Drizzle access, `src/services/` for business logic
- Add `src/db/queries/campaigns.ts` — `createCampaign`, `getCampaignsByDm`
- Add `src/services/campaigns.ts` — join code generation and campaign creation orchestration
- Add `src/app/dashboard/campaigns/new/page.tsx` — create campaign form
- Add `src/app/dashboard/campaigns/new/actions.ts` — Server Action calling the campaign service
- Generate and apply a Drizzle migration for the new schema
- Remove the placeholder table migration

## Capabilities

### New Capabilities

- `campaign-data-model`: Three-table schema (`campaigns`, `characters`, `campaign_characters`) with Drizzle definitions, queries layer, and service layer.
- `create-campaign`: UI and server action for creating a new campaign. Authenticated user becomes the DM; join code is auto-generated server-side.

### Modified Capabilities

- `db-schema`: Placeholder table removed; real domain tables introduced.

## Impact

- `src/db/schema.ts` — replaced entirely
- `src/db/queries/campaigns.ts` — new file
- `src/services/campaigns.ts` — new file
- `src/app/dashboard/campaigns/new/page.tsx` — new file (replaces stub route)
- `src/app/dashboard/campaigns/new/actions.ts` — new file
- `supabase/migrations/` — new migration generated via `npm run db:generate`
- No new npm dependencies required
