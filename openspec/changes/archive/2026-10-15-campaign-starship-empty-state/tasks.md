## 1. Fix overview page empty state

- [x] 1.1 In `src/app/dashboard/campaigns/[id]/page.tsx`, change the Starship section to always render its `SectionLabel`, instead of being gated entirely behind `spaceships.length > 0`
- [x] 1.2 When `spaceships.length === 0`, render an empty-state message visible to all participants (mirroring the sidebar's "None yet" copy)
- [x] 1.3 When `spaceships.length === 0` and the viewer is the GM (`isGm`), additionally render a "+ Add ship" link pointing to `/dashboard/campaigns/${id}/spaceship/new` (same destination as the sidebar's existing link)
- [x] 1.4 When `spaceships.length > 0`, keep today's list rendering unchanged

## 2. Verify

- [x] 2.1 Run `npm run lint` and `npx tsc --noEmit` — both clean
- [x] 2.2 Manually view the campaign overview page as GM with zero ships: confirm section label + empty state + "+ Add ship" link all appear — verified by user
- [x] 2.3 Manually view the same page as a non-GM participant with zero ships: confirm section label + empty state appear, with no create link — verified by user (note: superseded by `campaign-spaceship-open-create`, which now also shows the create link to non-GM participants)
- [x] 2.4 Create a ship, confirm the list-rendering path (spaceships.length > 0) is unchanged for both roles — verified by user
