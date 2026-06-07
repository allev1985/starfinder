## ADDED Requirements

### Requirement: isCharacterOwner authorization utility
The system SHALL provide `isCharacterOwner(characterId, userId)` in `src/lib/authorization.ts` that returns true only when the user owns the specified character.

#### Scenario: Owner passes check
- **WHEN** `isCharacterOwner` is called with the character's owner_id
- **THEN** true is returned

#### Scenario: Non-owner fails check
- **WHEN** `isCharacterOwner` is called for a user who does not own the character
- **THEN** false is returned

### Requirement: canViewCharacter authorization utility
The system SHALL provide `canViewCharacter(characterId, userId)` in `src/lib/authorization.ts` that returns true if the user owns the character OR is a participant of any campaign the character has joined.

#### Scenario: Owner can view
- **WHEN** `canViewCharacter` is called for the character's owner
- **THEN** true is returned

#### Scenario: Campaign participant can view
- **WHEN** `canViewCharacter` is called for a user who participates in a campaign that the character has joined
- **THEN** true is returned

#### Scenario: Unrelated user cannot view
- **WHEN** `canViewCharacter` is called for a user with no ownership or shared campaign membership
- **THEN** false is returned

### Requirement: Characters list page
The system SHALL display a list of characters owned by the authenticated user at `/dashboard/characters`, with links to their detail pages and a link to create a new character.

#### Scenario: Owner sees their characters
- **WHEN** an authenticated user visits `/dashboard/characters`
- **THEN** all characters with `owner_id = user.id` are listed

#### Scenario: Empty state shown
- **WHEN** an authenticated user has no characters
- **THEN** an empty state message with a link to create a character is shown

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

### Requirement: Character detail page access control
The character detail page SHALL only be accessible to the character's owner or participants of campaigns the character has joined. Others SHALL be redirected to `/dashboard/characters`.

#### Scenario: Owner can access detail page
- **WHEN** the character owner navigates to `/dashboard/characters/[id]`
- **THEN** the character detail page is rendered

#### Scenario: Campaign participant can access detail page
- **WHEN** a user who shares a campaign with the character navigates to `/dashboard/characters/[id]`
- **THEN** the character detail page is rendered

#### Scenario: Unrelated user is redirected
- **WHEN** an unrelated user navigates to `/dashboard/characters/[id]`
- **THEN** they are redirected to `/dashboard/characters`

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

### Requirement: Join campaign from character page
The character detail page SHALL provide an inline form (owner only) to join a campaign by entering a join code. An error SHALL be shown if the code is invalid or the character is already in that campaign.

#### Scenario: Successful join
- **WHEN** the owner submits a valid join code for a campaign the character has not yet joined
- **THEN** a `campaign_characters` row is created and the campaign appears in the character's campaign list

#### Scenario: Invalid join code
- **WHEN** the owner submits a join code that does not match any campaign
- **THEN** an inline error "Invalid join code" is displayed and no row is inserted

#### Scenario: Already joined
- **WHEN** the owner submits a join code for a campaign the character is already in
- **THEN** an inline error indicating the character is already in that campaign is displayed

#### Scenario: Non-owner cannot see join form
- **WHEN** a non-owner views the character detail page
- **THEN** the join campaign form is not rendered

### Requirement: Edit character
The system SHALL provide a page at `/dashboard/characters/[id]/edit` accessible only to the character owner, allowing the character name, race, class, and theme to be updated.

#### Scenario: Non-owner redirected from edit page
- **WHEN** a non-owner navigates to `/dashboard/characters/[id]/edit`
- **THEN** they are redirected to `/dashboard/characters/[id]`

#### Scenario: Owner updates name, race, class, or theme
- **WHEN** the owner submits valid updated values for name, race, class, or theme
- **THEN** the character row is updated and the owner is redirected to `/dashboard/characters/[id]`

### Requirement: Delete character
The character detail page SHALL allow the owner to delete a character via a confirmation dialog. Deletion SHALL remove all `campaign_characters` rows for the character before deleting the character row.

#### Scenario: Owner confirms deletion
- **WHEN** the owner confirms the delete dialog
- **THEN** all campaign_characters rows and the character row are deleted and the owner is redirected to `/dashboard/characters`

#### Scenario: Non-owner cannot delete
- **WHEN** a non-owner attempts to invoke the delete action
- **THEN** the action returns an error and no data is changed
