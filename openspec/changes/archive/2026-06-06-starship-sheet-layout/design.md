## Context

The spaceship editor (`_name-editor.tsx`) is a single large client component. All fields, handlers, and state live there. The current JSX renders everything in a linear `flex flex-col` stack capped at `max-w-2xl`. The goal is to rearrange that JSX into spatial zones matching the PDF Play Sheet (Page 1) without touching any logic, state, or server actions.

## Goals / Non-Goals

**Goals:**
- Match the PDF Page 1 spatial zones: identity | shields | stats at the top; weapons strip in the middle; crew/notes/systems rows below; critical damage at the bottom
- Mobile-first responsive: single column on mobile, expanding to 2-col (sm) and 3-col (lg) zones
- Weapons arcs scroll horizontally on mobile/tablet; grid on desktop

**Non-Goals:**
- No new fields, DB columns, or server actions
- No builder sheet (Page 2) or weapons detail sheet (Page 3) layout
- No visual ship diagram or hex art
- No Security section (no DB backing currently)

## Decisions

### Remove `max-w-2xl`, use `max-w-6xl`
The three-column top row needs room. `max-w-6xl` (72rem) fits a standard desktop viewport and keeps the layout from stretching uncomfortably on ultra-wide screens.

### Top row: CSS grid, not flex
`grid grid-cols-1 lg:grid-cols-3 gap-4` gives all three zones equal width at desktop with automatic stacking on mobile. No JS needed.

### Identity fields: paired sub-grid
Size|Frame and Speed|Maneuverability are paired in the PDF. Use `grid grid-cols-2 gap-2` for those pairs inside the identity column. Name, Make & Model, Tier each span full width in the column.

### Weapons: horizontal scroll strip with `min-w` arc cards
Each arc card gets `min-w-[200px]` inside a `flex gap-3 overflow-x-auto pb-2`. On `lg`, switch to `grid grid-cols-5`. This avoids tabs (which hide content) and avoids wrapping (which loses the spatial relationship). The scroll strip makes all arcs equally visible with a swipe.

### Bottom rows: `grid grid-cols-1 sm:grid-cols-3`
Both the crew/notes/expansion-bays row and the power-core/systems/cargo row use the same responsive grid. Stacks on mobile, 3-col from sm+.

### Note section placement (zone mapping)
The four existing note sections map to PDF zones:
- `notes` → Notes column (middle of bottom row)
- `expansion_bays` → right of bottom row
- `systems` → middle of systems row
- `cargo_passengers` → right of systems row
- Power Core + Drift Engine inputs → left of systems row

Crew section (already a separate component) → left of bottom row.

### Critical damage: full width, bottom
No change to content, just remove its `border-t` separation and let it sit naturally at the bottom of the grid.

## Risks / Trade-offs

- [Long arc weapon lists] Each arc card can grow tall if many weapons are added, making cards uneven in the scroll strip → acceptable; cards align to their own content, no height constraint needed
- [Single component size] `_name-editor.tsx` is already large (~820 lines); the restructure adds grid wrappers but doesn't shrink it. Could split into sub-components later, but the proposal explicitly scopes to layout only.
