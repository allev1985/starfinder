## Context

The standalone character sheet at `/dashboard/characters/[id]/page.tsx` loads ~15 parallel queries and passes all data to `CharacterStatsClient`, which uses `CharacterProvider` (context). The `isOwner` boolean in that context gates every editable field. The campaign character route already has auth scaffolding (`isCampaignParticipant`) but renders a placeholder.

The challenge is that the data-loading block is ~60 lines of interleaved `Promise.all` calls inline in the page component. Duplicating it would create two drift-prone copies.

## Goals / Non-Goals

**Goals:**
- Render the full character sheet at the campaign character route
- Character owner sees editable sheet; DM and other participants see read-only
- Single source of truth for the data-loading logic (no duplication)

**Non-Goals:**
- Play mode (tracked per-campaign transient state: spell slots, ammo, credits) — separate change
- Any new DB tables or schema changes
- DM-specific overrides or campaign-level annotations on the sheet

## Decisions

### Extract data loading into a shared server-side helper

Extract the parallel query block from the standalone page into `src/db/queries/character-sheet-loader.ts`, exporting a single async function `loadCharacterSheetData(characterId: string)`. Both the standalone page and the campaign page call it.

**Alternative considered**: A shared Next.js layout component that fetches and passes data via props. Rejected — the App Router doesn't support async data passing from layout to page in a clean way; shared function is simpler and more explicit.

### `isOwner` stays the sole editability gate — no new context shape

The campaign page calls `isCharacterOwner(characterId, userId)` exactly as the standalone page does. `CharacterProvider` receives the same `isOwner` prop. No new props, no `canEdit` rename.

**Alternative considered**: Add a `canEdit` prop distinct from `isOwner` to allow DM editing. Rejected per product decision — DM is read-only, so `canEdit === isOwner` in both contexts. Adding the distinction now would be premature.

### Auth on the campaign character page: two checks

1. `isCampaignParticipant(campaignId, userId)` — gates access (redirect if not a participant)
2. `isCharacterOwner(characterId, userId)` — determines editability

The character must also belong to the campaign (guarded by `getCharacterById` returning null if the character isn't in that campaign).

## Risks / Trade-offs

- **Query volume**: The shared loader runs ~15 queries per page load. This is unchanged from the standalone sheet — no regression, no improvement. Caching/optimisation is future work.
- **Loader becomes a shared dependency**: Changes to what the sheet needs must update the loader. Acceptable trade-off vs. duplication.

## Migration Plan

No DB changes. Deploy is a straight code replace — the campaign character route previously showed a placeholder, so there is no rollback concern.
