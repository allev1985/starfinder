## MODIFIED Requirements

### Requirement: Create character
The system SHALL provide a form at `/dashboard/characters/new` to create a character with a name, race, class, and theme. On success the user is redirected to the new character's detail page.

#### Scenario: Successful creation
- **WHEN** a valid name, race, class, and theme are submitted
- **THEN** a character is created with `owner_id = user.id`, `race_id`, `class_id`, and `theme_id` set, and the user is redirected to `/dashboard/characters/[id]`

#### Scenario: Empty name rejected
- **WHEN** an empty or whitespace-only name is submitted
- **THEN** no character is created and an inline error is displayed

#### Scenario: Missing race, class, or theme rejected
- **WHEN** the form is submitted without a race, class, or theme selection
- **THEN** no character is created and an inline error is displayed for the missing field

### Requirement: Character detail page content
The character detail page SHALL display the character's name, race, class, theme, creation date, and the list of campaigns they have joined. Edit and Delete controls SHALL only be visible to the owner.

#### Scenario: Owner sees race, class, theme, edit and delete controls
- **WHEN** the character owner views the detail page
- **THEN** race, class, and theme names are displayed alongside the character name; Edit and Delete buttons are visible

#### Scenario: Non-owner sees race, class, theme but no controls
- **WHEN** a non-owner views the detail page
- **THEN** race, class, and theme names are displayed but no Edit or Delete controls are rendered

#### Scenario: Pre-existing character shows placeholder for null fields
- **WHEN** any authorized user views a character that has no race, class, or theme set
- **THEN** the missing fields display "—"

### Requirement: Edit character
The system SHALL provide a page at `/dashboard/characters/[id]/edit` accessible only to the character owner, allowing the character name, race, class, and theme to be updated.

#### Scenario: Non-owner redirected from edit page
- **WHEN** a non-owner navigates to `/dashboard/characters/[id]/edit`
- **THEN** they are redirected to `/dashboard/characters/[id]`

#### Scenario: Owner updates name, race, class, or theme
- **WHEN** the owner submits valid updated values for name, race, class, or theme
- **THEN** the character row is updated and the owner is redirected to `/dashboard/characters/[id]`
