## Why

The application has no test coverage. Logic bugs in combat stat formulas, initiative turn progression, and authorization checks are invisible until they surface in a live session. Installing a test suite with mocked DB gives us fast, confident feedback on the rules that matter most to players.

## What Changes

- Install Vitest as the test runner (TypeScript-first, Jest-compatible API)
- Extract combat stat formulas from `combat-stats-section.tsx` into `src/lib/character-stats.ts` so they are testable pure functions
- Create three fixture files (`character`, `campaign`, `spaceship`) that serve as shared test data
- Write test suites covering: ability modifier, combat stat derivations, initiative turn progression, campaign listing role de-duplication, join code format, and authorization checks

## Capabilities

### New Capabilities

- `test-infrastructure`: Vitest runner setup, configuration, and npm script wiring
- `character-stats-lib`: Pure `calculateCombatStats()` function extracted from the React component
- `fixture-library`: Typed fixture objects for character, campaign, and spaceship
- `logic-tests`: AAA test suites for all identified business logic use cases

### Modified Capabilities

- None

## Impact

- New dev dependency: `vitest`
- `src/lib/character-stats.ts` — new file (extracted from component)
- `src/app/dashboard/characters/[id]/_components/combat-stats-section.tsx` — updated to call `calculateCombatStats()` instead of computing inline
- `tests/` — new directory containing fixtures and test files
- `package.json` — adds `"test"` script
