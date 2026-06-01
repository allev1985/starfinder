## ADDED Requirements

### Requirement: character_class_choices table persists player selections
The system SHALL provide a `character_class_choices` table with columns: `id` (uuid PK), `character_id` (uuid FK → `characters.id`, on delete cascade), `class_ability_id` (uuid FK → `class_abilities.id`), `option_id` (uuid FK → `class_ability_options.id`, nullable), `custom_value` (text, nullable), `acquired_at_level` (integer, not null). Exactly one of `option_id` or `custom_value` SHALL be non-null per row. The `acquired_at_level` column identifies which slot is being filled for repeatable features.

#### Scenario: Saving a structured choice persists option_id
- **WHEN** a player selects "Blitz" from the fighting style picker for a Soldier
- **THEN** a `character_class_choices` row is upserted with the correct `option_id` and `custom_value = NULL`

#### Scenario: Saving a freetext choice persists custom_value
- **WHEN** a player types a custom value for a choice slot
- **THEN** a `character_class_choices` row is upserted with `option_id = NULL` and the typed `custom_value`

#### Scenario: Deleting character cascades to choices
- **WHEN** a character is deleted
- **THEN** all associated `character_class_choices` rows are deleted

### Requirement: Class Features section displays on character sheet
The character sheet SHALL render a "Class Features" section that lists all `class_abilities` rows for the character's class with `level <= character.level`, grouped by level, ordered level ascending.

#### Scenario: Section is hidden when character has no class
- **WHEN** the character has no `class_id`
- **THEN** the Class Features section is not rendered

#### Scenario: Features above current level are not shown
- **WHEN** a character is level 4
- **THEN** class features with `level > 4` are not displayed

#### Scenario: All earned features are shown
- **WHEN** a character is level 3
- **THEN** all class features with `level <= 3` are rendered, grouped under their respective level headings

### Requirement: Deterministic features are displayed as read-only text
Class features with `choice_pool = NULL` and `repeatable = false` SHALL be displayed as a static name and expandable description — no interactive element required.

#### Scenario: Feature name and description are shown
- **WHEN** the Class Features section renders a deterministic feature
- **THEN** the feature name is visible and tapping/clicking reveals its full description

### Requirement: Choice features render a picker per slot
For `class_abilities` rows where `choice_pool` is non-null and `repeatable = false`, the UI SHALL render a single picker that lets the player select from `class_ability_options` for that pool or enter a custom value. The selected value SHALL be persisted via debounced save.

#### Scenario: Unfilled choice slot shows placeholder
- **WHEN** a character has a choice feature with no saved choice
- **THEN** the picker shows a placeholder indicating a selection is needed

#### Scenario: Previously saved choice is pre-selected
- **WHEN** a character has a saved `character_class_choices` row for a choice feature
- **THEN** the picker shows the saved option name or custom value

#### Scenario: Changing selection persists new value
- **WHEN** a player changes their fighting style selection
- **THEN** the `character_class_choices` row is updated with the new `option_id`

### Requirement: Repeatable features render N pickers derived from level
For `class_abilities` rows where `repeatable = true`, the UI SHALL calculate N = the number of times a feature with that name appears in the class progression up to the character's current level, then render N picker slots. Each slot maps to a distinct `acquired_at_level`.

#### Scenario: Envoy at level 5 sees 5 Improvisation slots
- **WHEN** an Envoy character is level 5
- **THEN** the Class Features section shows 5 Improvisation picker slots (one per level 1–5)

#### Scenario: Each slot saves independently
- **WHEN** a player fills improvisation slot 3 (acquired_at_level = 3)
- **THEN** only the `character_class_choices` row with `acquired_at_level = 3` is updated

#### Scenario: Unfilled slots show a prompt to choose
- **WHEN** a repeatable slot has no saved choice
- **THEN** the slot shows a "Choose [feature name]" prompt

### Requirement: Weapon proficiencies displayed in Class Features section
The Class Features section SHALL include a "Weapon Proficiencies" subsection showing the proficient weapon categories for the character's class, derived from `class_weapon_proficiency`. This subsection is read-only.

#### Scenario: Proficiencies shown for character with a class
- **WHEN** a Soldier character views their sheet
- **THEN** the Weapon Proficiencies subsection lists all 8 weapon categories

#### Scenario: Proficiencies hidden when character has no class
- **WHEN** the character has no class assigned
- **THEN** the Weapon Proficiencies subsection is not rendered
