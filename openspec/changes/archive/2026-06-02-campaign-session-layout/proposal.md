## Why

During gameplay the DM and players need to switch quickly between character sheets without losing context. The current campaign detail page navigates away entirely when a character is selected, forcing users to go back and re-select. A persistent sidebar listing campaign characters lets anyone jump between sheets without losing their place.

## What Changes

- A Next.js `layout.tsx` is added at `campaigns/[id]/` that renders a two-panel layout: a fixed sidebar (character list) and a main content area (`{children}`)
- A `CampaignSidebar` client component handles active-character highlighting via `usePathname()`
- The existing `campaigns/[id]/page.tsx` has its duplicate auth check removed (the layout handles participant gating) and is otherwise unchanged
- The existing `campaigns/[id]/characters/[characterId]/page.tsx` is unchanged — it renders as the main content slot automatically

## Capabilities

### New Capabilities

- `campaign-session-layout`: Two-panel campaign layout with persistent character sidebar

### Modified Capabilities

- `campaign-detail`: Auth responsibility moves from the page to the layout; page content is otherwise unchanged

## Impact

- New file: `src/app/dashboard/campaigns/[id]/layout.tsx`
- New file: `src/app/dashboard/campaigns/[id]/_components/campaign-sidebar.tsx`
- Modified: `src/app/dashboard/campaigns/[id]/page.tsx` — remove duplicate auth/redirect, layout now owns it
- `edit/page.tsx` — no changes needed; it adds its own DM check on top of the layout's participant check
- No DB or API changes
