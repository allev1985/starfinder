## 1. Campaign layout

- [x] 1.1 Create `src/app/dashboard/campaigns/[id]/layout.tsx` — server component that calls `isCampaignParticipant` and `getCampaignWithCharacters`, redirects non-participants, and renders a flex-row layout with `CampaignSidebar` on the left and `{children}` in the main area
- [x] 1.2 Create `src/app/dashboard/campaigns/[id]/_components/campaign-sidebar.tsx` — client component that receives `campaignId`, `isDm`, `joinCode`, and `characters` as props, uses `usePathname()` to highlight the active character, and renders character links to `/dashboard/campaigns/[id]/characters/[characterId]`
- [x] 1.3 Run `npm run lint && npx tsc --noEmit` and confirm no errors

## 2. Clean up campaign detail page

- [x] 2.1 Remove the duplicate `isCampaignParticipant` auth check and `getCampaignWithCharacters` call from `src/app/dashboard/campaigns/[id]/page.tsx` — the layout now owns both; keep the DM badge, join code display, and character list rendering
- [x] 2.2 Remove the existing inline character list from the campaign detail page (the sidebar now handles navigation); retain any other overview content (DM badge, join code, campaign actions)
- [x] 2.3 Run `npm run lint && npx tsc --noEmit` and confirm no errors
