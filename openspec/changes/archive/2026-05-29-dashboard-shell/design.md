## Context

The dashboard currently has no layout wrapper — `page.tsx` renders a centered div with sign-out inline. This needs to become a proper shell before any content pages are added, so all future routes get consistent chrome without repetition.

The project uses Next.js 16 App Router, Tailwind v4, and shadcn/ui. The `@supabase/ssr` server client is already established.

## Goals / Non-Goals

**Goals:**
- Add `dashboard/layout.tsx` as the persistent shell for all `/dashboard/*` routes
- Top bar with app name, Campaigns nav item, Characters nav item, Sign out button
- Campaigns and Characters each: label links to list page, chevron opens dropdown with "Create new"
- Stub pages for `/dashboard/campaigns` and `/dashboard/characters`
- Remove sign-out from `page.tsx`, delete `sign-out-button.tsx`

**Non-Goals:**
- Sidebar navigation
- Mobile responsive drawer / hamburger menu
- Active route highlighting (can be added later)
- Any actual Campaigns or Characters functionality

## Decisions

### 1. Layout file at `src/app/dashboard/layout.tsx`

The shell lives in a route-segment layout, not a shared component, so Next.js automatically applies it to every `/dashboard/*` route. No manual inclusion required in each page.

### 2. Split nav item: link + dropdown chevron as separate interactive targets

Each nav item (`Campaigns`, `Characters`) is a flex row: a `<Link>` covering the label text, and a separate `<button>` that triggers the `DropdownMenu`. This gives the user two distinct actions without a split-button component.

```
┌──────────────────────┐
│ Campaigns  ▾         │  ← label is a <Link>, ▾ opens DropdownMenu
└──────────────────────┘
      ┌────────────────┐
      │ + Create new   │  ← links to /dashboard/campaigns/new
      └────────────────┘
```

**Why not NavigationMenu**: NavigationMenu is designed for multi-level flyout menus. A simple link + single-item dropdown doesn't need that complexity.

### 3. Sign-out in the top bar as a client component

Sign-out requires `supabase.auth.signOut()` (client-side call) + `router.push('/')`. This logic is extracted into a small `<SignOutButton>` that lives inside the layout, not in a separate file at the page level.

### 4. `dashboard/page.tsx` becomes a minimal stub

With the layout providing chrome, `page.tsx` just needs to render something in the content area. It no longer needs to fetch the user or render sign-out — the layout handles identity context if needed.

## Risks / Trade-offs

- **`DropdownMenu` not yet installed** → Install via `npx shadcn@latest add dropdown-menu` before building the nav component.
- **"Create new" routes don't exist yet** → Links point to `/dashboard/campaigns/new` and `/dashboard/characters/new`; these will 404 until those pages are built. Acceptable for a stub pass.
