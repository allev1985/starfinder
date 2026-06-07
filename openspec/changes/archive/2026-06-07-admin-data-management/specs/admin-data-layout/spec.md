## ADDED Requirements

### Requirement: Edition data page shows category navigation
The page at `/dashboard/admin/data/[editionSlug]` SHALL display a grid of tiles, one per reference-data category: Races, Classes, Themes, Skills, Armor, Weapons, Equipment, Spells, Feats, Chassis. Each tile SHALL link to the corresponding category page. The current edition name SHALL be visible as a heading or breadcrumb.

#### Scenario: Category tiles are rendered
- **WHEN** an admin visits `/dashboard/admin/data/crb`
- **THEN** tiles for all 10 categories are displayed, each linking to the correct sub-route

#### Scenario: Unknown edition slug returns 404
- **WHEN** an admin visits `/dashboard/admin/data/nonexistent`
- **THEN** the page returns a 404 (not found) response

### Requirement: Breadcrumb navigation is present on all admin data pages
Every page under `/dashboard/admin/data/[editionSlug]` SHALL display a breadcrumb showing at minimum: Admin › Manage Data › [Edition Name] › [Category]. Each crumb SHALL be a link to its respective route.

#### Scenario: Breadcrumb is correct on a category page
- **WHEN** admin is on `/dashboard/admin/data/crb/classes`
- **THEN** breadcrumb reads: Admin › Manage Data › CRB › Classes, with each segment linked appropriately
