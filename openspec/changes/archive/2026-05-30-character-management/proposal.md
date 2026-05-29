## Why

Characters are the core entity players interact with in Starfinder. The characters list is a stub, there is no way to create, view, edit, or delete a character, and the "join campaign" flow doesn't exist yet. This change builds the full character lifecycle with appropriate ownership-based access control.

## What Changes

- Add `isCharacterOwner` and `canViewCharacter` to `src/lib/authorization.ts`
- Add `src/db/queries/characters.ts` — all character-specific query functions
- Add `src/services/characters.ts` — character service layer (create, update, delete, join campaign)
- Replace stub `src/app/dashboard/characters/page.tsx` with a real list of the user's characters
- Add `src/app/dashboard/characters/new/` — create character form
- Add `src/app/dashboard/characters/[id]/` — character detail page with metadata, campaign list, and join campaign inline form (owner only)
- Add `src/app/dashboard/characters/[id]/edit/` — edit character name (owner only)
- Delete is triggered from the character detail page via AlertDialog (owner only)

## Capabilities

### New Capabilities

- `character-management`: Full character lifecycle — create, view, edit, delete, and join campaigns. Access gated by ownership (`isCharacterOwner`) or shared campaign membership (`canViewCharacter`).

### Modified Capabilities

- `campaign-data-model`: New character queries layer (`src/db/queries/characters.ts`) and join-campaign query added.

## Impact

- `src/lib/authorization.ts` — `isCharacterOwner`, `canViewCharacter` added
- `src/db/queries/characters.ts` — new file
- `src/services/characters.ts` — new file
- `src/app/dashboard/characters/page.tsx` — replaced
- `src/app/dashboard/characters/new/` — new route
- `src/app/dashboard/characters/[id]/` — new route
- `src/app/dashboard/characters/[id]/edit/` — new route
- No schema changes; `campaign_characters` FK constraint requires clearing before character delete
