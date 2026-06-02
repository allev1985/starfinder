## Context

`CharacterStatsClient` is the single client boundary for the character sheet. It currently initialises ~10 `useState` calls and passes each value + a setter callback down to every section component. Adding any new field requires: a new `useState`, a new prop in the `Props` type, a new parameter in the destructure, and threading the callback down to the relevant child.

The character sheet has ~15 section components. Most only need a subset of the shared state, but they all receive it indirectly through `CharacterStatsClient`.

## Goals / Non-Goals

**Goals:**
- Single context file (`character-context.tsx`) that owns all mutable character sheet state
- `CharacterStatsClient` becomes a layout-only shell — no state, no callbacks
- Section components read/write via `useCharacter()` hook, no prop drilling
- Future features add state only to the context file

**Non-Goals:**
- Not changing any server-side data fetching (stays in `page.tsx`)
- Not changing any save/persist logic (stays in each component's debounced save calls)
- Not introducing `useReducer`, external state libraries, or optimistic updates
- Not changing any UI, layout, or visual behaviour

## Decisions

### Use React Context with typed setters (not useReducer)

The mutations on this sheet are simple independent field updates — no complex multi-step transitions or actions that need an event log. Typed setters (`setLevel`, `setScores`, `setEquippedArmor`) are more readable and have less ceremony than a dispatch/action pattern. `useReducer` would add formality without benefit here.

*Alternative considered*: `useReducer` — rejected because no action vocabulary is needed; each setter maps 1:1 to a field update.

*Alternative considered*: Zustand — rejected to avoid a new dependency. Context is sufficient for a single-page sheet with no cross-route state sharing.

### Context initialised from server props in CharacterStatsClient

The server component (`page.tsx`) fetches all data and passes it as props to `CharacterStatsClient`. The provider is created inside `CharacterStatsClient`, initialising state from those props. This keeps the data-fetching boundary clean and unchanged.

### characterId lives in context

Every section component needs `characterId` for its save calls. Rather than keep it as a prop on every component, it moves into context as a read-only value alongside the mutable state.

### isOwner lives in context

Same reasoning as `characterId` — it's needed by almost every section and is read-only after mount.

### Local UI state stays local

Dialog open/close, search input, loading states — these stay as `useState` inside each component. Only state that is shared across components moves to context.

## Risks / Trade-offs

- **All section components re-render on any context change** → This is acceptable for now. Each field update only changes one slice of context; the sheet is not performance-sensitive. If this becomes an issue, context can be split by domain (combat, gear, etc.) later without changing the public API.
- **Context is not typed as read-only** → Setters are only meaningful for owners; components already gate mutations behind `isOwner`. No additional protection is needed.

## Migration Plan

1. Create `character-context.tsx` with `CharacterState`, `CharacterContext`, `CharacterProvider`, and `useCharacter` hook
2. Move all `useState` calls from `CharacterStatsClient` into `CharacterProvider`
3. Wrap the layout JSX in `CharacterStatsClient` with `<CharacterProvider>`
4. Update each section component: remove state props + callback props from its `Props` type, replace with `useCharacter()` call
5. Lint + typecheck after each component to catch stale prop references

No rollback complexity — this is a pure refactor with no behaviour change.
