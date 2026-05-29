## 1. Queries Layer

- [x] 1.1 Add `getCampaignWithCharacters(campaignId: string)` to `src/db/queries/campaigns.ts` — returns `{ campaign: Campaign | null, characters: Character[] }`
- [x] 1.2 Add `getCharacterById(characterId: string)` to `src/db/queries/campaigns.ts` — returns `Character | null`

## 2. Auth Utility

- [x] 2.1 Create `src/lib/authorization.ts` with `isCampaignParticipant(campaignId: string, userId: string): Promise<boolean>` — returns true if user is dm_id OR owns a character in `campaign_characters` for that campaign

## 3. Campaign Detail Page

- [x] 3.1 Create `src/app/dashboard/campaigns/[id]/page.tsx` — server component: reads auth user, calls `isCampaignParticipant`, redirects to `/dashboard/campaigns` if false
- [x] 3.2 Render campaign name as heading
- [x] 3.3 Render join code only when user is the DM (`campaign.dmId === user.id`)
- [x] 3.4 Render character list — each character name links to `/dashboard/campaigns/[id]/characters/[characterId]`
- [x] 3.5 Render empty state when no characters have joined yet

## 4. Character Detail Page

- [x] 4.1 Create `src/app/dashboard/campaigns/[id]/characters/[characterId]/page.tsx` — server component: reads auth user, calls `isCampaignParticipant`, redirects to `/dashboard/campaigns` if false
- [x] 4.2 Fetch character by id, render name as heading with stub content area

## 5. Lint & Typecheck

- [x] 5.1 Run `npm run lint` and resolve any errors
- [x] 5.2 Run `npx tsc --noEmit` and resolve any type errors
