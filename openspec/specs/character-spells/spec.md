## Requirements

### Requirement: character_spells table
The system SHALL have a `character_spells` table with columns: `id` (uuid PK), `character_id` (uuid, FK → characters.id, not null), `spell_id` (uuid, FK → spells.id, not null), `spell_level` (integer, not null). A unique constraint SHALL exist on `(character_id, spell_id)`.

#### Scenario: character_spells table exists after migration
- **WHEN** the schema migration runs
- **THEN** the `character_spells` table exists with all required columns and constraints

#### Scenario: Same spell cannot be learned twice
- **WHEN** a character_spells row is inserted for a (character_id, spell_id) pair that already exists
- **THEN** the insert is rejected with a unique constraint violation

### Requirement: character_spell_slots table
The system SHALL have a `character_spell_slots` table with columns: `character_id` (uuid, FK → characters.id, not null), `spell_level` (integer, not null, 1–6), `total_slots` (integer, not null, default 0), `used_slots` (integer, not null, default 0). The primary key SHALL be `(character_id, spell_level)`. Level 0 SHALL NOT have a slot row — cantrips are cast at will with no limit.

#### Scenario: character_spell_slots table exists after migration
- **WHEN** the schema migration runs
- **THEN** the `character_spell_slots` table exists with all required columns

#### Scenario: Duplicate spell level for same character is rejected
- **WHEN** a second row is inserted for the same (character_id, spell_level)
- **THEN** the insert is rejected with a primary key violation

### Requirement: Spells section visible only for spellcasting classes
The character sheet SHALL render a Spells section only when the character's class has `is_spellcaster = true`. For non-spellcasting classes the section SHALL not be rendered at all.

#### Scenario: Spells section shown for Mystic
- **WHEN** a character's class is Mystic
- **THEN** the Spells section is rendered on the character sheet

#### Scenario: Spells section shown for Technomancer
- **WHEN** a character's class is Technomancer
- **THEN** the Spells section is rendered on the character sheet

#### Scenario: Spells section hidden for non-spellcasters
- **WHEN** a character's class is Envoy, Mechanic, Operative, Solarian, or Soldier
- **THEN** the Spells section is not rendered on the character sheet

### Requirement: Spell level tabs navigation
The Spells section SHALL display tabs for spell levels 0 through 6. Selecting a tab shows the known spells and slot tracker for that level. Level 0 SHALL show known cantrips with no slot tracker.

#### Scenario: Spell level tabs are rendered
- **WHEN** the Spells section is rendered for a spellcasting character
- **THEN** tabs labeled 0, 1, 2, 3, 4, 5, 6 are visible

#### Scenario: Level 0 tab shows no slot tracker
- **WHEN** the user selects the level 0 tab
- **THEN** no spell slot tracker is rendered for that tab

#### Scenario: Level 1–6 tabs show slot tracker
- **WHEN** the user selects a tab for spell level 1–6
- **THEN** a slot tracker displaying total and used counts is rendered

### Requirement: Manual spell slot tracking
For each spell level 1–6, the character sheet SHALL display the total slot count and allow the user to mark slots as used. The user SHALL be able to set the total number of slots and increment/decrement used slots.

#### Scenario: User sets total slots
- **WHEN** the user edits the total slots field for a spell level
- **THEN** the new value is persisted to `character_spell_slots.total_slots`

#### Scenario: User marks a slot as used
- **WHEN** the user clicks to use a slot
- **THEN** `character_spell_slots.used_slots` increments by 1 (up to total_slots)

#### Scenario: User recovers a slot
- **WHEN** the user clicks to recover a used slot
- **THEN** `character_spell_slots.used_slots` decrements by 1 (minimum 0)

### Requirement: Known spells list per level
Each spell level tab SHALL list the spells the character knows at that level. Each spell entry SHALL display the spell name, school, casting time, and damage (if any). Expanding a spell entry SHALL reveal the full description, range, area/targets, duration, saving throw, and spell resistance.

#### Scenario: Known spells shown under correct level tab
- **WHEN** a character has learned a 2nd-level spell and the user selects the level 2 tab
- **THEN** that spell appears in the list

#### Scenario: Expanded spell shows full detail
- **WHEN** the user expands a spell entry
- **THEN** description, range, area/targets, duration, saving throw, and spell resistance are visible

### Requirement: Add spell from class catalog
The character SHALL be able to learn new spells from a dialog that shows all spells available to their class filtered to the selected spell level. Already-known spells SHALL be excluded from the dialog list.

#### Scenario: Add spell dialog opens for correct class
- **WHEN** the user clicks "Add Spell" on the level 2 tab for a Mystic character
- **THEN** a dialog opens listing all Mystic level 2 spells not already known by the character

#### Scenario: Learning a spell persists it
- **WHEN** the user selects a spell in the add-spell dialog and confirms
- **THEN** a row is inserted into `character_spells` and the spell appears in the list

#### Scenario: Already-known spells are excluded from the dialog
- **WHEN** a character already knows "Mind Thrust"
- **THEN** "Mind Thrust" does not appear in the add-spell dialog for that character

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
