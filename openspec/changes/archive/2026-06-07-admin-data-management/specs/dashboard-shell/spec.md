## MODIFIED Requirements

### Requirement: Dashboard tile grid shows role-appropriate navigation
The dashboard page SHALL render a tile for "Admin" only when the authenticated user has the `admin` role (`app_metadata.role === "admin"`). Non-admin users SHALL NOT see the Admin tile. The tile SHALL link to `/dashboard/admin`.

#### Scenario: Admin user sees admin tile
- **WHEN** a user with `app_metadata.role === "admin"` loads `/dashboard`
- **THEN** an "Admin" tile is visible in the tile grid alongside Campaigns and Characters

#### Scenario: Non-admin user does not see admin tile
- **WHEN** a user without the admin role loads `/dashboard`
- **THEN** no "Admin" tile is rendered; only Campaigns and Characters tiles appear
