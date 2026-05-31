## ADDED Requirements

### Requirement: Android characters are seeded with the standard android skill list at creation
When an android character is created, `character_skills` SHALL be seeded with exactly the 6 standard android skills: Acrobatics, Athletics, Computers, Engineering, Perception, and Stealth. All seeded rows SHALL have `ranks = 0` and `misc_mod = 0`. Biological characters SHALL continue to receive no seeded skills at creation.

#### Scenario: Android creation seeds exactly 6 standard skills
- **WHEN** an android character is created with the Combat chassis (no bonus skill)
- **THEN** the character has exactly 6 `character_skills` rows covering the standard android skill list

#### Scenario: Biological creation seeds no skills
- **WHEN** a biological character is created
- **THEN** no `character_skills` rows are inserted at creation

### Requirement: Android skills section renders a fixed locked list
The skills section for android characters SHALL render only the android's seeded skill list. The section SHALL not show an "Add Skills" button or any per-row remove control. The skill list is immutable after creation.

#### Scenario: No add button shown for android
- **WHEN** the owner of an android character views the Skills section
- **THEN** no "Add Skills" button is rendered

#### Scenario: No remove control shown for android skill rows
- **WHEN** the owner of an android character views a skill row
- **THEN** no remove/delete control is rendered on any skill row

#### Scenario: Biological character still shows add button
- **WHEN** the owner of a biological character views the Skills section
- **THEN** the "Add Skills" button is rendered as before

### Requirement: Android skill ranks are derived from mechanic level and displayed read-only
The android skills section SHALL display ranks as a read-only value equal to the linked mechanic's current level. The ranks input SHALL not be editable for android characters.

#### Scenario: Ranks column is read-only for android
- **WHEN** the owner views an android character's skill row
- **THEN** the ranks value is displayed as static text, not as an editable input

#### Scenario: Ranks value equals mechanic level
- **WHEN** the linked mechanic is level 4
- **THEN** every android skill row displays ranks = 4

#### Scenario: Ranks display dash with no mechanic linked
- **WHEN** no mechanic is linked to the android
- **THEN** every android skill row displays "—" in the ranks column

### Requirement: Android skill misc_mod remains editable
The android skill misc_mod field SHALL remain an editable number input, persisted via debounced save (600 ms), identical to biological skill behavior.

#### Scenario: Owner can edit misc_mod on android skill
- **WHEN** the owner changes the misc_mod for an android skill and 600 ms elapse
- **THEN** the new value is saved to `character_skills.misc_mod`

### Requirement: Android skill totals are computed correctly
Android skill totals SHALL use the formula: `total = mechanicLevel + classBonus + abilityMod + miscMod`. All android skills are class skills, so `classBonus = 3` when `mechanicLevel > 0`, else `0`.

#### Scenario: Total computed with mechanic level
- **WHEN** mechanic level = 3, skill is Acrobatics (DEX), android DEX score = 16 (mod +3), miscMod = 0
- **THEN** total = 3 + 3 + 3 + 0 = 9

#### Scenario: Class bonus not applied when ranks are zero
- **WHEN** no mechanic is linked (ranks treated as 0) and miscMod = 0
- **THEN** total = 0 + 0 + abilityMod + 0

### Requirement: Android skills section does not show a ranks budget
The android skills section SHALL not render a ranks budget indicator. Ranks are not allocated from a pool.

#### Scenario: No budget row shown for android
- **WHEN** an android character's skill section renders
- **THEN** no ranks used / ranks available budget display is present
