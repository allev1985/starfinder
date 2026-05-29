## Context

The campaign detail page exists and already computes `isDm` inline. The `authorization.ts` util has `isCampaignParticipant` but no DM-specific check. The queries layer has read operations but no mutations beyond create. Services have `createCampaignForUser` and `listCampaignsForUser`.

## Goals / Non-Goals

**Goals:**
- `isCampaignDm` auth utility for edit/delete pages (avoids fetching campaign just to check dmId)
- Edit page: name field + join code regeneration button, each with separate Server Actions
- Delete: AlertDialog on detail page → Server Action → redirect to `/dashboard/campaigns`
- `deleteCampaignForDm` clears `campaign_characters` rows before deleting the campaign (FK constraint)

**Non-Goals:**
- Transferring DM ownership
- Bulk operations
- Soft delete / campaign archiving
- Editing join code to a custom value (regeneration only)

## Decisions

### 1. `isCampaignDm` in `authorization.ts`, not inline

All auth checks live in `src/lib/authorization.ts`. The edit and delete pages call `isCampaignDm` before doing anything — consistent with how `isCampaignParticipant` is used on the detail and character pages.

The detail page keeps its inline `campaign.dmId === user.id` for the UI flag since the campaign is already fetched there — no extra query needed.

### 2. Separate Server Actions for name update vs. join code regeneration

These are distinct operations: one takes user input, the other is side-effect-only. Keeping them separate avoids a combined form where submitting the name also silently regenerates the code (or vice versa). The edit page has a "Save name" button and a standalone "Regenerate join code" button.

### 3. Join code regeneration reuses service-layer code

`regenerateJoinCode(campaignId)` in the query layer generates a new code using the same `generateJoinCode()` utility already in `src/services/campaigns.ts` (extracted to a shared helper), updates the row, and returns the new code. Collision retry logic is the same as campaign creation.

### 4. Delete order: campaign_characters first, then campaign

The `campaign_characters` FK has `ON DELETE no action`. `deleteCampaignForDm` in the service layer:
1. Verifies DM via `isCampaignDm`
2. Deletes all `campaign_characters` rows for the campaign
3. Deletes the campaign row

No migration needed.

### 5. AlertDialog is a client component on the detail page

The detail page is a server component. The Delete button + AlertDialog are extracted to a `DeleteCampaignButton` client component that imports `deleteCampaignAction` and handles the dialog state. Pattern matches `SignOutButton` already in the codebase.

### 6. Edit page is DM-only; non-DMs redirected to detail page

`isCampaignDm` gate on `/[id]/edit` redirects to `/dashboard/campaigns/[id]` (not the list) — the user is still a participant, just not the DM.

## Risks / Trade-offs

- **Delete is irreversible** → AlertDialog confirmation mitigates accidental deletes; no undo.
- **Regenerating join code invalidates existing share links** → By design; DM accepts this by clicking the button.
- **`generateJoinCode` extraction** → Moving it from inside `createCampaignForUser` to a module-level helper in `services/campaigns.ts` is a minor refactor but keeps it DRY.
