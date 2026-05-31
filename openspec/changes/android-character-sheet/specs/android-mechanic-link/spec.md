## ADDED Requirements

### Requirement: Android character can be linked to a mechanic character
The system SHALL allow the owner of an android character to link it to another character (the mechanic) by setting `mechanic_character_id` on the android's character row. The link is optional at creation and can be set or changed at any time.

#### Scenario: Owner can link a mechanic from the android character sheet
- **WHEN** the owner of an android character selects a character from the mechanic picker on the character sheet
- **THEN** the android's `mechanic_character_id` is updated to the selected character's id

#### Scenario: Owner can clear the mechanic link
- **WHEN** the owner selects the empty option in the mechanic picker
- **THEN** the android's `mechanic_character_id` is set to null

#### Scenario: Non-owner cannot change the mechanic link
- **WHEN** a non-owner views the android character sheet
- **THEN** the mechanic picker is not rendered; the mechanic name is shown as read-only text

### Requirement: Mechanic picker shows characters in the same campaign
The mechanic picker SHALL list characters that share a campaign with the android character. The picker SHALL show all eligible characters; those with class = Mechanic SHALL appear first in the list.

#### Scenario: Mechanic-class characters appear first
- **WHEN** the mechanic picker is populated
- **THEN** characters whose class is "Mechanic" are listed before other characters

#### Scenario: No campaign members shows empty picker
- **WHEN** the android character is not in any campaign
- **THEN** the mechanic picker is empty and a message indicates the android must join a campaign first

### Requirement: Mechanic panel displayed on android character sheet
The android character detail page SHALL render a **Mechanic** panel showing the linked mechanic's name, current level, and INT modifier. When no mechanic is linked the panel SHALL show a prompt to link one.

#### Scenario: Linked mechanic details displayed
- **WHEN** an android character has a mechanic linked and the character sheet loads
- **THEN** the Mechanic panel shows the mechanic character's name, level, and INT modifier (derived as floor((intScore - 10) / 2))

#### Scenario: Unlinked mechanic shows prompt
- **WHEN** an android character has no mechanic linked
- **THEN** the Mechanic panel shows a message indicating no mechanic is linked

#### Scenario: Mechanic panel not shown for biological characters
- **WHEN** a biological character detail page loads
- **THEN** no Mechanic panel is rendered

### Requirement: Mechanic level used to derive android skill ranks
When the android character sheet loads, the system SHALL fetch the linked mechanic's current `level`. This value is used to display android skill ranks and SHALL not be stored on the android's `character_skills` rows.

#### Scenario: Ranks display mechanic level
- **WHEN** an android character sheet loads with a mechanic linked at level 5
- **THEN** all android skill rows show ranks = 5

#### Scenario: Ranks show dash when no mechanic is linked
- **WHEN** an android character has no mechanic linked
- **THEN** all android skill rows show "—" in the ranks column
