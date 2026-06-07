## ADDED Requirements

### Requirement: Vitest is installed and configured
The project SHALL have Vitest installed as a dev dependency and configured to run TypeScript test files under `tests/`. The configuration SHALL alias `server-only` to a stub module and mock `next/navigation` so server-only source files can be imported in tests.

#### Scenario: Run tests via npm
- **WHEN** the developer runs `npm test`
- **THEN** Vitest discovers and runs all `*.test.ts` files under `tests/`

#### Scenario: server-only imports do not crash tests
- **WHEN** a test file imports a module that contains `import "server-only"`
- **THEN** the import succeeds and the test runs without error

#### Scenario: Path aliases resolve in tests
- **WHEN** a test file imports using `@/lib/ability`
- **THEN** Vitest resolves the alias to `src/lib/ability.ts` correctly

### Requirement: next/navigation is mocked globally
The test setup SHALL mock `next/navigation` so that `redirect()` and `revalidatePath()` are replaced with no-op vi functions. Tests that trigger redirects SHALL be able to assert on the mock without causing test runner errors.

#### Scenario: redirect does not throw in tests
- **WHEN** a server action calls `redirect("/")` during a test
- **THEN** the call is intercepted by the vi mock and does not throw or exit the test
