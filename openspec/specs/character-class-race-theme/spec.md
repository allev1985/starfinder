## ADDED Requirements

### Requirement: Race, class, and theme selection on character creation
The character creation form at `/dashboard/characters/new` SHALL include three required dropdown selects — Race, Class, and Theme — populated server-side from the `races`, `classes`, and `themes` tables respectively. The form SHALL not submit unless all three are selected.

#### Scenario: Dropdowns are populated from DB
- **WHEN** an authenticated user visits `/dashboard/characters/new`
- **THEN** the Race dropdown lists all 8 CRB races, the Class dropdown lists all 7 CRB classes, and the Theme dropdown lists all 10 CRB themes

#### Scenario: Successful creation with all fields
- **WHEN** the user submits a valid name, a race, a class, and a theme
- **THEN** a character row is created with the correct `race_id`, `class_id`, and `theme_id` and the user is redirected to the character detail page

#### Scenario: Submission rejected without race, class, or theme
- **WHEN** the user submits the form without selecting one or more of race, class, or theme
- **THEN** no character is created and the form shows a validation error for the missing field(s)

### Requirement: Race, class, and theme displayed on character detail page
The character detail page at `/dashboard/characters/[id]` SHALL display the character's race name, class name, and theme name. When any of these values is null (pre-existing characters), the field SHALL display "—".

#### Scenario: Character with race, class, theme shows all three
- **WHEN** an authorized user views a character that has race, class, and theme set
- **THEN** the race name, class name, and theme name are shown on the detail page

#### Scenario: Character without metadata shows placeholder
- **WHEN** an authorized user views a character that has null race, class, or theme
- **THEN** the missing field displays "—"

### Requirement: Race, class, and theme editable on character edit page
The character edit page at `/dashboard/characters/[id]/edit` SHALL include dropdowns for Race, Class, and Theme pre-populated with the character's current selections. Submitting the form SHALL update all three FK columns alongside the name.

#### Scenario: Edit form pre-populates current selections
- **WHEN** the character owner navigates to the edit page for a character with race, class, and theme set
- **THEN** the dropdowns show the character's current race, class, and theme as selected

#### Scenario: Owner updates race, class, or theme
- **WHEN** the owner selects a different race, class, or theme and submits
- **THEN** the character row is updated with the new `race_id`, `class_id`, and `theme_id` and the owner is redirected to the character detail page
