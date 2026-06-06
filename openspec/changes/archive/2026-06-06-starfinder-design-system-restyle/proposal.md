## Why

The app currently renders with shadcn's default grayscale palette, Geist fonts, and desktop-only layout. The design handoff (`design/README.md` + `Starfinder App (Standalone).html`) specifies a complete visual and UX redesign: a sci-fi-themed cyan accent system, three custom fonts, and a fully responsive shell that flips between a dark-chrome top-nav + sidebar on desktop and a dark AppBar + bottom tab bar on mobile. Playing Starfinder at the table happens on a phone — the current app is unusable in that context.

## What Changes

- **Design tokens**: Replace shadcn's default palette with the full custom token set (navy chrome, cyan accent, semantic good/warn/danger) defined in `design/README.md`
- **Fonts**: Swap Geist → Space Grotesk (headings/labels), IBM Plex Sans (body), IBM Plex Mono (stats/badges)
- **Dark mode**: Toggle via `data-dark="true"` on `<html>`, stored in localStorage
- **Desktop shell**: Redesign top nav (dark chrome, glow-dot brand, flat links) and campaign sidebar (section dots, mono labels, active dot marker)
- **Mobile shell**: New fixed AppBar (dark, 56px) + bottom TabBar (4 tabs: Campaign · Characters · Sheet · Starship)
- **Shared components**: Avatar (initials + hashed HSL color), Pill badges, StatTile, ResourceBar, AccordionBlock
- **Campaigns list**: Card layout — avatar, name, DM pill, join-code pill, mobile FAB
- **Characters list**: Card layout — avatar, name, level pill, Race Class · Theme sub-label
- **Campaign detail**: Party cards with HP bars, Starship card, Encounter icon grid
- **Character sheet**: Mobile = accordion blocks; Desktop = two-column with pill sub-tabs
- **Starship sheet**: Shield arc diagram, accordioned sections (Hull & Defenses, Weapons, Critical Damage, Crew, Ship Specs)

## Capabilities

### New Capabilities

- `design-tokens` — CSS custom properties for the full design palette: bg/surface/chrome/accent/semantic colors, radius tokens, shadow tokens; dark mode via `data-dark` attribute
- `app-fonts` — Space Grotesk, IBM Plex Sans, IBM Plex Mono loaded via `next/font/google`
- `mobile-shell` — fixed AppBar (title + back + more buttons) and bottom TabBar (4 contextual tabs) for viewports < 768px
- `dark-mode-toggle` — `data-dark` on `<html>` toggled from localStorage; available on all pages
- `avatar-component` — reusable initials avatar with deterministic HSL color derived from the entity name
- `pill-badges` — DM, level, and join-code pill variants
- `stat-tile` — label/value/mod stat display block, light and dark variants
- `resource-bar` — named resource (SP/HP/RP/Hull) with colored progress bar and −/+ controls
- `accordion-block` — collapsible section with icon, title, summary text, and caret

### Modified Capabilities

- `top-nav` — dark chrome background, glow-dot brand mark, flat active-state nav links, Sign out as a plain link; dropdown chevrons removed
- `campaign-sidebar` — light `--surface` bg, IBM Plex Mono section labels, active dot marker on selected item
- `campaigns-list` — replaced plain list with card layout
- `characters-list` — replaced plain list with card layout
- `campaign-detail` — added Party, Starship, and Encounter sections
- `character-sheet` — mobile accordion layout replacing tab-only view; desktop two-column with pill sub-tabs
- `spaceship-sheet` — shield arc diagram (always visible) + accordion sections

## Impact

- `src/app/layout.tsx` — swap fonts, add dark-mode body attribute
- `src/app/globals.css` — full rewrite to install design tokens; retain shadcn token aliases
- `src/app/dashboard/layout.tsx` — responsive shell: desktop = top-nav + (optional sidebar), mobile = no top-nav + bottom tab bar
- `src/app/dashboard/_components/top-bar.tsx` — complete redesign
- `src/app/dashboard/campaigns/[id]/_components/campaign-sidebar.tsx` — complete redesign
- `src/app/dashboard/campaigns/page.tsx` — card layout
- `src/app/dashboard/characters/page.tsx` — card layout
- `src/app/dashboard/campaigns/[id]/page.tsx` — party/starship/encounter sections
- `src/app/dashboard/characters/[id]/_components/character-stats-client.tsx` — mobile accordion + desktop two-column
- `src/app/dashboard/characters/[id]/_components/*.tsx` — individual section restyling (ability scores −/+ steppers, skill row with dice, resource bars, stat tiles)
- `src/app/dashboard/campaigns/[id]/spaceship/[shipId]/page.tsx` — shield diagram + accordion layout
- New files: `src/components/avatar.tsx`, `src/components/pill.tsx`, `src/components/stat-tile.tsx`, `src/components/resource-bar.tsx`, `src/components/accordion-block.tsx`, `src/components/app-bar.tsx`, `src/components/tab-bar.tsx`, `src/components/roll-toast.tsx`
- No schema changes, no new routes, no server action changes
