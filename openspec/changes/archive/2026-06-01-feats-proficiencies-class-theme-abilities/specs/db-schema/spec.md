## ADDED Requirements

### Requirement: class_abilities and class_ability_options tables in schema
The system SHALL define `class_abilities` and `class_ability_options` tables in `src/db/schema.ts` using Drizzle's `pgTable` helper and export inferred TypeScript types for each (`ClassAbility`, `NewClassAbility`, `ClassAbilityOption`, `NewClassAbilityOption`).

#### Scenario: Types are exported and correctly shaped
- **WHEN** a developer uses `typeof classAbilities.$inferSelect`
- **THEN** TypeScript resolves a shape with `id`, `classId`, `name`, `description`, `level`, `repeatable`, `choicePool`, and `sourceBook` fields

### Requirement: theme_abilities table in schema
The system SHALL define a `theme_abilities` table in `src/db/schema.ts` and export inferred TypeScript types (`ThemeAbility`, `NewThemeAbility`).

#### Scenario: Types are exported and correctly shaped
- **WHEN** a developer uses `typeof themeAbilities.$inferSelect`
- **THEN** TypeScript resolves a shape with `id`, `themeId`, `name`, `description`, `level`, and `sourceBook` fields

### Requirement: feats table in schema
The system SHALL define a `feats` table in `src/db/schema.ts` and export inferred TypeScript types (`Feat`, `NewFeat`).

#### Scenario: Types are exported and correctly shaped
- **WHEN** a developer uses `typeof feats.$inferSelect`
- **THEN** TypeScript resolves a shape with `id`, `name`, `description`, `prerequisites`, `isCombatFeat`, and `sourceBook` fields

### Requirement: class_weapon_proficiency table in schema
The system SHALL define a `class_weapon_proficiency` table in `src/db/schema.ts` with a composite PK of `(class_id, weapon_category)` and export inferred TypeScript types.

#### Scenario: Composite primary key prevents duplicate rows
- **WHEN** an insert is attempted with a duplicate (class_id, weapon_category) pair
- **THEN** the database rejects the insert with a constraint violation

### Requirement: character_class_choices table in schema
The system SHALL define a `character_class_choices` table in `src/db/schema.ts` with cascade delete on `character_id` and export inferred TypeScript types (`CharacterClassChoice`, `NewCharacterClassChoice`).

#### Scenario: Deleting a character cascades
- **WHEN** a character row is deleted
- **THEN** all related `character_class_choices` rows are automatically deleted

### Requirement: character_feats table in schema
The system SHALL define a `character_feats` table in `src/db/schema.ts` with cascade delete on `character_id` and export inferred TypeScript types (`CharacterFeat`, `NewCharacterFeat`).

#### Scenario: Deleting a character cascades
- **WHEN** a character row is deleted
- **THEN** all related `character_feats` rows are automatically deleted
