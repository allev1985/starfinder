## 1. Schema

- [x] 1.1 Replace `src/db/schema.ts` — remove placeholder, define `campaigns`, `characters`, and `campaign_characters` tables using Drizzle's `pgTable`, `uuid`, `text`, `timestamp` builders
- [x] 1.2 Run `npm run db:generate` to produce the migration SQL file
- [x] 1.3 Delete the old placeholder migration file from `supabase/migrations/`
- [x] 1.4 Run `supabase db reset` (or `npx supabase db reset`) to apply the new migration to the local database

## 2. Queries Layer

- [x] 2.1 Create `src/db/queries/campaigns.ts` with `createCampaign(data)` and `getCampaignsByDm(dmId)` functions — Drizzle only, `server-only` import at top

## 3. Service Layer

- [x] 3.1 Create `src/services/campaigns.ts` with `createCampaignForUser({ name, dmId })` — generates join code, calls `createCampaign` query, retries once on unique constraint violation

## 4. Create Campaign Page

- [x] 4.1 Create `src/app/dashboard/campaigns/new/actions.ts` — Server Action `createCampaignAction(formData)`: gets auth user, validates name, calls service, returns `{ success, campaignId } | { success: false, error }`
- [x] 4.2 Create `src/app/dashboard/campaigns/new/page.tsx` — client component with campaign name input, submit button, inline error display; on success redirects to `/dashboard/campaigns`

## 5. Lint & Typecheck

- [x] 5.1 Run `npm run lint` and resolve any errors
- [x] 5.2 Run `npx tsc --noEmit` and resolve any type errors
