## ADDED Requirements

### Requirement: Campaign participants can view a character sheet via the campaign route
The campaign character route (`/dashboard/campaigns/[id]/characters/[characterId]`) SHALL render the full character sheet for any campaign participant (DM or player in the same campaign).

#### Scenario: DM views a character sheet
- **WHEN** a DM navigates to a character in their campaign
- **THEN** the full character sheet is displayed in read-only mode

#### Scenario: Player views a fellow player's character sheet
- **WHEN** a campaign participant who does not own the character navigates to that character's campaign route
- **THEN** the full character sheet is displayed in read-only mode

#### Scenario: Non-participant attempts access
- **WHEN** a user who is not a campaign participant navigates to the campaign character route
- **THEN** they are redirected to `/dashboard/campaigns`

#### Scenario: Character not in the campaign
- **WHEN** the characterId in the URL does not belong to the campaign
- **THEN** the user is redirected to the campaign detail page

### Requirement: Character owner can edit their sheet via the campaign route
The character owner SHALL be able to edit all sheet fields when viewing their character through the campaign route, with identical behaviour to the standalone character route.

#### Scenario: Owner edits a field
- **WHEN** the character owner views their character via the campaign route
- **THEN** all editable fields are interactive and save changes exactly as they do on the standalone sheet

#### Scenario: Non-owner cannot edit
- **WHEN** any non-owner (DM or fellow player) views the sheet via the campaign route
- **THEN** all editable fields are rendered in read-only mode with no save affordances

### Requirement: Character sheet data loading is not duplicated
A shared server-side helper SHALL provide all character sheet data so that both the standalone and campaign character routes call it rather than duplicating query logic.

#### Scenario: Data loaded via campaign route
- **WHEN** the campaign character page renders
- **THEN** it calls the same shared loader used by the standalone page and receives identical data shape
