## ADDED Requirements

### Requirement: Description section on character sheet
The character detail page SHALL render a Description section that displays the `description`-type race attributes for the character's selected race, merged with any saved values from `character_race_attribute_values`. If the character has no race selected, the section SHALL be hidden.

#### Scenario: Owner sees editable fields
- **WHEN** the character owner views the character detail page
- **THEN** each description attribute is rendered as an editable text input pre-filled with the saved value (or empty if none)

#### Scenario: Non-owner sees read-only values
- **WHEN** a non-owner views the character detail page
- **THEN** each description attribute is rendered as a read-only label/value pair

#### Scenario: No race selected hides the section
- **WHEN** a character has no race assigned
- **THEN** the Description section does not appear on the page

### Requirement: Inline auto-save on blur
Each description attribute input SHALL auto-save its value when the input loses focus. No explicit save button is required.

#### Scenario: Value saved on blur
- **WHEN** the owner edits a description field and moves focus away
- **THEN** the new value is persisted via upsert without any additional user action

#### Scenario: Empty value is accepted
- **WHEN** the owner clears a field and blurs
- **THEN** an empty string is saved for that attribute
