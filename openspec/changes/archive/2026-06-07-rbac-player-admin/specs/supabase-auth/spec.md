## ADDED Requirements

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
