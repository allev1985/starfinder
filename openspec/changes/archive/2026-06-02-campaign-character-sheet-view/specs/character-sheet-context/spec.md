## MODIFIED Requirements

### Requirement: characterId and isOwner are available in context
`characterId` and `isOwner` SHALL be included in the context value as read-only fields so that section components do not need them passed as props. `isOwner` SHALL be `true` only when the authenticated user is the character's owner, regardless of whether the sheet is accessed via the standalone route or the campaign route. DMs and other campaign participants SHALL receive `isOwner: false`.

#### Scenario: Section component saves data
- **WHEN** a section component needs to persist a change to the server
- **THEN** it reads `characterId` from `useCharacter()` without requiring it as a prop

#### Scenario: Owner accesses sheet via campaign route
- **WHEN** the character owner views their character through the campaign character route
- **THEN** `isOwner` in context is `true` and all editable fields are interactive

#### Scenario: DM accesses sheet via campaign route
- **WHEN** a DM views a character through the campaign character route
- **THEN** `isOwner` in context is `false` and all fields render read-only
