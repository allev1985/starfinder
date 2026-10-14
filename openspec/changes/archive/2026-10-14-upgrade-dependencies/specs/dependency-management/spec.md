## ADDED Requirements

### Requirement: Single package manager
The repository SHALL use exactly one package manager (pnpm) for installing and locking dependencies. No other package manager's lockfile (e.g. `package-lock.json`, `yarn.lock`) SHALL be committed alongside `pnpm-lock.yaml`.

#### Scenario: Only one lockfile is committed
- **WHEN** inspecting the repository root
- **THEN** `pnpm-lock.yaml` is present and no `package-lock.json` or `yarn.lock` file exists

#### Scenario: Installing dependencies
- **WHEN** a contributor runs `pnpm install`
- **THEN** `node_modules` is populated matching `pnpm-lock.yaml` with no lockfile conflicts reported

### Requirement: Dependencies stay current
Direct dependencies in `package.json` SHALL be kept at their latest stable published version unless a specific, documented reason requires pinning to an older version.

#### Scenario: Checking for drift
- **WHEN** running `npm outdated` (or `pnpm outdated`) against `package.json`
- **THEN** no direct dependency reports a newer "Wanted"/"Latest" version without a corresponding documented exception
