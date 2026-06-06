## MODIFIED Requirements

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
