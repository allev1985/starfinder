## 1. Extract shared data loader

- [x] 1.1 Create `src/db/queries/character-sheet-loader.ts` and move the full parallel query block out of the standalone character page into an exported `loadCharacterSheetData(characterId: string)` function
- [x] 1.2 Update `src/app/dashboard/characters/[id]/page.tsx` to call `loadCharacterSheetData` and remove the inline query block (behaviour unchanged)
- [x] 1.3 Run `npm run lint && npx tsc --noEmit` and confirm no errors

## 2. Campaign character page

- [x] 2.1 Replace the placeholder in `src/app/dashboard/campaigns/[id]/characters/[characterId]/page.tsx` with auth checks: redirect non-participants to `/dashboard/campaigns`, redirect if character not found in this campaign
- [x] 2.2 Call `loadCharacterSheetData(characterId)` and `isCharacterOwner(characterId, user.id)` to get sheet data and editability flag
- [x] 2.3 Render `CharacterStatsClient` with all props (identical to standalone page), passing the computed `isOwner` value
- [x] 2.4 Add a breadcrumb back to the campaign detail page (already present as a stub — wire it up)
- [x] 2.5 Run `npm run lint && npx tsc --noEmit` and confirm no errors
