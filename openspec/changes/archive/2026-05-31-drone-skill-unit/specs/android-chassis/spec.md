## MODIFIED Requirements

### Requirement: Chassis bonus skill seeded at android creation
When a drone character is created, the character's `character_skills` SHALL be seeded with the Skill Unit skill plus the chassis bonus skill (if the chassis has one). If the Skill Unit selector correctly excludes the chassis bonus from its options, no deduplication is needed at the seeding layer.

#### Scenario: Hover chassis seeds Acrobatics as bonus plus the chosen Skill Unit
- **WHEN** a character is created with the Hover chassis and Athletics as the Skill Unit
- **THEN** the character's `character_skills` contains exactly two rows: Athletics and Acrobatics

#### Scenario: Combat chassis seeds only the chosen Skill Unit
- **WHEN** a character is created with the Combat chassis
- **THEN** the character's `character_skills` contains exactly one row: the chosen Skill Unit
