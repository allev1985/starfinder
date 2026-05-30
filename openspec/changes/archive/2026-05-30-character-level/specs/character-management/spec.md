## MODIFIED Requirements

### Requirement: Character detail page content
The character detail page SHALL display the character's name, race, class, theme, level, creation date, and the list of campaigns they have joined. The owner SHALL see inline − / + level controls and Edit and Delete buttons. Non-owners SHALL see level as read-only text with no level controls or Edit/Delete buttons.

#### Scenario: Owner sees level control, edit and delete controls
- **WHEN** the character owner views the detail page
- **THEN** race, class, theme, and level are displayed; inline − / + level buttons are shown; Edit and Delete buttons are visible

#### Scenario: Non-owner sees level as read-only, no controls
- **WHEN** a non-owner views the detail page
- **THEN** race, class, theme, and level are displayed as read-only; no level controls or Edit/Delete buttons are rendered

#### Scenario: Pre-existing character shows placeholder for null fields
- **WHEN** any authorized user views a character that has no race, class, or theme set
- **THEN** the missing fields display "—"
