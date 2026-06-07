## ADDED Requirements

### Requirement: Character fixture provides a fully-typed character with combat stats
`tests/fixtures/character.ts` SHALL export a `characterFixture` typed as `Character` and a `combatStatsFixture` typed as `CharacterCombatStats`. Ability scores SHALL be chosen to produce non-trivial, non-zero modifiers so that formula tests are meaningful. An `armorFixture` typed as `Armor` SHALL also be exported for AC calculation tests.

#### Scenario: Fixture is importable and typed correctly
- **WHEN** a test imports `characterFixture` from the fixture file
- **THEN** TypeScript accepts the value as type `Character` with no errors

#### Scenario: Fixture ability scores produce testable modifiers
- **WHEN** `modifier(characterFixture.dexScore)` is called
- **THEN** the result is a non-zero integer that matches the expected formula output

### Requirement: Campaign fixture provides a campaign with DM and player roles
`tests/fixtures/campaign.ts` SHALL export a `campaignFixture` typed as `Campaign`, a `dmUserId` string constant, and a `playerUserId` string constant. The fixture SHALL also export a `battleFixture` typed as `Battle` and a `combatantsFixture` as `BattleCombatant[]` with at least three combatants at different initiative values including one that is defeated.

#### Scenario: Battle fixture has enough combatants for turn-progression tests
- **WHEN** tests import `combatantsFixture`
- **THEN** the array contains at least 3 combatants with distinct sortOrder values

### Requirement: Spaceship fixture provides a fully-typed spaceship with weapons and crew
`tests/fixtures/spaceship.ts` SHALL export a `spaceshipFixture` typed as `Spaceship` with non-zero hull, shield, and armor values. A `spaceshipWeaponsFixture` typed as `SpaceshipWeapon[]` with at least two weapons in different arcs SHALL also be exported.

#### Scenario: Spaceship fixture is importable and typed correctly
- **WHEN** a test imports `spaceshipFixture`
- **THEN** TypeScript accepts the value as type `Spaceship` with no errors
