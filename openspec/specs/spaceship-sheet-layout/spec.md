## Requirements

### Requirement: Spaceship play sheet uses a responsive spatial layout matching PDF Page 1 zones
The spaceship editor SHALL arrange its sections into spatial zones that mirror the Starfinder Ship Sheet (PDF Page 1 — Play Sheet), using a mobile-first responsive grid. The root container SHALL use `max-w-6xl` to accommodate three-column rows on desktop.

#### Scenario: Layout on mobile (< sm breakpoint)
- **WHEN** the spaceship sheet is viewed at mobile width (< 640px)
- **THEN** all zones stack in a single column in order: top row, weapons strip, bottom row, systems row, critical damage

#### Scenario: Layout on desktop (lg+)
- **WHEN** the spaceship sheet is viewed at desktop width (>= 1024px)
- **THEN** the top row renders as three equal columns: Identity | Shields compass | AC/TL/HP stats

### Requirement: Top row has three zones: Identity, Shields, and Stats
The spaceship editor SHALL wrap the identity fields, shields compass, and AC/TL/HP stats block in a `grid grid-cols-1 lg:grid-cols-3 gap-4` container so they render side by side on desktop and stack on mobile.

#### Scenario: Identity column is first
- **WHEN** the top row is rendered on desktop
- **THEN** the identity fields (Name, Tier, Make & Model, Size, Frame, Speed, Maneuverability) occupy the first column

#### Scenario: Shields compass is second
- **WHEN** the top row is rendered on desktop
- **THEN** the shields compass occupies the second column

#### Scenario: Stats block is third
- **WHEN** the top row is rendered on desktop
- **THEN** the AC, TL, and HP stats occupy the third column

### Requirement: Weapons section renders as a scrollable strip on mobile/tablet and a 5-column grid on desktop
The weapons arcs SHALL be wrapped in a `flex gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-5 lg:overflow-x-visible` container. Each arc card SHALL have `min-w-[200px] shrink-0 lg:min-w-0` so cards maintain minimum width in the scroll strip and fill column width in the grid.

#### Scenario: Weapons strip scrolls horizontally on mobile
- **WHEN** the spaceship sheet is viewed at mobile or tablet width
- **THEN** all five arc cards are visible by horizontal scrolling within the weapons section

#### Scenario: Weapons render as 5-column grid on desktop
- **WHEN** the spaceship sheet is viewed at desktop width (>= 1024px)
- **THEN** all five arc cards render in a 5-column grid with no horizontal scroll

### Requirement: Bottom row has three zones: Crew, Notes, and Expansion Bays
The Crew section, the Notes note-section, and the Expansion Bays note-section SHALL be wrapped in a `grid grid-cols-1 sm:grid-cols-3 gap-4` container.

#### Scenario: Bottom row stacks on mobile
- **WHEN** the spaceship sheet is viewed at mobile width
- **THEN** Crew, Notes, and Expansion Bays stack vertically in that order

#### Scenario: Bottom row is 3-column from sm+
- **WHEN** the spaceship sheet is viewed at sm+ width (>= 640px)
- **THEN** Crew, Notes, and Expansion Bays render side by side in three equal columns

### Requirement: Systems row has three zones: Power Core/Drift, Systems notes, and Cargo/Passengers
The Power Core + Drift Engine inputs, the Systems note-section, and the Cargo/Passengers note-section SHALL be wrapped in a `grid grid-cols-1 sm:grid-cols-3 gap-4` container.

#### Scenario: Systems row stacks on mobile
- **WHEN** the spaceship sheet is viewed at mobile width
- **THEN** Power Core/Drift, Systems, and Cargo/Passengers stack vertically in that order

#### Scenario: Systems row is 3-column from sm+
- **WHEN** the spaceship sheet is viewed at sm+ width (>= 640px)
- **THEN** Power Core/Drift, Systems notes, and Cargo/Passengers render side by side in three equal columns

### Requirement: Critical Damage section spans full width at the bottom
The Critical Damage section SHALL appear below the systems row as a full-width block.

#### Scenario: Critical Damage is full-width
- **WHEN** the spaceship sheet is rendered at any viewport width
- **THEN** the Critical Damage section spans the full container width below all other rows
