## Why

`CharacterStatsClient` has grown into a prop-drilling hub: 87 props in, 10+ `useState` calls, and every new feature requires threading new state + callbacks through the component tree. A shared React Context replaces this with a single place to read and update character sheet state.

## What Changes

- Introduce a `CharacterContext` that holds all mutable client-side character sheet state
- Replace individual `useState` calls in `CharacterStatsClient` with a single context provider
- Remove all `on*Change` callback props from child section components — they read from context directly
- `CharacterStatsClient` becomes a thin layout shell that initialises the provider from server-fetched props

## Capabilities

### New Capabilities

- `character-sheet-context`: React Context providing unified character sheet state and typed setters to all child section components

### Modified Capabilities

<!-- No spec-level behaviour is changing — only the internal state management mechanism. Existing specs remain valid. -->

## Impact

- `src/app/dashboard/characters/[id]/_components/character-stats-client.tsx` — simplified to provider wrapper + layout
- `src/app/dashboard/characters/[id]/_components/` — all section components updated to consume context instead of receiving state as props
- New file: `src/app/dashboard/characters/[id]/_components/character-context.tsx`
- No database, API, or UI behaviour changes
- No new dependencies
