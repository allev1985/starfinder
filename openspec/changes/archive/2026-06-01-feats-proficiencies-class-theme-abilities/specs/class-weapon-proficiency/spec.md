## ADDED Requirements

### Requirement: class_weapon_proficiency table exists and is seeded
The system SHALL provide a `class_weapon_proficiency` table with a composite primary key of `(class_id, weapon_category)` where `class_id` is a uuid FK → `classes.id` and `weapon_category` is the existing `weapon_category` enum. The table SHALL be seeded with the weapon proficiencies for all 7 CRB classes as defined in the Starfinder CRB.

CRB proficiency matrix:
- **Envoy**: basic melee, small arms, grenades
- **Mechanic**: basic melee, small arms, grenades
- **Mystic**: basic melee, small arms
- **Operative**: basic melee, small arms, sniper
- **Solarian**: advanced melee, basic melee, small arms, special
- **Soldier**: basic melee, advanced melee, small arms, longarms, heavy, sniper, grenades, special
- **Technomancer**: basic melee, small arms

#### Scenario: Weapon proficiency rows are present after seed migration
- **WHEN** the seed migration runs
- **THEN** `SELECT COUNT(*) FROM class_weapon_proficiency` returns the correct total count for all 7 classes

#### Scenario: Soldier is proficient with all weapon categories
- **WHEN** the seed migration runs
- **THEN** the Soldier class has rows for basic melee, advanced melee, small arms, longarms, heavy, sniper, grenades, and special

#### Scenario: Mystic is only proficient with basic melee and small arms
- **WHEN** the seed migration runs
- **THEN** the Mystic class has exactly 2 rows: basic melee and small arms

### Requirement: Reference query for class weapon proficiencies
The system SHALL expose a server-side query `getWeaponProficienciesForClass(classId: string): Promise<WeaponCategory[]>` that returns the list of weapon categories the given class is proficient with.

#### Scenario: Query returns proficiencies for a valid class
- **WHEN** `getWeaponProficienciesForClass` is called with the Soldier class ID
- **THEN** all 8 weapon categories are returned

#### Scenario: Query returns empty array when class has no proficiencies or unknown ID
- **WHEN** `getWeaponProficienciesForClass` is called with an unknown ID
- **THEN** an empty array is returned
