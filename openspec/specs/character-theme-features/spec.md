## Requirements

### Requirement: Theme Features section displays on character sheet
The character sheet SHALL render a "Theme Features" section that lists all `theme_abilities` rows for the character's theme with `level <= character.level`, ordered by level ascending. Abilities not yet unlocked (level > current level) SHALL be shown in a visually distinct locked state indicating the level required to unlock them.

#### Scenario: Section is hidden when character has no theme
- **WHEN** the character has no `theme_id`
- **THEN** the Theme Features section is not rendered

#### Scenario: Unlocked abilities are shown normally
- **WHEN** a character is level 7
- **THEN** theme abilities with `level` 1 and 6 are displayed normally

#### Scenario: Locked abilities are shown in a locked state
- **WHEN** a character is level 7
- **THEN** theme abilities with `level` 12 and 18 are shown with a visual indicator of the required level

#### Scenario: All 4 level milestones are always shown
- **WHEN** a character has a theme
- **THEN** the Theme Features section always shows all abilities at levels 1, 6, 12, and 18 (unlocked or locked depending on character level)

### Requirement: Theme ability names and descriptions are readable
Each theme ability row SHALL display its name prominently and provide access to its full description.

#### Scenario: Ability name and description are accessible
- **WHEN** the Theme Features section renders an unlocked theme ability
- **THEN** the ability name is visible and the full description is accessible (e.g., expandable or shown inline)
