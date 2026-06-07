## ADDED Requirements

### Requirement: Admin navigation item (conditional)
The top bar SHALL render an "Admin" navigation link to `/dashboard/admin` only when the current user has the `admin` role. Player users SHALL NOT see this link.

#### Scenario: Admin user sees Admin nav link
- **WHEN** an admin user views any dashboard page
- **THEN** the top bar includes an "Admin" link that navigates to `/dashboard/admin`

#### Scenario: Player user does not see Admin nav link
- **WHEN** a player user views any dashboard page
- **THEN** the top bar does not include any "Admin" link
