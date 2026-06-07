## Context

The codebase has zero test coverage. The highest-risk logic falls into three categories:

1. **Pure math** (ability modifier, combat stat formulas) — currently either a one-liner or buried inside a React component's render body, making them invisible to tests.
2. **Turn-order logic** (initiative progression, round wrap, skip defeated/hidden) — currently woven around `await` DB calls inside server actions, but the decision logic itself is pure given a list of combatants.
3. **Authorization checks** (`isCampaignParticipant`, `canViewCharacter`) — server-only functions that delegate to DB queries; testable by mocking those queries.
4. **Service-layer logic** (`listCampaignsForUser` role de-duplication, `generateJoinCode` format) — already importable pure functions or thin wrappers over one query.

## Goals / Non-Goals

**Goals:**
- Fast, DB-free tests for all identified logic paths
- A reusable fixture library (character, campaign, spaceship) typed against the schema
- `calculateCombatStats()` extracted from the React component and tested as a pure function
- Vitest configured and runnable via `npm test`

**Non-Goals:**
- End-to-end or browser tests
- React component rendering tests
- Integration tests against a real database
- 100% code coverage — coverage of important logic paths only

## Decisions

### Vitest over Jest

Vitest is TypeScript-first with zero transpilation configuration, has a Jest-compatible API (same `describe`/`it`/`expect`/`vi.mock` surface), and runs significantly faster. Jest requires Babel or ts-jest to handle TypeScript and Next.js path aliases. The project already uses a modern toolchain (Next.js 16, Tailwind v4) and Vitest fits that posture.

### Test files in `tests/`

Co-location (e.g. `ability.test.ts` next to `ability.ts`) is cleaner for large codebases. However, the fixture files need to be shared across multiple test files, and a shared `tests/fixtures/` directory makes that relationship explicit without a complex import path. All test files live under `tests/` with subdirectories mirroring the source structure (`lib/`, `services/`).

### Extract `calculateCombatStats` from the React component

The combat stat formulas (EAC, KAC, saving throws, attack bonuses, effectiveDex capping) are currently local variable assignments inside `CombatStatsSection`. There is no callable function to test. Extraction into `src/lib/character-stats.ts` as a pure `calculateCombatStats(input) → result` function:
- Makes the formulas testable without rendering React
- Makes the component a thin consumer (single function call)
- Documents the Starfinder formula sheet in one auditable place

The component is updated to destructure the return value of `calculateCombatStats()` instead of computing inline.

### Mock DB queries at the module boundary

Server action and service functions import from `@/db/queries/*`. Tests mock those imports with `vi.mock()`. This keeps tests fast and deterministic, and avoids needing a local Supabase instance.

The `server-only` package and `next/navigation` (`redirect`, `revalidatePath`) must be aliased to no-ops in Vitest config so that server-only modules can be imported in the test environment.

### `finishTurnAction` tested via mocks, not extraction

Unlike the combat stat formulas, `finishTurnAction` is already a standalone `async function`. Mocking its DB calls (`getBattleCombatants`, `updateBattleTurn`) is sufficient to test the turn-progression logic in place. No extraction needed.

## Risks / Trade-offs

- **`server-only` aliasing** → Vitest config aliases `server-only` to a stub module. This means the server-only guard doesn't fire during tests — acceptable since tests don't run in a browser.
- **`next/navigation` mocking** → `redirect()` and `revalidatePath()` are mocked to no-ops. Tests that call server actions containing `redirect("/")` will need to assert on mock call count rather than side effects.
- **Formula accuracy** → Tests encode the Starfinder rules as we understand them. If a formula in the component contains a latent bug, the extracted test will encode that same bug. The extraction is a net gain (the bug becomes visible and fixable) but is not a guarantee of rules correctness.
