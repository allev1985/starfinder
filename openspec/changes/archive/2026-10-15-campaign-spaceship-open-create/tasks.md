## 1. Open up ship creation

- [x] 1.1 In `src/app/dashboard/campaigns/[id]/spaceship/new/page.tsx`, remove the `isGm` lookup and the `if (!isGm) redirect(...)` gate — rely on the campaign layout's existing `isCampaignParticipant` check
- [x] 1.2 In `src/app/dashboard/campaigns/[id]/spaceship/page.tsx`, remove the `isGm` lookup and always render `CreateSpaceshipForm` when there are no ships yet, for any participant
- [x] 1.3 In `src/app/dashboard/campaigns/[id]/_components/campaign-sidebar.tsx`, remove the `isGm &&` guard around the "+ Add ship" `NavItem` so it shows for any participant
- [x] 1.4 In `src/app/dashboard/campaigns/[id]/page.tsx`, remove the `isGm &&` guard around the "+ Add ship" link in the Starship empty state so it shows for any participant

## 2. Verify

- [x] 2.1 Run `npm run lint` and `npx tsc --noEmit` — both clean
- [x] 2.2 Manually, as a non-GM participant with zero ships: confirm "+ Add ship" appears on the overview page, sidebar, and `/spaceship`, and submitting the create form succeeds — verified by user
- [x] 2.3 Manually confirm a non-GM-created ship is immediately editable/deletable by both its creator and the GM — verified by user
- [x] 2.4 Manually confirm a non-participant (not GM, no character in the campaign) still cannot reach any spaceship route for this campaign — verified by user
