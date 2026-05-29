## Why

The dashboard currently has no persistent chrome — no navigation, no identity context. Every future dashboard section (Campaigns, Characters) needs a shared layout with top-level navigation to be usable.

## What Changes

- Introduce `src/app/dashboard/layout.tsx` — a persistent shell with a top navigation bar shared across all `/dashboard/*` routes
- Top bar contains: app logo/name (left), Campaigns nav item with dropdown, Characters nav item with dropdown, Sign out button (right)
- Campaigns and Characters nav items link to their respective list pages; each has a "Create new" dropdown option pointing to their `/new` route
- Add stub pages: `/dashboard/campaigns/page.tsx` and `/dashboard/characters/page.tsx`
- Move sign-out logic from `dashboard/page.tsx` into the layout's top bar; simplify `dashboard/page.tsx` to a content stub
- `sign-out-button.tsx` is deleted and its logic absorbed into the top bar component

## Capabilities

### New Capabilities

- `dashboard-shell`: Persistent dashboard layout with top navigation bar, section links with "Create new" dropdowns, and sign-out.

### Modified Capabilities

None.

## Impact

- `src/app/dashboard/layout.tsx` — new file
- `src/app/dashboard/page.tsx` — simplified (no longer renders sign-out)
- `src/app/dashboard/sign-out-button.tsx` — deleted
- `src/app/dashboard/campaigns/page.tsx` — new stub
- `src/app/dashboard/characters/page.tsx` — new stub
- shadcn/ui `DropdownMenu` component required (not yet installed)
