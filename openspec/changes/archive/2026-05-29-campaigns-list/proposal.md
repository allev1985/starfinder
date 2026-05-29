## Why

The `/dashboard/campaigns` page is a stub. Users need to see the campaigns they're involved in — either as DM or as a player whose character has joined a campaign. Without this list the campaigns feature has no entry point beyond creation.

## What Changes

- Add `getCampaignsForUser(userId)` to `src/db/queries/campaigns.ts` — fetches campaigns where the user is DM, plus campaigns where any character they own is a member
- Add `listCampaignsForUser(userId)` to `src/services/campaigns.ts` — merges and deduplicates the two result sets, labels each as `'dm'` or `'player'`
- Replace the stub `src/app/dashboard/campaigns/page.tsx` with a real server component that fetches and renders the campaign list
- Each campaign row shows: name, role badge (DM / Player), and a link to the campaign detail (future page; placeholder href for now)

## Capabilities

### New Capabilities

- `campaigns-list`: Authenticated users can view a list of all campaigns they belong to, grouped by role (DM or player via character membership).

### Modified Capabilities

- `campaign-data-model`: New query `getCampaignsForUser` added to the queries layer.

## Impact

- `src/db/queries/campaigns.ts` — new function added
- `src/services/campaigns.ts` — new function added
- `src/app/dashboard/campaigns/page.tsx` — replaced with real implementation
- No schema changes, no new dependencies
