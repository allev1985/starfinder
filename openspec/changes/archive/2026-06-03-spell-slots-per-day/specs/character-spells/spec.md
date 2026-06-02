## ADDED Requirements

### Requirement: Slot tracker renders for spell levels 1–6
For each spell level tab 1–6, the Spells section SHALL render a slot tracker showing pip indicators (one pip per total slot), a count of remaining slots, and +/− controls to adjust `total_slots`. Level 0 (cantrips) SHALL NOT render a slot tracker.

#### Scenario: Slot tracker visible on level 1 tab
- **WHEN** a spellcasting character has total_slots > 0 for level 1 and the user selects the level 1 tab
- **THEN** pip indicators equal in number to `total_slots` are rendered, filled pips representing unused slots

#### Scenario: No slot tracker on cantrips tab
- **WHEN** the user selects the level 0 tab
- **THEN** no slot tracker component is rendered

#### Scenario: Used pip appears unfilled
- **WHEN** `used_slots` = 2 and `total_slots` = 4 for a given level
- **THEN** 2 pips are filled and 2 pips are empty

### Requirement: Slot tracker pre-fills from class progression
When a character has no `character_spell_slots` row for a level, the slot tracker's total field SHALL default to the `spells_per_day` value from `class_spell_progression` for the character's current level and spell level. If no progression row exists, the default SHALL be 0.

#### Scenario: Default total from class table when no slot row exists
- **WHEN** a Mystic character has no `character_spell_slots` row for level 2 and `class_spell_progression` shows spells_per_day = 3 at their current character level
- **THEN** the total slots field displays 3

#### Scenario: Zero default when no progression data
- **WHEN** a character has no class or no matching progression row for a spell level
- **THEN** the total slots field defaults to 0

### Requirement: Long Rest button resets all used slots
The Spells section header SHALL include a "Long Rest" button visible to the character owner. Activating it SHALL set `used_slots = 0` for all `character_spell_slots` rows belonging to that character in a single server action.

#### Scenario: Long rest zeros all used slots
- **WHEN** the owner clicks "Long Rest"
- **THEN** all spell levels for that character have `used_slots` set to 0 and all pips display as filled

#### Scenario: Long rest button not shown to non-owners
- **WHEN** a non-owner views the character sheet
- **THEN** the Long Rest button is not rendered

### Requirement: Slot state persists across sessions
`character_spell_slots` rows SHALL be written to the database on every change. Reloading the page or opening the sheet on another device SHALL reflect the last saved state.

#### Scenario: Used slots persist after page reload
- **WHEN** the user marks 2 slots as used on level 1 and reloads the page
- **THEN** the level 1 tab shows 2 used slots

#### Scenario: Total slots persist after page reload
- **WHEN** the user sets total slots to 5 for level 3 and reloads the page
- **THEN** the level 3 tab shows 5 total slots
