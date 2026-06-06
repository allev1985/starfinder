## Requirements

### Requirement: Campaign participants can view and manage a fleet of spaceships
Each campaign SHALL support zero or more shared spaceship records. Each spaceship SHALL be accessible to all campaign participants via its own URL in the campaign session layout. The DM may create, edit, and delete any ship at any time.

#### Scenario: DM views a ship's panel
- **WHEN** a DM navigates to `/campaigns/[id]/spaceship/[shipId]`
- **THEN** the spaceship stats, systems, and crew roles for that specific ship are displayed

#### Scenario: Player views a ship's panel
- **WHEN** a campaign participant who is not the DM navigates to `/campaigns/[id]/spaceship/[shipId]`
- **THEN** the spaceship stats, systems, and crew roles are displayed in the same layout as the DM view

#### Scenario: No spaceship exists yet
- **WHEN** a campaign has no spaceship records and any participant navigates to the spaceship section
- **THEN** an empty state is shown with an option (available to DM only) to create the first spaceship

### Requirement: Spaceship record stores frame, systems, and crew
The spaceship SHALL be stored as a single database record linked to the campaign. The record SHALL capture the following columns:

**Descriptors (text, nullable):** `name`, `make_and_model`, `speed`, `size`, `frame`, `tier`, `maneuverability`, `power_core_name`, `drift_engine`

**Numerics (integer, nullable):** `power_core_pcu`, `drift_rating`

**AC/TL components (integer, NOT NULL DEFAULT 0):** `pilot_rank`, `size_mod`, `armor_bonus`, `ac_misc_mod`, `countermeasures`, `tl_misc_mod`

**Hull/shield integers (integer, NOT NULL DEFAULT 0 unless noted):** `hull_total`, `hull_current` (nullable), `damage_threshold`, `critical_threshold`, `shield_forward_total`, `shield_forward_current` (nullable), `shield_port_total`, `shield_port_current` (nullable), `shield_starboard_total`, `shield_starboard_current` (nullable), `shield_aft_total`, `shield_aft_current` (nullable), `shield_regen_per_min`, `shield_misc_mod`

Crew role assignments SHALL be stored in a separate `spaceship_crew` child table (not a JSON column on the spaceship row).

#### Scenario: Spaceship record is created
- **WHEN** the DM creates a spaceship for the campaign
- **THEN** a row exists in `spaceships` linked to the campaign with all NOT NULL fields defaulting to 0, all nullable descriptor fields as NULL, and no crew assignments yet

#### Scenario: Spaceship stats are updated
- **WHEN** the DM edits any spaceship field
- **THEN** the updated value is persisted and immediately reflected in all participants' views via the debounced save pattern

### Requirement: Only the DM can create or edit the spaceship
Campaign participants who are not the DM SHALL see the spaceship in read-only mode. The DM SHALL have full edit access.

#### Scenario: DM edits a field
- **WHEN** the DM views the spaceship section
- **THEN** all fields are interactive and save via the standard debounced onChange pattern (600 ms)

#### Scenario: Non-DM participant attempts to edit
- **WHEN** a non-DM participant views the spaceship section
- **THEN** all fields are rendered in read-only mode with no save affordances

### Requirement: Spaceship section is accessible from the campaign sidebar as a fleet list
The campaign session sidebar SHALL include a "Spaceship" section listing all ships in the campaign by name. Each entry links to that ship's editor URL. A DM-only "Add ship" entry appears at the bottom of the section.

#### Scenario: Participant clicks a ship in the sidebar
- **WHEN** any campaign participant clicks a ship entry in the sidebar
- **THEN** that ship's editor loads in the main content area and the sidebar entry becomes active
