## 1. Queries Layer

- [x] 1.1 Add `getCampaignsForUser(userId: string)` to `src/db/queries/campaigns.ts` — returns `{ dmCampaigns: Campaign[], playerCampaigns: Campaign[] }` by running two typed Drizzle selects: one filtering `campaigns.dmId`, one joining `campaign_characters` and `characters` on `characters.ownerId`

## 2. Service Layer

- [x] 2.1 Add `listCampaignsForUser(userId: string)` to `src/services/campaigns.ts` — calls `getCampaignsForUser`, merges into a `Map<string, Campaign & { role: 'dm' | 'player' }>` keyed by campaign id (DM entries take precedence), returns the values as an array

## 3. Campaigns List Page

- [x] 3.1 Replace `src/app/dashboard/campaigns/page.tsx` with a server component that reads the auth user, calls `listCampaignsForUser`, and renders the campaign list
- [x] 3.2 Render each campaign as a row with: campaign name linked to `/dashboard/campaigns/[id]`, and a role badge (`DM` or `Player`)
- [x] 3.3 Render an empty state message when the list is empty

## 4. Lint & Typecheck

- [x] 4.1 Run `npm run lint` and resolve any errors
- [x] 4.2 Run `npx tsc --noEmit` and resolve any type errors
