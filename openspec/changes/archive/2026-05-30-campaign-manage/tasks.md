## 1. Authorization

- [x] 1.1 Add `isCampaignDm(campaignId: string, userId: string): Promise<boolean>` to `src/lib/authorization.ts`

## 2. Queries Layer

- [x] 2.1 Add `updateCampaign(campaignId: string, data: { name: string })` to `src/db/queries/campaigns.ts` — updates name, returns updated campaign
- [x] 2.2 Add `regenerateJoinCode(campaignId: string)` to `src/db/queries/campaigns.ts` — generates new code (reusing `generateJoinCode` helper extracted from service), updates row, returns new code
- [x] 2.3 Add `deleteCampaign(campaignId: string)` to `src/db/queries/campaigns.ts` — deletes `campaign_characters` rows first, then the campaign row

## 3. Service Layer

- [x] 3.1 Extract `generateJoinCode()` to module-level in `src/services/campaigns.ts` (already local — just move it up so query layer can reuse it, or keep in service and pass generated code to query)
- [x] 3.2 Add `updateCampaignForDm(campaignId, userId, { name })` to `src/services/campaigns.ts` — calls `isCampaignDm`, throws if not DM, calls `updateCampaign`
- [x] 3.3 Add `deleteCampaignForDm(campaignId, userId)` to `src/services/campaigns.ts` — calls `isCampaignDm`, throws if not DM, calls `deleteCampaign`

## 4. Edit Page

- [x] 4.1 Create `src/app/dashboard/campaigns/[id]/edit/actions.ts` — `updateCampaignAction(formData)` and `regenerateJoinCodeAction(campaignId)` Server Actions
- [x] 4.2 Create `src/app/dashboard/campaigns/[id]/edit/page.tsx` — server component: `isCampaignDm` gate (redirect to `[id]` if not DM), renders edit form pre-filled with current name and current join code
- [x] 4.3 Edit form: name input + "Save" button calling `updateCampaignAction`, inline error on empty name, redirect to `[id]` on success
- [x] 4.4 Regenerate section: display current join code + "Regenerate" button calling `regenerateJoinCodeAction`, optimistically updates displayed code on success

## 5. Campaign Detail Page — DM Controls

- [x] 5.1 Install shadcn `alert-dialog` component
- [x] 5.2 Create `src/app/dashboard/campaigns/[id]/actions.ts` with `deleteCampaignAction(campaignId)` Server Action
- [x] 5.3 Create `src/app/dashboard/campaigns/[id]/_components/campaign-actions.tsx` — client component with Edit button (Link) and Delete button (AlertDialog + `deleteCampaignAction`, redirects to `/dashboard/campaigns` on confirm)
- [x] 5.4 Render `<CampaignActions>` on detail page when `isDm` is true

## 6. Lint & Typecheck

- [x] 6.1 Run `npm run lint` and resolve any errors
- [x] 6.2 Run `npx tsc --noEmit` and resolve any type errors
