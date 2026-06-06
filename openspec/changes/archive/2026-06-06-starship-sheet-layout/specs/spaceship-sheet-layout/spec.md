## ADDED Requirements

### Requirement: Spaceship editor renders in spatial zones matching the PDF Play Sheet
The spaceship editor SHALL arrange its content in the following spatial zones, stacking vertically on mobile and expanding to multi-column grids on larger viewports:
1. Top row: Identity | Shields compass | AC/TL/HP stats
2. Weapons strip: all five firing arcs
3. Bottom row: Crew | Notes | Expansion Bays
4. Systems row: Power Core + Drift Engine | Systems notes | Cargo/Passengers
5. Critical Damage (full width)

#### Scenario: Desktop renders three-column top row
- **WHEN** the spaceship editor is viewed on a viewport ≥ 1024px
- **THEN** the identity block, shields compass, and stats block appear side-by-side in three equal columns

#### Scenario: Mobile stacks all zones vertically
- **WHEN** the spaceship editor is viewed on a viewport < 640px
- **THEN** every zone renders as a single column in top-to-bottom order matching the zone list above

### Requirement: Spaceship editor uses max-w-6xl container
The spaceship editor container SHALL use `max-w-6xl` to allow multi-column layouts to render correctly at desktop widths.

#### Scenario: Container width on desktop
- **WHEN** the page is viewed on a wide desktop viewport
- **THEN** the editor is constrained to 72rem and centered, not stretching to fill ultra-wide screens

### Requirement: Bottom and systems rows are three-column grids on sm+
The bottom row (Crew / Notes / Expansion Bays) and the systems row (Power Core+Drift / Systems notes / Cargo) SHALL each render as a three-column grid at viewports ≥ 640px and as a single column below that.

#### Scenario: Three-column bottom row on tablet
- **WHEN** the spaceship editor is viewed on a viewport ≥ 640px
- **THEN** Crew, Notes, and Expansion Bays appear in three side-by-side columns

#### Scenario: Single-column bottom row on mobile
- **WHEN** the spaceship editor is viewed on a viewport < 640px
- **THEN** Crew, Notes, and Expansion Bays stack vertically
