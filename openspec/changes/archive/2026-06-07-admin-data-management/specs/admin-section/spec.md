## ADDED Requirements

### Requirement: Admin landing page displays navigation tiles
The page at `/dashboard/admin` SHALL display a tile grid. It SHALL include a "Manage Data" tile linking to `/dashboard/admin/data`. Access to `/dashboard/admin` and all routes beneath it SHALL be restricted to users with the `admin` role; non-admins SHALL be redirected to `/dashboard`.

#### Scenario: Admin navigates to admin landing
- **WHEN** an admin user visits `/dashboard/admin`
- **THEN** they see a "Manage Data" tile with a link to `/dashboard/admin/data`

#### Scenario: Non-admin is redirected
- **WHEN** a non-admin user visits any route under `/dashboard/admin`
- **THEN** they are redirected to `/dashboard`
