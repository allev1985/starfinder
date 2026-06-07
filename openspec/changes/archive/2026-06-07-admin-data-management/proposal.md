## Why

Admins have no UI to manage the edition-scoped reference data (races, classes, themes, armor, weapons, etc.) that players depend on when building characters. All reference data must currently be seeded via scripts, making corrections and additions impossible without developer access.

## What Changes

- Add a conditional **Admin** tile to the dashboard (visible to `admin` role only)
- Build an Admin landing page at `/dashboard/admin` with a "Manage Data" tile
- Build an edition picker at `/dashboard/admin/data` — list editions and create new ones
- Build a category navigation grid at `/dashboard/admin/data/[editionSlug]`
- Build data-table + inline-modal CRUD pages for every character reference-data type under `/dashboard/admin/data/[editionSlug]/<category>`:
  - Races
  - Classes (with inline sub-panels for class skills, abilities, and proficiencies)
  - Themes (with inline sub-panel for theme abilities)
  - Skills
  - Armor
  - Weapons
  - Equipment
  - Spells (with inline sub-panel for class assignments)
  - Feats
  - Chassis / Frames
- All CRUD operations are edition-scoped — creating a new edition requires re-entering all reference data for that edition

## Capabilities

### New Capabilities

- `admin-section`: Conditional Admin tile on the dashboard; Admin landing page at `/dashboard/admin` with Manage Data tile
- `admin-edition-management`: Edition list and create-edition form at `/dashboard/admin/data`; edition-slug routing as the URL anchor for all reference-data pages
- `admin-data-layout`: Shared sidebar/breadcrumb layout and category navigation grid for `/dashboard/admin/data/[editionSlug]`
- `admin-races-crud`: Data table + add/edit/delete modal for races, edition-scoped
- `admin-classes-crud`: Data table + modal for classes; expandable row sub-panels for class skills (junction), class abilities (with options), and armor/weapon proficiencies
- `admin-themes-crud`: Data table + modal for themes; expandable row sub-panel for theme abilities
- `admin-skills-crud`: Data table + add/edit/delete modal for skills, edition-scoped
- `admin-armor-crud`: Data table + add/edit/delete modal for armor, edition-scoped
- `admin-weapons-crud`: Data table + add/edit/delete modal for weapons, edition-scoped
- `admin-equipment-crud`: Data table + add/edit/delete modal for equipment, edition-scoped
- `admin-spells-crud`: Data table + modal for spells; expandable row sub-panel for class assignments (spellClass junction)
- `admin-feats-crud`: Data table + add/edit/delete modal for feats, edition-scoped
- `admin-chassis-crud`: Data table + add/edit/delete modal for chassis/drone frames, edition-scoped

### Modified Capabilities

- `dashboard-shell`: Admin tile added to the dashboard grid, rendered conditionally for the `admin` role only

## Impact

- `src/app/dashboard/page.tsx` — conditionally render Admin tile for admin users
- `src/app/dashboard/admin/page.tsx` — replace stub with tile grid (Manage Data)
- `src/app/dashboard/admin/data/` — new route tree for all reference data management
- `src/db/queries/` — new server-action query files for each reference-data category (create, update, delete, list by edition)
- `src/app/dashboard/admin/data/[editionSlug]/_components/` — shared data-table, inline modal, and expandable sub-panel components used across all category pages
- No schema changes required — all reference tables already exist and are edition-scoped
- No new dependencies — shadcn/ui Dialog, Table, and Form components already available
