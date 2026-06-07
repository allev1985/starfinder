## Requirements

### Requirement: Edition list page shows all editions
The page at `/dashboard/admin/data` SHALL display all editions currently in the database. Each edition SHALL be shown as a card or list row with its `name` and `slug`. Clicking an edition SHALL navigate to `/dashboard/admin/data/[editionSlug]`.

#### Scenario: Editions are listed
- **WHEN** an admin visits `/dashboard/admin/data`
- **THEN** all existing editions are displayed, each linking to their edition data page

#### Scenario: No editions exist
- **WHEN** the database contains no editions
- **THEN** the page shows an empty state and a prompt to create the first edition

### Requirement: Admin can create a new edition
The edition list page SHALL provide a form (or modal) to create a new edition. The admin MUST supply both a `name` and a `slug`. The `slug` MUST be unique; submission with a duplicate slug SHALL display an error. Successful creation SHALL add the edition to the list.

#### Scenario: Successful edition creation
- **WHEN** admin submits a valid name and unique slug
- **THEN** the new edition appears in the list and the form/modal closes

#### Scenario: Duplicate slug is rejected
- **WHEN** admin submits a slug that already exists
- **THEN** an error message is displayed and the edition is not created

#### Scenario: Empty slug is rejected
- **WHEN** admin submits the form with an empty slug
- **THEN** a validation error is shown before submission reaches the server
