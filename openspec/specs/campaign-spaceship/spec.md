## Requirements

### Requirement: Campaign participants can view and manage a shared spaceship
Each campaign SHALL support exactly one shared spaceship record. The spaceship SHALL be accessible to all campaign participants via the campaign session layout.

#### Scenario: DM views the spaceship panel
- **WHEN** a DM navigates to the spaceship section of a campaign
- **THEN** the spaceship stats, systems, and crew roles are displayed

#### Scenario: Player views the spaceship panel
- **WHEN** a campaign participant who is not the DM navigates to the spaceship section
- **THEN** the spaceship stats, systems, and crew roles are displayed in the same layout as the DM view

#### Scenario: No spaceship exists yet
- **WHEN** a campaign has no spaceship record and any participant navigates to the spaceship section
- **THEN** an empty state is shown with an option (available to DM only) to create the spaceship

### Requirement: Spaceship record stores frame, systems, and crew
The spaceship SHALL be stored as a single database record linked to the campaign. The record SHALL capture: frame tier, speed, maneuverability, hull points, shield points (fore/aft/port/starboard), power core PCU, drift engine rating, a JSON column for expansion bays and crew roles, and the following AC/TL component integers: `pilotRank`, `sizeMod`, `armorBonus`, `acMiscMod`, `countermeasures`, `tlMiscMod` (all `NOT NULL DEFAULT 0`).

#### Scenario: Spaceship record is created
- **WHEN** the DM creates a spaceship for the campaign
- **THEN** a row exists in `spaceships` linked to the campaign with all required fields populated and AC/TL component fields defaulting to 0

#### Scenario: Spaceship stats are updated
- **WHEN** the DM edits a spaceship field
- **THEN** the updated value is persisted and immediately reflected in all participants' views via the debounced save pattern

### Requirement: Only the DM can create or edit the spaceship
Campaign participants who are not the DM SHALL see the spaceship in read-only mode. The DM SHALL have full edit access.

#### Scenario: DM edits a field
- **WHEN** the DM views the spaceship section
- **THEN** all fields are interactive and save via the standard debounced onChange pattern (600 ms)

#### Scenario: Non-DM participant attempts to edit
- **WHEN** a non-DM participant views the spaceship section
- **THEN** all fields are rendered in read-only mode with no save affordances

### Requirement: Spaceship section is accessible from the campaign sidebar
The campaign session sidebar SHALL include a navigation entry for the spaceship. Clicking it SHALL load the spaceship panel in the main content area without a full page reload.

#### Scenario: Participant clicks Spaceship in sidebar
- **WHEN** any campaign participant clicks the Spaceship entry in the sidebar
- **THEN** the spaceship panel loads in the main content area and the sidebar remains visible
