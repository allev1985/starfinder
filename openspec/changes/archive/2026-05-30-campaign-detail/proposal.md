## Why

The campaigns list links to `/dashboard/campaigns/[id]` but that route doesn't exist. Campaign members need a page to see who is in the campaign and access individual character sheets. Character pages need access control so only campaign members can view them.

## What Changes

- Add `src/app/dashboard/campaigns/[id]/page.tsx` — campaign detail page showing campaign name, join code (for DMs), and the list of joined characters with links to their detail pages
- Add `src/app/dashboard/campaigns/[id]/characters/[characterId]/page.tsx` — character detail stub, accessible to all campaign members
- Add `getCampaignWithCharacters(campaignId)` to `src/db/queries/campaigns.ts` — fetches the campaign row and all joined characters in one query
- Add `isCampaignMember(campaignId, userId)` to `src/db/queries/campaigns.ts` — returns true if user is DM or owns a character in the campaign
- Add `getCampaignDetailForUser(campaignId, userId)` to `src/services/campaigns.ts` — checks membership, returns campaign + characters or throws
- Both pages enforce membership: non-members are redirected to `/dashboard/campaigns`

## Capabilities

### New Capabilities

- `campaign-detail`: Campaign detail page listing joined characters with links, and character detail stub pages, both gated to campaign members only.

### Modified Capabilities

- `campaign-data-model`: Two new query functions added to the queries layer.

## Impact

- `src/db/queries/campaigns.ts` — two new functions
- `src/services/campaigns.ts` — one new function
- `src/app/dashboard/campaigns/[id]/page.tsx` — new route
- `src/app/dashboard/campaigns/[id]/characters/[characterId]/page.tsx` — new route
- No schema changes, no new dependencies
