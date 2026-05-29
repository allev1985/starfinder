## 1. Setup

- [x] 1.1 Install shadcn/ui `dropdown-menu` component

## 2. Top Bar Component

- [x] 2.1 Create `src/app/dashboard/_components/top-bar.tsx` as a client component
- [x] 2.2 Add app name as a `<Link>` to `/dashboard` on the left
- [x] 2.3 Add Campaigns nav item: `<Link>` label to `/dashboard/campaigns` + chevron button triggering `DropdownMenu` with "Create new" → `/dashboard/campaigns/new`
- [x] 2.4 Add Characters nav item: `<Link>` label to `/dashboard/characters` + chevron button triggering `DropdownMenu` with "Create new" → `/dashboard/characters/new`
- [x] 2.5 Add Sign out button on the right (calls `supabase.auth.signOut()` + `router.push('/')`)

## 3. Dashboard Layout

- [x] 3.1 Create `src/app/dashboard/layout.tsx` rendering `<TopBar />` and `{children}` below it

## 4. Stub Pages

- [x] 4.1 Create `src/app/dashboard/campaigns/page.tsx` as a placeholder page
- [x] 4.2 Create `src/app/dashboard/characters/page.tsx` as a placeholder page

## 5. Cleanup

- [x] 5.1 Simplify `src/app/dashboard/page.tsx` — remove sign-out logic and user fetch, render a plain content stub
- [x] 5.2 Delete `src/app/dashboard/sign-out-button.tsx`

## 6. Lint & Typecheck

- [x] 6.1 Run `npm run lint` and resolve any errors
- [x] 6.2 Run `npx tsc --noEmit` and resolve any type errors
