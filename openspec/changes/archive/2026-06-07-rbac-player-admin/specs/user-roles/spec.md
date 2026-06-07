## ADDED Requirements

### Requirement: Two-role identity model
The system SHALL support exactly two roles: `player` (default for all users) and `admin`. A user's role SHALL be stored in Supabase `app_metadata.role`. If no role is set, the user is treated as `player`.

#### Scenario: User with no role is treated as player
- **WHEN** `isAdmin()` is called with a user whose `app_metadata` has no `role` field
- **THEN** the function returns `false`

#### Scenario: User with role "admin" is identified as admin
- **WHEN** `isAdmin()` is called with a user whose `app_metadata.role` is `"admin"`
- **THEN** the function returns `true`

#### Scenario: User with role "player" is not admin
- **WHEN** `isAdmin()` is called with a user whose `app_metadata.role` is `"player"`
- **THEN** the function returns `false`

#### Scenario: Null user is not admin
- **WHEN** `isAdmin()` is called with `null`
- **THEN** the function returns `false`

### Requirement: Admin route gate
The `/dashboard/admin` route segment SHALL be protected by a server layout that redirects non-admin users to `/dashboard`.

#### Scenario: Admin user accesses admin route
- **WHEN** an authenticated admin user navigates to `/dashboard/admin` or any sub-route
- **THEN** the page renders normally

#### Scenario: Player user is redirected from admin route
- **WHEN** an authenticated player navigates to `/dashboard/admin` or any sub-route
- **THEN** the server redirects them to `/dashboard`

#### Scenario: Unauthenticated user is redirected from admin route
- **WHEN** an unauthenticated request arrives for `/dashboard/admin`
- **THEN** the server redirects to `/dashboard` (existing proxy redirects further to `/`)

### Requirement: Admin server action guard
Every server action under `/dashboard/admin` SHALL call `isAdmin()` and throw an error if the caller is not an admin.

#### Scenario: Admin server action called by non-admin
- **WHEN** a server action under the admin segment is invoked by a non-admin user
- **THEN** the action throws an authorization error and no mutation occurs
