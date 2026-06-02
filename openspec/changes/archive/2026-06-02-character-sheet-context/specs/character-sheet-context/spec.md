## ADDED Requirements

### Requirement: Character sheet state is managed in a single context
All mutable client-side character sheet state SHALL be held in a `CharacterContext` accessible via a `useCharacter()` hook. Section components SHALL NOT receive shared state as props; they SHALL consume it from context.

#### Scenario: Section component reads shared state
- **WHEN** a section component (e.g., SkillsSection) needs ability scores or level
- **THEN** it calls `useCharacter()` to obtain those values, not a prop passed from its parent

#### Scenario: Section component updates shared state
- **WHEN** a section component saves a change (e.g., levelling up)
- **THEN** it calls the typed setter from `useCharacter()` (e.g., `setLevel`) to update context state

### Requirement: CharacterProvider initialises state from server-fetched props
The `CharacterProvider` SHALL accept the full initial character state as props and initialise its internal state once on mount. Subsequent state changes SHALL be handled entirely client-side via context setters.

#### Scenario: Page loads with server data
- **WHEN** the server component renders and passes initial data to `CharacterStatsClient`
- **THEN** `CharacterProvider` receives those values and makes them available to all child components via context

### Requirement: characterId and isOwner are available in context
`characterId` and `isOwner` SHALL be included in the context value as read-only fields so that section components do not need them passed as props.

#### Scenario: Section component saves data
- **WHEN** a section component needs to persist a change to the server
- **THEN** it reads `characterId` from `useCharacter()` without requiring it as a prop

### Requirement: Local UI state remains local
State that is only used within a single component (dialog open/close, search input, loading spinners) SHALL remain as `useState` inside that component. Only state shared across two or more components SHALL live in context.

#### Scenario: Dialog open state
- **WHEN** a component manages a picker dialog
- **THEN** the open/close boolean stays as a local `useState` and is not added to context
