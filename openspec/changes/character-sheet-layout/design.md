## Context

The character detail page is a single vertical scroll rendered in `page.tsx` with all sections stacked in `CharacterStatsClient` plus a few components (`HealthResolveSection`, `DescriptionSection`, `SpellsSection`) rendered outside it at page level. The official Starfinder character sheet PDF organises the same information into two pages, each with a two-column grid. The goal is to restructure the React component tree and add tab navigation to match that spatial layout, plus restyle section headers to use the design system's primary colour as a label-badge.

## Goals / Non-Goals

**Goals:**
- Two-tab structure: "Stats" (page 1 of sheet) and "Abilities & Gear" (page 2), plus "Spells" for spellcasters
- Two-column grid layout within each tab
- Section headers restyled as `bg-primary text-primary-foreground` bold-caps bars
- Formula-box display for combat stats (Initiative, EAC/KAC, Saves, Attack Bonuses)
- `HealthResolveSection` pulled into `CharacterStatsClient` so it can be placed in tab 1
- Weapons separated from armor/equipment across tabs

**Non-Goals:**
- No schema changes, no new database columns
- No new data fields (Upgraded scores, Bulk, Credits, XP, Speed, etc.)
- No mobile-first breakpoint design (desktop two-column is the target; columns collapse naturally on small screens via Tailwind responsive prefixes)
- No changes to `DescriptionSection`, `MechanicPanel`, or the Campaigns section (they stay outside the tabs at page level)

## Decisions

### Tabs component
Use shadcn/ui `Tabs` / `TabsList` / `TabsTrigger` / `TabsContent` — already available in the project. No new dependency.

### HealthResolveSection placement
`HealthResolveSection` currently lives outside `CharacterStatsClient` in `page.tsx`, making it impossible to co-locate it with the other right-column stats without lifting state. The fix: pass all health/resolve props through `CharacterStatsClient`'s Props type, and render `HealthResolveSection` inside the client component in tab 1's right column. `page.tsx` stops rendering it separately.

### Weapons vs armor/equipment split
The existing `InventorySection` accepts all three subsections as a single component. Rather than splitting it into separate components, add a `tab` prop (or render two separate `InventorySection`-like containers) — the simpler path is to inline the weapon picker/cards and armor/equipment components directly in `CharacterStatsClient`'s two tab columns, removing the `InventorySection` wrapper. This gives direct control over placement without a new prop API.

### Formula-box display
The pattern `[total] = [base] + [mod] + [misc]` appears in Initiative, EAC, KAC, Fort, Ref, Will, Melee, Ranged, and Thrown. Rather than a shared component, implement the pattern as an inline Tailwind `flex` row of bordered cells in `CombatStatsSection`. Three similar instances do not justify an abstraction.

### Section header style
Replace every `<h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">` with `<h2 className="mb-3 inline-block bg-primary px-3 py-0.5 text-xs font-bold uppercase tracking-widest text-primary-foreground">`. Uniform across all ten section components — no shared helper needed.

## Risks / Trade-offs

- **HealthResolveSection prop threading** — CharacterStatsClient's Props type grows by ~6 fields. Acceptable; the component already has ~30 props. → No mitigation needed.
- **Two-column layout on narrow screens** — `grid-cols-2` will squeeze content on viewports under ~768px. Apply `md:grid-cols-2 grid-cols-1` so single-column stacking happens naturally on mobile. → Low risk, one-line fix per tab.
- **InventorySection removal** — Inlining its contents directly into CharacterStatsClient means `inventory-section.tsx` becomes unused and can be deleted. Verify no other page imports it before removing. → Grep before delete.

## Migration Plan

No database migrations. Changes are purely component-level. Deploy is a standard Next.js build + deploy.
