## 1. Vitest Setup

- [x] 1.1 Install `vitest` as a dev dependency
- [x] 1.2 Create `vitest.config.ts` with path alias resolution (`@/*` → `src/*`), `server-only` stub alias, and `next/navigation` mock
- [x] 1.3 Add `"test": "vitest"` script to `package.json`
- [x] 1.4 Verify `npm test` runs without errors on an empty test suite

## 2. Extract calculateCombatStats

- [x] 2.1 Create `src/lib/character-stats.ts` with `CombatStatsInput` and `CombatStatsResult` types and the `calculateCombatStats()` function containing all formulas from `combat-stats-section.tsx`
- [x] 2.2 Update `combat-stats-section.tsx` to import and call `calculateCombatStats()` instead of computing values inline
- [x] 2.3 Run `npm run lint` and `npx tsc --noEmit` — confirm no errors

## 3. Fixture Library

- [x] 3.1 Create `tests/fixtures/character.ts` exporting `characterFixture` (Character), `combatStatsFixture` (CharacterCombatStats), and `armorFixture` (Armor)
- [x] 3.2 Create `tests/fixtures/campaign.ts` exporting `campaignFixture` (Campaign), `dmUserId`, `playerUserId`, `battleFixture` (Battle), and `combatantsFixture` (BattleCombatant[]) with 3+ combatants including one defeated
- [x] 3.3 Create `tests/fixtures/spaceship.ts` exporting `spaceshipFixture` (Spaceship) and `spaceshipWeaponsFixture` (SpaceshipWeapon[]) with weapons in two arcs

## 4. Ability Modifier Tests

- [x] 4.1 Create `tests/lib/ability.test.ts` with AAA tests for `modifier()` covering scores 1, 7, 10, 11, 18

## 5. Combat Stats Tests

- [x] 5.1 Create `tests/lib/character-stats.test.ts` with AAA tests for `calculateCombatStats()` covering: effectiveDex uncapped, armor cap, shield cap (takes min), shield proficiency gating on EAC/KAC, kacVsCm formula, melee/ranged/thrown attack totals, Fort/Ref/Will saves, initiative total

## 6. Initiative Turn-Progression Tests

- [x] 6.1 Create `tests/initiative/turn-progression.test.ts` mocking `@/db/queries/battles`, `@/db/queries/campaigns`, `@/db/queries/characters`, and `@/lib/session`
- [x] 6.2 Write test: normal advance to next eligible combatant
- [x] 6.3 Write test: skip defeated combatant
- [x] 6.4 Write test: skip hidden combatant
- [x] 6.5 Write test: round wrap increments round and returns to first eligible
- [x] 6.6 Write test: round wrap skips defeated combatant at head of sorted list

## 7. Campaign Service Tests

- [x] 7.1 Create `tests/services/campaigns.test.ts` mocking `@/db/queries/campaigns`
- [x] 7.2 Write tests for `generateJoinCode()`: length 6, charset A-Z0-9, basic uniqueness across 20 calls
- [x] 7.3 Write tests for `listCampaignsForUser()`: player-only, DM-only, DM wins when in both lists

## 8. Authorization Tests

- [x] 8.1 Create `tests/lib/authorization.test.ts` mocking `@/db/queries/campaigns` and `@/db/queries/characters`
- [x] 8.2 Write tests for `isCampaignParticipant()`: DM true (short-circuits), player-with-character true, stranger false
- [x] 8.3 Write tests for `canViewCharacter()`: owner true, DM-of-campaign true, stranger false
