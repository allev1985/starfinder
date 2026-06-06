## Requirements

### Requirement: Spaceship weapons are tracked per firing arc
The spaceship editor SHALL support adding weapons to the spaceship, each assigned to a firing arc (Forward, Port, Starboard, Aft, or Turret). Each weapon entry SHALL capture: name, damage, range, PCU cost, BP cost, and special properties.

#### Scenario: DM adds a weapon to a firing arc
- **WHEN** the DM selects a firing arc and adds a weapon
- **THEN** the weapon appears in the weapons list for that arc with all its stats displayed

#### Scenario: DM removes a weapon
- **WHEN** the DM removes a weapon from the weapons list
- **THEN** the weapon entry is deleted and no longer appears in the list

#### Scenario: Non-DM views weapons in read-only mode
- **WHEN** a non-DM participant views the spaceship weapons section
- **THEN** all weapon entries are displayed but no add or remove controls are rendered

### Requirement: Spaceship weapons are displayed grouped by firing arc
The weapons list SHALL group weapon entries under their assigned firing arc heading. Arcs with no weapons SHALL display an empty state message.

#### Scenario: Weapons grouped under arc headings
- **WHEN** the spaceship has a weapon in the Forward arc and a weapon in the Turret arc
- **THEN** the Forward arc section shows the first weapon and the Turret arc section shows the second weapon

#### Scenario: Empty arc shows empty state
- **WHEN** a firing arc has no weapons assigned
- **THEN** that arc section displays a message indicating no weapons are assigned

### Requirement: Weapon stats are stored in the database linked to the spaceship
Each spaceship weapon SHALL be stored as a row in a `spaceship_weapons` table linked to the spaceship by `spaceship_id`. The table SHALL capture: `spaceship_id`, `arc`, `name`, `damage`, `range`, `pcu`, `bp_cost`, `special`, with `arc` constrained to the valid arc values (forward, port, starboard, aft, turret).

#### Scenario: Weapon row is created on add
- **WHEN** the DM adds a weapon to a firing arc
- **THEN** a row exists in `spaceship_weapons` with the correct `spaceship_id` and `arc`

#### Scenario: Weapon row is deleted on remove
- **WHEN** the DM removes a weapon
- **THEN** the corresponding `spaceship_weapons` row is deleted

#### Scenario: Deleting a spaceship cascades to spaceship_weapons
- **WHEN** a spaceship row is deleted
- **THEN** all rows in `spaceship_weapons` for that spaceship are also deleted

### Requirement: Weapons arc damage status is tracked for Forward, Port, Starboard, and Aft arcs
The spaceship editor Weapons section SHALL display a single-select damage status button group (None / Glitching / Malfunctioning / Wrecked) below the weapon list for each of the four arcs: Forward, Port, Starboard, and Aft. The Turret arc SHALL NOT have a damage status control. Arc damage is arc-level, not per individual weapon entry.

#### Scenario: Forward arc damage is marked Glitching
- **WHEN** the DM clicks Glitching under the Forward arc
- **THEN** Glitching becomes active for the Forward arc and is persisted to the database

#### Scenario: Turret arc has no damage control
- **WHEN** the Turret arc section is rendered
- **THEN** no damage status button group is displayed for Turret

#### Scenario: Aft arc damage defaults to None
- **WHEN** the spaceship loads with no saved arc damage
- **THEN** the Aft arc damage control shows None as the active state

#### Scenario: Clearing arc damage
- **WHEN** the DM clicks the currently active damage state on an arc
- **THEN** the arc damage returns to None and null is persisted
