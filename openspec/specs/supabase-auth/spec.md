## ADDED Requirements

### Requirement: User sign-up
The system SHALL allow a new user to create an account using an email address and password via Supabase Auth.

#### Scenario: Successful sign-up
- **WHEN** a valid email and password are submitted to the sign-up handler
- **THEN** Supabase creates the user in `auth.users` and the session is established

#### Scenario: Duplicate email sign-up
- **WHEN** an email already registered is submitted for sign-up
- **THEN** Supabase returns an error and no duplicate account is created

### Requirement: User sign-in
The system SHALL allow an existing user to authenticate using email and password, resulting in a session cookie being set.

#### Scenario: Successful sign-in
- **WHEN** valid credentials are submitted to the sign-in handler
- **THEN** a session cookie is written to the response and the user is considered authenticated on subsequent requests

#### Scenario: Invalid credentials
- **WHEN** incorrect email or password is submitted
- **THEN** no session cookie is set and an error is returned

### Requirement: User sign-out
The system SHALL allow an authenticated user to end their session, clearing the session cookie.

#### Scenario: Sign-out clears session
- **WHEN** an authenticated user triggers sign-out
- **THEN** the session cookie is cleared and subsequent requests treat the user as unauthenticated

### Requirement: Session persistence via cookies
Sessions SHALL be stored in HTTP-only cookies managed by `@supabase/ssr`. The session SHALL be accessible in Server Components, Route Handlers, and Server Actions without client-side JavaScript.

#### Scenario: Server Component reads session
- **WHEN** a Server Component calls the server Supabase client and requests the current user
- **THEN** the authenticated user's data is returned if a valid session cookie is present

#### Scenario: No session returns null user
- **WHEN** a request arrives with no session cookie
- **THEN** `getUser()` returns `null` and no error is thrown

### Requirement: Session auto-refresh via middleware
The system SHALL include a Next.js middleware that refreshes the Supabase session on every request to prevent mid-session expiry.

#### Scenario: Middleware refreshes near-expiry token
- **WHEN** a request arrives with a session cookie that is close to expiry
- **THEN** the middleware exchanges the token and writes a refreshed cookie to the response before the route handler runs
