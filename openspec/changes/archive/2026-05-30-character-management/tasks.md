## 1. Authorization

- [x] 1.1 Add `isCharacterOwner(characterId: string, userId: string): Promise<boolean>` to `src/lib/authorization.ts`
- [x] 1.2 Add `canViewCharacter(characterId: string, userId: string): Promise<boolean>` to `src/lib/authorization.ts` — owner check first, then shared-campaign membership check

## 2. Queries Layer

- [x] 2.1 Create `src/db/queries/characters.ts` with `getCharactersByOwner(ownerId)`, `createCharacter(data)`, `updateCharacter(id, data)`, `deleteCharacter(id)` (clears campaign_characters first), `getCharacterWithCampaigns(characterId)`, `findCampaignByJoinCode(code)`, `joinCampaign(campaignId, characterId)`

## 3. Service Layer

- [x] 3.1 Create `src/services/characters.ts` with `createCharacterForUser({ name, ownerId })`, `updateCharacterForOwner(characterId, userId, { name })`, `deleteCharacterForOwner(characterId, userId)`, `joinCampaignForOwner(characterId, userId, joinCode)` — each calls `isCharacterOwner` and throws if not owner; `joinCampaignForOwner` also handles invalid-code and already-joined errors

## 4. Characters List Page

- [x] 4.1 Replace `src/app/dashboard/characters/page.tsx` — server component: fetches `getCharactersByOwner(user.id)`, renders list with links to `/dashboard/characters/[id]`, empty state, `+ New` link

## 5. Create Character Page

- [x] 5.1 Create `src/app/dashboard/characters/new/actions.ts` — `createCharacterAction(formData)` Server Action
- [x] 5.2 Create `src/app/dashboard/characters/new/page.tsx` — client component: name input, submit button, inline error, redirect to `/dashboard/characters/[id]` on success

## 6. Character Detail Page

- [x] 6.1 Create `src/app/dashboard/characters/[id]/actions.ts` — `deleteCharacterAction(characterId)` and `joinCampaignAction(characterId, formData)` Server Actions
- [x] 6.2 Create `src/app/dashboard/characters/[id]/page.tsx` — server component: `canViewCharacter` gate, fetch `getCharacterWithCampaigns`, compute `isOwner = character.ownerId === user.id`
- [x] 6.3 Render character name and created date
- [x] 6.4 Render campaigns list (each links to `/dashboard/campaigns/[campaignId]`)
- [x] 6.5 Render join campaign inline form (owner only) — join code input + "Join" button; calls `joinCampaignAction`; shows inline errors for invalid code or already joined; calls `router.refresh()` on success
- [x] 6.6 Create `src/app/dashboard/characters/[id]/_components/character-actions.tsx` — client component: Edit button + Delete AlertDialog (owner only), calls `deleteCharacterAction`
- [x] 6.7 Render `<CharacterActions>` when `isOwner` is true

## 7. Edit Character Page

- [x] 7.1 Create `src/app/dashboard/characters/[id]/edit/actions.ts` — `updateCharacterAction(characterId, formData)` Server Action
- [x] 7.2 Create `src/app/dashboard/characters/[id]/edit/page.tsx` — server component: `isCharacterOwner` gate (redirect to `[id]` if not owner), renders edit form
- [x] 7.3 Create `src/app/dashboard/characters/[id]/edit/_edit-form.tsx` — client component: name input pre-filled, save + cancel buttons

## 8. Lint & Typecheck

- [x] 8.1 Run `npm run lint` and resolve any errors
- [x] 8.2 Run `npx tsc --noEmit` and resolve any type errors
