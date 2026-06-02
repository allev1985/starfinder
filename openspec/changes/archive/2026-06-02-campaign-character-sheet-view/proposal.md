## Why

Characters joined to a campaign are listed on the campaign detail page but clicking through shows a placeholder. Campaign participants (DM and fellow players) need to be able to view a character's full sheet; the character owner needs to be able to edit it from the campaign context as they would from the standalone character route.

## What Changes

- The campaign character route (`/dashboard/campaigns/[id]/characters/[characterId]`) renders the full character sheet instead of the "coming soon" placeholder
- Character owners see an editable sheet (same behaviour as the standalone `/dashboard/characters/[id]` route)
- DMs and other campaign participants see a read-only sheet
- The heavy data-loading logic is extracted from the standalone character page into a shared helper so both routes reuse it without duplication

## Capabilities

### New Capabilities

- `campaign-character-sheet`: Rendering and access-control rules for viewing a character sheet in the campaign context

### Modified Capabilities

- `character-sheet-context`: `isOwner` in `CharacterContext` must remain the sole gate for editability; the campaign page derives it the same way (viewer is the character's owner), ensuring DMs and other players see read-only fields without any new context shape changes

## Impact

- `src/app/dashboard/campaigns/[id]/characters/[characterId]/page.tsx` — replaced with full sheet render
- `src/app/dashboard/characters/[id]/page.tsx` — data-loading extracted to shared helper
- New shared helper (e.g. `src/db/queries/character-sheet-loader.ts`) — consolidates the parallel query block
- `src/lib/authorization.ts` — no changes needed; `isCharacterOwner` already exists
