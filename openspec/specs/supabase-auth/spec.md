## Requirements

### Requirement: Session persistence via cookies
Sessions SHALL be stored in HTTP-only cookies managed by `@supabase/ssr`. The session SHALL be accessible in Server Components, Route Handlers, and Middleware without client-side JavaScript. Sessions are established by `verifyOtp` called from the browser client; `@supabase/ssr` writes the cookie automatically.

#### Scenario: Server Component reads session
- **WHEN** a Server Component calls the server Supabase client and requests the current user
- **THEN** the authenticated user's data is returned if a valid session cookie is present

#### Scenario: No session returns null user
- **WHEN** a request arrives with no session cookie
- **THEN** `getUser()` returns `null` and no error is thrown

### Requirement: Session auto-refresh via proxy
The system SHALL include a Next.js proxy (`src/proxy.ts`) that refreshes the Supabase session on every request and enforces route-level authentication. Unauthenticated users SHALL be redirected to `/`; authenticated users on `/` SHALL be redirected to `/dashboard`.

#### Scenario: Proxy refreshes near-expiry token
- **WHEN** a request arrives with a session cookie that is close to expiry
- **THEN** the proxy exchanges the token and writes a refreshed cookie to the response before the route handler runs

#### Scenario: Proxy redirects unauthenticated dashboard request
- **WHEN** an unauthenticated request arrives for `/dashboard`
- **THEN** the proxy redirects to `/`

#### Scenario: Proxy redirects authenticated login request
- **WHEN** an authenticated request arrives for `/`
- **THEN** the proxy redirects to `/dashboard`

### Requirement: Role helper in session module
The `session.ts` module SHALL export an `isAdmin(user: User | null): boolean` function that reads `user.app_metadata?.role` and returns `true` only when the value is `"admin"`.

#### Scenario: isAdmin exported from session module
- **WHEN** a server module imports `isAdmin` from `@/lib/session`
- **THEN** the import resolves without error

#### Scenario: isAdmin returns true for admin app_metadata
- **WHEN** `isAdmin` is called with a Supabase `User` whose `app_metadata.role` is `"admin"`
- **THEN** it returns `true`

#### Scenario: isAdmin returns false for all other cases
- **WHEN** `isAdmin` is called with `null`, or a user with no role, or role `"player"`
- **THEN** it returns `false`
