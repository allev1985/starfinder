## 1. Database Schema

- [x] 1.1 Add `spaceships` table to `src/db/schema.ts` with `id`, `campaignId` (unique FK → campaigns), `name`, `createdAt` columns and export `Spaceship` / `NewSpaceship` types
- [x] 1.2 Apply Supabase migration to create the `spaceships` table with unique constraint on `campaign_id`

## 2. Data Access Layer

- [x] 2.1 Add `createSpaceship(data)` query to `src/db/queries/campaigns.ts`
- [x] 2.2 Add `getSpaceshipByCampaign(campaignId)` query returning `Spaceship | null`
- [x] 2.3 Add `updateSpaceshipName(spaceshipId, name)` query

## 3. Server Actions

- [x] 3.1 Create `src/app/dashboard/campaigns/[id]/spaceship/actions.ts` with `createSpaceshipAction` and `updateSpaceshipNameAction` (both verify participant auth, revalidate path)

## 4. Spaceship Page

- [x] 4.1 Create `src/app/dashboard/campaigns/[id]/spaceship/page.tsx` — server component that loads the ship via `getSpaceshipByCampaign`, renders create form if null or inline-edit client component if ship exists
- [x] 4.2 Create the create form component (name input + submit button, empty name blocked)
- [x] 4.3 Create the inline-edit component (debounced onChange 600 ms, no save button, calls `updateSpaceshipNameAction`)

## 5. Layout & Sidebar

- [x] 5.1 Update `src/app/dashboard/campaigns/[id]/layout.tsx` to fetch spaceship and pass it to `CampaignSidebar`
- [x] 5.2 Update `src/app/dashboard/campaigns/[id]/_components/campaign-sidebar.tsx` to accept `spaceship` prop and render a "Spaceship" section below Characters with active-link highlight
