## Why

Campaign DMs need to be able to update campaign details and delete campaigns. Currently a campaign can only be created — there is no way to rename it, regenerate the join code, or remove it. These are basic lifecycle operations the DM should control.

## What Changes

- Add `isCampaignDm(campaignId, userId)` to `src/lib/authorization.ts` — DM-only auth check used by edit and delete flows
- Add `updateCampaign`, `regenerateJoinCode`, and `deleteCampaign` to `src/db/queries/campaigns.ts`
- Add `updateCampaignForDm` and `deleteCampaignForDm` to `src/services/campaigns.ts`
- Add `/dashboard/campaigns/[id]/edit` page — form for name and join code regeneration, DM only
- Add Server Actions in `[id]/edit/actions.ts` — `updateCampaignAction`, `regenerateJoinCodeAction`
- Add Server Action `deleteCampaignAction` in `[id]/actions.ts`
- Extend campaign detail page with Edit button and Delete button (DM only); Delete triggers a shadcn `AlertDialog`

## Capabilities

### New Capabilities

- `campaign-manage`: DM can edit campaign name, regenerate the join code, and delete the campaign (with confirmation). DM is the only one who can access these actions.

### Modified Capabilities

- `campaign-data-model`: Three new query functions added.
- `campaign-detail`: Detail page extended with Edit and Delete controls for the DM.

## Impact

- `src/lib/authorization.ts` — `isCampaignDm` added
- `src/db/queries/campaigns.ts` — `updateCampaign`, `regenerateJoinCode`, `deleteCampaign` added
- `src/services/campaigns.ts` — `updateCampaignForDm`, `deleteCampaignForDm` added
- `src/app/dashboard/campaigns/[id]/page.tsx` — Edit and Delete controls added (DM only)
- `src/app/dashboard/campaigns/[id]/actions.ts` — `deleteCampaignAction` added
- `src/app/dashboard/campaigns/[id]/edit/page.tsx` — new route
- `src/app/dashboard/campaigns/[id]/edit/actions.ts` — `updateCampaignAction`, `regenerateJoinCodeAction`
- No schema changes; `campaign_characters` rows deleted before campaign on delete
