## 1. Database

- [ ] 1.1 Write a Supabase migration to drop the unique constraint on `spaceships.campaign_id`
- [ ] 1.2 Apply the migration via MCP Supabase tool
- [x] 1.3 Remove `.unique()` from `spaceships.campaignId` in `src/db/schema.ts`

## 2. Query Layer

- [x] 2.1 Add `getSpaceshipsByCampaign(campaignId)` to `src/db/queries/campaigns.ts` — returns `Spaceship[]` ordered by `created_at` ascending
- [x] 2.2 Remove `getSpaceshipByCampaign` (single-result version) and update all callers

## 3. Route Restructure

- [x] 3.1 Create `src/app/dashboard/campaigns/[id]/spaceship/[shipId]/` directory and move the current editor page to `page.tsx` there — update it to accept `shipId` param and fetch by `getSpaceshipById`
- [x] 3.2 Rewrite `src/app/dashboard/campaigns/[id]/spaceship/page.tsx` to redirect to the first ship (by `created_at`) if ships exist, or render the empty/create state if none exist
- [x] 3.3 Move `_create-form.tsx` to the `[shipId]` sibling level (or keep it accessible from the root page) — ensure creating a ship navigates to the new ship's URL

## 4. Layout

- [x] 4.1 Update `src/app/dashboard/campaigns/[id]/layout.tsx` to call `getSpaceshipsByCampaign` and pass `spaceships: Spaceship[]` to the sidebar (remove old `spaceship: Spaceship | null`)

## 5. Sidebar

- [x] 5.1 Update `CampaignSidebar` props: replace `spaceship: Spaceship | null` with `spaceships: Spaceship[]`
- [x] 5.2 Render the Spaceship section as a list of named links (one per ship), mirroring the Characters section pattern
- [x] 5.3 Add a DM-only "+ Add ship" link at the bottom of the Spaceship section (links to the root `/spaceship` page or triggers the create form)
- [x] 5.4 Apply active state highlight to the current ship's sidebar entry

## 6. Actions & Delete

- [x] 6.1 Update `_spaceship-actions.tsx` so that after deleting a ship it redirects to `/campaigns/[id]/spaceship` (not to a specific ship URL)

## 7. Lint & Typecheck

- [x] 7.1 Run `npm run lint` and resolve all errors
- [x] 7.2 Run `npx tsc --noEmit` and resolve all type errors
