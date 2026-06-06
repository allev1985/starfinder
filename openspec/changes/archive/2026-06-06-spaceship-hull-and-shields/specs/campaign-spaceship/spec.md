## MODIFIED Requirements

### Requirement: Spaceship record stores frame, systems, and crew
The spaceship SHALL be stored as a single database record linked to the campaign. The record SHALL capture: frame tier, speed, maneuverability, hull points, shield points (fore/aft/port/starboard), power core PCU, drift engine rating, a JSON column for expansion bays and crew roles, and the following AC/TL component integers: `pilotRank`, `sizeMod`, `armorBonus`, `acMiscMod`, `countermeasures`, `tlMiscMod` (all `NOT NULL DEFAULT 0`). The record SHALL additionally store the following hull and shield integers (all `NOT NULL DEFAULT 0`): `hullTotal`, `hullCurrent`, `damageThreshold`, `criticalThreshold`, `shieldForward`, `shieldPort`, `shieldStarboard`, `shieldAft`, `shieldRegenPerMin`.

#### Scenario: Spaceship record is created
- **WHEN** the DM creates a spaceship for the campaign
- **THEN** a row exists in `spaceships` linked to the campaign with all required fields populated, AC/TL component fields defaulting to 0, and hull/shield fields defaulting to 0

#### Scenario: Spaceship stats are updated
- **WHEN** the DM edits a spaceship field
- **THEN** the updated value is persisted and immediately reflected in all participants' views via the debounced save pattern
