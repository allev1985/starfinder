## ADDED Requirements

### Requirement: character_weapons join table
The system SHALL have a `character_weapons` table with columns:
- `character_id` — uuid, not null, FK → `characters.id` ON DELETE CASCADE
- `weapon_id` — uuid, not null, FK → `weapons.id`
- Primary key: `(character_id, weapon_id)`

#### Scenario: Join table is created by migration
- **WHEN** the schema migration runs
- **THEN** `character_weapons` exists with the composite primary key and both foreign keys

#### Scenario: Deleting a character cascades to character_weapons
- **WHEN** a character row is deleted
- **THEN** all rows in `character_weapons` for that character are also deleted

#### Scenario: Same weapon cannot be added to the same character twice
- **WHEN** a duplicate `(character_id, weapon_id)` insert is attempted
- **THEN** the database rejects it with a primary key violation

### Requirement: Owner can add a weapon to inventory
The character owner SHALL be able to search for and add a weapon from the full CRB weapons list via a searchable combobox. Adding a weapon SHALL insert a row into `character_weapons` immediately (no debounce — discrete selection). A weapon already in the character's inventory SHALL NOT appear as an option in the combobox.

#### Scenario: Owner adds a weapon from the combobox
- **WHEN** the owner opens the weapon combobox, searches for a weapon, and selects it
- **THEN** the weapon appears in the character's weapon inventory and a `character_weapons` row is inserted

#### Scenario: Combobox filters by name
- **WHEN** the owner types text in the weapon search field
- **THEN** the list narrows to weapons whose name contains the typed text (case-insensitive)

#### Scenario: Already-carried weapon is excluded from combobox
- **WHEN** the owner opens the weapon combobox and the character already carries weapon X
- **THEN** weapon X does not appear in the combobox options

#### Scenario: Non-owner cannot add weapons
- **WHEN** a non-owner views the character sheet
- **THEN** no "Add weapon" control is rendered

### Requirement: Owner can remove a weapon from inventory
The character owner SHALL be able to remove any weapon from inventory. Removal SHALL delete the corresponding `character_weapons` row immediately with a confirmation prompt to prevent accidental removal.

#### Scenario: Owner removes a weapon
- **WHEN** the owner clicks the remove action on a weapon card and confirms
- **THEN** the weapon is removed from the inventory display and the `character_weapons` row is deleted

#### Scenario: Non-owner cannot remove weapons
- **WHEN** a non-owner views the character sheet
- **THEN** no remove control is rendered on any weapon card

### Requirement: Weapon inventory displays stat cards
Each weapon in a character's inventory SHALL be displayed as a stat card showing all weapon fields: name, item level, category, damage (dice + types), critical (effect + dice or "—"), range ("—" for melee), capacity, usage, bulk, and special ("—" if none).

#### Scenario: Weapon card shows all stats
- **WHEN** a character's inventory contains the Azimuth Laser Pistol
- **THEN** its card shows: name "Azimuth Laser Pistol", level 1, category "Small Arms", damage "1d4 Fire", critical "Burn 1d4", range "30 ft", capacity 20, usage 1, bulk "L", special "—"

#### Scenario: Melee weapon card shows "—" for range
- **WHEN** a melee weapon is in inventory
- **THEN** the Range stat cell displays "—"

#### Scenario: Weapon with no critical shows "—" for critical
- **WHEN** a weapon has null critical_effect
- **THEN** the Critical stat cell displays "—"

#### Scenario: Weapon with no special shows "—" for special
- **WHEN** a weapon has null special
- **THEN** the Special stat cell displays "—"
