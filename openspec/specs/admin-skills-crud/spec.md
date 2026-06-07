## Requirements

### Requirement: Skills are listed for the selected edition
The page at `/dashboard/admin/data/[editionSlug]/skills` SHALL display all skills for the edition. Columns: Name, Ability (key ability score), Trained Only (yes/no), Armor Check Penalty (yes/no), row actions (Edit, Delete).

#### Scenario: Skill list is shown
- **WHEN** admin visits the skills page
- **THEN** all skills for the edition are displayed

### Requirement: Admin can create and edit skills
"Add Skill" SHALL open a dialog with fields: Name (text, required), Ability (select: str/dex/con/int/wis/cha, required), Trained Only (checkbox), Armor Check Penalty (checkbox). Ability Alts SHALL be an optional comma-separated text input. Edit pre-fills the dialog.

#### Scenario: Successful skill creation
- **WHEN** admin submits name and ability
- **THEN** the skill appears in the table

### Requirement: Admin can delete a skill
Delete SHALL require confirmation. If the skill is referenced by `classSkills` or `characterSkills`, an error SHALL be shown rather than allowing silent cascade.

#### Scenario: Referenced skill cannot be deleted silently
- **WHEN** admin tries to delete a skill that has class or character references
- **THEN** an error is shown explaining the dependency
