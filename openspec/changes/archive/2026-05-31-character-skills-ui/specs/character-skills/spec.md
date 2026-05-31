## ADDED Requirements

### Requirement: Character skills table stores per-character skill assignments
The system SHALL have a `character_skills` table. Each row SHALL store a `character_id`, `skill_id`, `ranks` (integer, default 0), `misc_mod` (integer, default 0), and an optional `label` (text, nullable — used for Profession specialization names). Deleting a character SHALL cascade-delete all its `character_skills` rows.

#### Scenario: A character can have a skill assigned
- **WHEN** a row is inserted into `character_skills` with a valid `character_id` and `skill_id`
- **THEN** the row is persisted and retrievable by `character_id`

#### Scenario: Profession allows multiple rows per character
- **WHEN** two rows are inserted with the same `character_id` and Profession `skill_id` but different `label` values
- **THEN** both rows are persisted with no constraint violation

#### Scenario: Deleting a character removes its skills
- **WHEN** a character is deleted
- **THEN** all `character_skills` rows for that character SHALL be deleted automatically via CASCADE

### Requirement: New characters start with an empty skill list
The system SHALL display no skills for a newly created character.

#### Scenario: Empty state is shown
- **WHEN** a character with no `character_skills` rows is viewed
- **THEN** the Skills section SHALL render an empty state message and an "Add Skills" button (for the owner)

### Requirement: Owner can add skills to their character
The system SHALL allow the character owner to open an "Add Skills" dialog that lists all 20 CRB skills and saves a selection in one operation.

#### Scenario: Dialog shows all skills with class-skill indicator
- **WHEN** the owner opens the Add Skills dialog
- **THEN** all 20 CRB skills SHALL be listed alphabetically, each showing its governing ability abbreviation; skills that are class skills for the character's class SHALL be marked with a ★

#### Scenario: Already-added skills are pre-checked
- **WHEN** the owner opens the Add Skills dialog
- **THEN** skills already present in `character_skills` for this character SHALL appear pre-checked

#### Scenario: Owner multi-selects and saves
- **WHEN** the owner selects skills and clicks Save
- **THEN** newly checked skills are inserted into `character_skills` and unchecked skills that were previously added are deleted

#### Scenario: Profession allows multiple specialization entries in one dialog pass
- **WHEN** the owner checks Profession in the dialog
- **THEN** a text input for the specialization name SHALL appear; the owner MAY add additional Profession entries via an inline "+ Add profession" control, each with its own label input; all entries are saved together on Save

### Requirement: Owner can remove a skill
The system SHALL allow the character owner to remove a skill row from the character sheet.

#### Scenario: Removing a skill deletes its data
- **WHEN** the owner clicks the remove control on a skill row
- **THEN** the corresponding `character_skills` row SHALL be deleted and the row removed from the UI

### Requirement: Skill totals are derived and displayed correctly
The system SHALL compute and display a total for each character skill using the formula: `total = ranks + classBonus + abilityMod + miscMod`.

#### Scenario: Class bonus applies when skill is a class skill and ranks > 0
- **WHEN** a skill is a class skill for the character's class AND `ranks` is greater than 0
- **THEN** `classBonus` SHALL equal 3

#### Scenario: Class bonus does not apply when ranks is 0
- **WHEN** a skill is a class skill for the character's class AND `ranks` equals 0
- **THEN** `classBonus` SHALL equal 0

#### Scenario: Ability modifier is derived from the character's current ability score
- **WHEN** a skill's governing ability is DEX and the character's DEX score is 16
- **THEN** `abilityMod` SHALL equal +3

#### Scenario: Total updates when ranks or misc_mod changes
- **WHEN** the owner changes the ranks or misc_mod input for a skill
- **THEN** the displayed total SHALL update immediately in the UI

### Requirement: Owner can edit ranks and misc_mod inline
The system SHALL allow the character owner to edit `ranks` and `misc_mod` for each skill directly in the skills table. Changes SHALL be persisted via a debounced save (600 ms).

#### Scenario: Debounced save persists the value
- **WHEN** the owner changes a ranks or misc_mod input and 600 ms elapses without further changes
- **THEN** the new value SHALL be saved to `character_skills`

### Requirement: Ranks budget is displayed
The system SHALL display a ranks budget indicator showing ranks used vs. total available.

#### Scenario: Budget formula uses max(1, skillRanksPerLevel + INTmod) × level
- **WHEN** the character is level 3, their class has `skill_ranks_per_level` = 8, and INT modifier is +2
- **THEN** total available ranks SHALL display as 30 (= max(1, 8+2) × 3)

#### Scenario: Minimum 1 rank per level regardless of INT modifier
- **WHEN** `skillRanksPerLevel + INTmod` is less than 1
- **THEN** total available ranks SHALL be computed as `1 × level`

#### Scenario: Ranks used equals sum of all character skill ranks
- **WHEN** a character has three skills with ranks 3, 2, and 1
- **THEN** ranks used SHALL display as 6
