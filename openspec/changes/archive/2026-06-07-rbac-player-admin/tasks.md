## 1. Role Helper

- [x] 1.1 Add `isAdmin(user: User | null): boolean` to `src/lib/session.ts` — reads `user?.app_metadata?.role === "admin"`

## 2. Admin Route Guard

- [x] 2.1 Create `src/app/dashboard/admin/layout.tsx` — server layout that calls `getUser()`, checks `isAdmin()`, and redirects to `/dashboard` if false
- [x] 2.2 Create `src/app/dashboard/admin/page.tsx` — minimal placeholder page ("Admin" heading) so the route resolves

## 3. Top Bar Admin Link

- [x] 3.1 Convert `src/app/dashboard/_components/top-bar.tsx` to a server component (or pass role as prop from a server layout) so it can read the user's role server-side
- [x] 3.2 Conditionally render an "Admin" nav link in the top bar when `isAdmin(user)` is true

## 4. Lint & Type Check

- [x] 4.1 Run `npm run lint` and `npx tsc --noEmit` — fix any errors before considering the change complete
