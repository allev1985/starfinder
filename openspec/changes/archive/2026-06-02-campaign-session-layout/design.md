## Context

Next.js App Router layouts are server components that wrap all routes in their segment and below. Adding `layout.tsx` at `campaigns/[id]/` means it runs for:
- `campaigns/[id]/` (overview)
- `campaigns/[id]/characters/[characterId]/` (character sheet)
- `campaigns/[id]/edit/` (edit form)

The layout renders once per navigation to any of these routes and stays mounted while navigating between children. This gives the persistent sidebar behaviour without iframes or client-side state tricks.

The current `campaigns/[id]/page.tsx` does its own `isCampaignParticipant` check. With the layout owning that check, the page component's auth is redundant and should be removed to avoid the double DB call.

## Goals / Non-Goals

**Goals:**
- Persistent two-panel layout (sidebar + main) for all `campaigns/[id]/*` routes
- Active character highlighted in sidebar based on current URL
- Auth (participant check + campaign fetch) owned by the layout, not the page

**Non-Goals:**
- Collapsible/resizable sidebar — fixed layout is sufficient for now
- The sidebar appearing differently on the edit page — it shows there too (harmless)
- Any changes to the character sheet page or its data loading

## Decisions

### Layout owns auth and campaign data fetch

The layout fetches `getCampaignWithCharacters` and checks `isCampaignParticipant`. If either fails it redirects. This removes the need for the page to repeat the check.

**Why**: A layout redirect prevents the page from rendering at all — the behaviour is identical to the page doing it, but with one fetch instead of two.

### CampaignSidebar is a client component

The sidebar needs to highlight the currently selected character. `usePathname()` is a client-only hook. The rest of the layout (campaign fetch, auth) stays server-side; only the sidebar nav itself is a client component.

**Alternative considered**: Pass the active `characterId` as a prop from the layout via a URL param read server-side. Rejected — more complex for no benefit; `usePathname()` in a small client component is the idiomatic approach.

### Sidebar width is fixed, main area takes remaining space

```
┌──────────────────────────────────────────────┐
│ sidebar (w-64, shrink-0)  │ main (flex-1)    │
│                           │                  │
│  Characters               │  {children}      │
│  ─────────────            │                  │
│  Zerak                    │                  │
│  Voss                     │                  │
│  Mira                     │                  │
└──────────────────────────────────────────────┘
```

The dashboard shell already provides outer padding. The campaign layout uses a full-height flex row inside the dashboard content area.

### `campaigns/[id]/page.tsx` drops its own auth

The page previously called `isCampaignParticipant` and `getCampaignWithCharacters` itself. After this change:
- Auth redirect: owned by layout
- `getCampaignWithCharacters` result: layout fetches it; the overview page re-fetches only what it needs (the campaign + characters are cheap queries, double-fetch is acceptable given no shared data mechanism between layout and page in App Router)

**Alternative considered**: A shared cache/context. Rejected — App Router doesn't support prop-passing from layout to page; React Context would require a client boundary; re-fetching the same cheap query is simpler and correct.

## Risks / Trade-offs

- **Double DB query for campaign data**: Layout and overview page both call `getCampaignWithCharacters`. This is two fast queries on the same row — acceptable for now.
- **Sidebar on edit page**: The edit page gets the sidebar. This is a minor UX oddity but not harmful — the sidebar links are useful even from the edit page.

## Migration Plan

No DB changes. The layout is purely additive; the page auth removal is a safe simplification since the layout now guarantees the redirect.
