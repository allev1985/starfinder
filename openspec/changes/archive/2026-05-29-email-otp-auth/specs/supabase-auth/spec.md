## REMOVED Requirements

### Requirement: User sign-up
**Reason**: Replaced by seamless OTP-based account creation. Explicit password sign-up is no longer part of the auth flow.
**Migration**: Account creation now happens automatically when a new email is used with `signInWithOtp`. No separate sign-up step exists.

### Requirement: User sign-in
**Reason**: Replaced by OTP-based authentication. Password credentials are no longer accepted.
**Migration**: Users authenticate via the OTP flow — see `email-otp-login` spec.

## MODIFIED Requirements

### Requirement: Session persistence via cookies
Sessions SHALL be stored in HTTP-only cookies managed by `@supabase/ssr`. The session SHALL be accessible in Server Components, Route Handlers, and Middleware without client-side JavaScript. Sessions are established by `verifyOtp` called from the browser client; `@supabase/ssr` writes the cookie automatically.

#### Scenario: Server Component reads session
- **WHEN** a Server Component calls the server Supabase client and requests the current user
- **THEN** the authenticated user's data is returned if a valid session cookie is present

#### Scenario: No session returns null user
- **WHEN** a request arrives with no session cookie
- **THEN** `getUser()` returns `null` and no error is thrown

### Requirement: Session auto-refresh via middleware
The system SHALL include a Next.js middleware that refreshes the Supabase session on every request and enforces route-level authentication. Unauthenticated users SHALL be redirected to `/`; authenticated users on `/` SHALL be redirected to `/dashboard`.

#### Scenario: Middleware refreshes near-expiry token
- **WHEN** a request arrives with a session cookie that is close to expiry
- **THEN** the middleware exchanges the token and writes a refreshed cookie to the response before the route handler runs

#### Scenario: Middleware redirects unauthenticated dashboard request
- **WHEN** an unauthenticated request arrives for `/dashboard`
- **THEN** the middleware redirects to `/`

#### Scenario: Middleware redirects authenticated login request
- **WHEN** an authenticated request arrives for `/`
- **THEN** the middleware redirects to `/dashboard`
