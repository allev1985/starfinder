## 1. Database Migration

- [x] 1.1 Write Supabase migration to create `spaceship_crew` table (`id`, `spaceship_id` FK, `character_id` FK, `role` text, `created_at`)
- [x] 1.2 Add partial unique index on `(spaceship_id, role)` WHERE role IN ('captain', 'pilot')
- [ ] 1.3 Apply migration via Supabase MCP
- [x] 1.4 Add `spaceshipCrew` table definition and types to `src/db/schema.ts`
- [x] 1.5 Generate updated TypeScript types

## 2. Database Queries & Server Actions

- [x] 2.1 Add `getCrewBySpaceship(spaceshipId)` query to `src/db/queries/campaigns.ts`
- [x] 2.2 Add `assignCrewAction(campaignId, spaceshipId, characterId, role)` server action — deletes existing row for singleton roles before inserting
- [x] 2.3 Add `removeCrewAction(campaignId, crewId)` server action

## 3. Spaceship Page — Data Fetching

- [x] 3.1 Import `getCampaignWithCharacters` (or equivalent) in `spaceship/page.tsx` to fetch campaign characters
- [x] 3.2 Import `getCrewBySpaceship` and fetch existing crew assignments in `spaceship/page.tsx`
- [x] 3.3 Pass `characters` and `initialCrew` props through `SpaceshipEditor`

## 4. Crew Section Component

- [x] 4.1 Create `src/app/dashboard/campaigns/[id]/spaceship/_crew-section.tsx` client component
- [x] 4.2 Render five role groups: Captain, Pilot, Engineers, Gunners, Science Officers
- [x] 4.3 Singleton groups (Captain, Pilot): select dropdown of campaign characters; selecting replaces current assignment
- [x] 4.4 Multi-slot groups (Engineers, Gunners, Science Officers): select dropdown to add; each member shown as removable row with character name and ×
- [x] 4.5 Wire Add / remove buttons to `assignCrewAction` and `removeCrewAction`
- [x] 4.6 Manage optimistic local state so UI updates immediately without a page reload

## 5. Wire into Editor

- [x] 5.1 Import and render `CrewSection` at the bottom of `_name-editor.tsx` inside a `border-t pt-5` block
- [x] 5.2 Update `SpaceshipEditor` props type to accept `characters` and `initialCrew`

## 6. Lint & Type Check

- [x] 6.1 Run `npm run lint` and fix any issues
- [x] 6.2 Run `npx tsc --noEmit` and fix any type errors
