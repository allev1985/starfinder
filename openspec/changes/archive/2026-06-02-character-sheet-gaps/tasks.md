## 1. Database Schema & Migration

- [x] 1.1 Add `dr` (text, nullable) and `resistances` (text, nullable) columns to the `armor` table in `src/db/schema.ts`
- [x] 1.2 Add `credits` (integer, not null, default 0) column to the `characters` table in `src/db/schema.ts`
- [x] 1.3 Add `xp_earned` (integer, not null, default 0) column to the `characters` table in `src/db/schema.ts`
- [x] 1.4 Add `languages` (text[], not null, default `{}`) column to the `characters` table in `src/db/schema.ts`
- [x] 1.5 Apply migration via Supabase MCP (`mcp__claude_ai_Supabase__apply_migration`) with all four column additions in one SQL statement

## 2. Query & Type Updates

- [x] 2.1 Verify `src/db/queries/characters.ts` — `getCharacterWithCampaigns` and related queries return the new `credits`, `xpEarned`, and `languages` fields from `characters`
- [x] 2.2 Verify the `Armor` type (inferred from schema) now includes `dr` and `resistances` — no manual change needed if Drizzle infers correctly
- [x] 2.3 Add `getCharacterMiscFields` query (or extend existing) to fetch `credits`, `xpEarned`, `languages` for a character ID

## 3. Server Actions

- [x] 3.1 Add `updateCreditsAction(characterId, credits)` server action in a new `src/app/dashboard/characters/[id]/actions.ts` section (or extend existing actions file)
- [x] 3.2 Add `updateXpAction(characterId, xpEarned)` server action
- [x] 3.3 Add `addLanguageAction(characterId, language)` server action (appends to array)
- [x] 3.4 Add `removeLanguageAction(characterId, language)` server action (removes from array)

## 4. DR & Resistances — Combat Stats Display

- [x] 4.1 Update `CombatStatsSection` props in `combat-stats-section.tsx` to accept `equippedArmorDr: string | null` and `equippedArmorResistances: string | null`
- [x] 4.2 Render a DR row and a Resistances row in the Armor Class section, showing the value or "—" when null/empty
- [x] 4.3 Pass `equippedArmor?.dr ?? null` and `equippedArmor?.resistances ?? null` from `character-stats-client.tsx` into `CombatStatsSection`

## 5. Credits & XP Component

- [x] 5.1 Create `src/app/dashboard/characters/[id]/_components/credits-xp-section.tsx` with two numeric inputs (Credits, XP Earned) using the 600 ms debounced onChange save pattern from `ability-scores-section.tsx`
- [x] 5.2 Wire Credits input to `updateCreditsAction` and XP input to `updateXpAction`
- [x] 5.3 Render inputs as read-only text for non-owners

## 6. Languages Component

- [x] 6.1 Create `src/app/dashboard/characters/[id]/_components/languages-section.tsx` with a badge list and an add input (owner only)
- [x] 6.2 Add input form: on submit (Enter or button click) call `addLanguageAction` and update local state; reject empty/whitespace inputs
- [x] 6.3 Render each language as a badge with an ×-button (owner only) that calls `removeLanguageAction` and updates local state
- [x] 6.4 Show "No languages added" placeholder when list is empty and viewer is owner

## 7. Wire Into Character Sheet

- [x] 7.1 Update `page.tsx` to fetch and pass `credits`, `xpEarned`, `languages` to `CharacterStatsClient`
- [x] 7.2 Update `CharacterStatsClient` props and render `CreditsXpSection` in the gear tab (above or below equipment inventory)
- [x] 7.3 Update `CharacterStatsClient` to render `LanguagesSection` in the gear tab (below feats/features column)

## 8. Lint & Typecheck

- [x] 8.1 Run `npm run lint` and fix any issues
- [x] 8.2 Run `npx tsc --noEmit` and fix any type errors
