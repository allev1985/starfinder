## Why

The character detail page is a single infinite vertical scroll with plain section headers, bearing no resemblance to the official Starfinder character sheet that players are familiar with. Restructuring the layout to match the sheet's two-column, two-tab organisation — and restyling section headers to use the design system's primary colour — makes the app instantly recognisable and usable to anyone who has played Starfinder.

## What Changes

- **Tab navigation** replaces the infinite scroll: Tab 1 "Stats" (page 1 of the sheet), Tab 2 "Abilities & Gear" (page 2), Tab 3 "Spells" (conditional, spellcasters only)
- **Two-column grid** within each tab mirrors the sheet's left/right column organisation
- **Section headers** restyled from small muted uppercase text to `bg-primary text-primary-foreground` bold-caps bars matching the sheet's label-badge style
- **Formula-box display** in combat stats: each component (total, base, mod, misc) rendered in its own bordered cell matching the sheet's `[total] = [base] + [mod] + [misc]` pattern
- **HealthResolveSection** moved from `page.tsx` into `CharacterStatsClient` so it can be placed in tab 1's right column alongside Initiative and Armor Class
- **Weapons split from armor/equipment**: weapons render in tab 1 right column; armor and equipment render in tab 2 right column

## Capabilities

### New Capabilities

- `character-sheet-tabs`: Tab navigation splitting the character sheet into Stats / Abilities & Gear / Spells views

### Modified Capabilities

- `character-health-resolve`: Component moves from page-level into `CharacterStatsClient`; no behaviour change, placement changes
- `character-combat-stats`: Formula-box visual treatment for Initiative, EAC/KAC, Saving Throws, Attack Bonuses
- `inventory-section`: Weapons separated from armor/equipment for placement in different tabs
- `character-sheet-attributes`: Section header style updated across all character sheet sections

## Impact

- `src/app/dashboard/characters/[id]/page.tsx` — passes health/resolve props into `CharacterStatsClient`; removes standalone `HealthResolveSection` render
- `src/app/dashboard/characters/[id]/_components/character-stats-client.tsx` — major restructure: Tabs, two-column grids, absorbs health/resolve + weapons props
- `src/app/dashboard/characters/[id]/_components/health-resolve-section.tsx` — header restyle
- `src/app/dashboard/characters/[id]/_components/ability-scores-section.tsx` — header restyle
- `src/app/dashboard/characters/[id]/_components/combat-stats-section.tsx` — header restyle + formula boxes
- `src/app/dashboard/characters/[id]/_components/skills-section.tsx` — header restyle
- `src/app/dashboard/characters/[id]/_components/inventory-section.tsx` — split weapons vs armor/equipment props
- `src/app/dashboard/characters/[id]/_components/class-features-section.tsx` — header restyle
- `src/app/dashboard/characters/[id]/_components/theme-features-section.tsx` — header restyle
- `src/app/dashboard/characters/[id]/_components/feats-section.tsx` — header restyle
- No schema changes, no migrations, no new dependencies (shadcn Tabs already available)
