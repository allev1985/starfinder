## MODIFIED Requirements

### Requirement: Create character
The system SHALL provide a form at `/dashboard/characters/new` to create a character with a name, race, class, and theme. On success the user is redirected to the new character's detail page. The Server Action SHALL set `edition_id` to the Starfinder 1e edition UUID when creating the character; no edition picker is shown to the user.

#### Scenario: Successful creation
- **WHEN** a valid name, race, class, and theme are submitted
- **THEN** a character is created with `owner_id = user.id`, `race_id`, `class_id`, `theme_id`, and `edition_id` set to the 1e UUID, and the user is redirected to `/dashboard/characters/[id]`

#### Scenario: Empty name rejected
- **WHEN** an empty or whitespace-only name is submitted
- **THEN** no character is created and an inline error is displayed

#### Scenario: Missing race, class, or theme rejected
- **WHEN** the form is submitted without a race, class, or theme selection
- **THEN** no character is created and an inline error is displayed for the missing field
