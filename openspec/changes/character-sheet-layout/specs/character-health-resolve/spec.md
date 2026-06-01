## MODIFIED Requirements

### Requirement: Health & Resolve section on character sheet
The character detail page SHALL render a **Health & Resolve** section within the Stats tab, in the right column, positioned below Initiative and above Armor Class. Each pool SHALL show a **Total** column and a **Current** column.

#### Scenario: Section visible in Stats tab right column
- **WHEN** the Stats tab is active
- **THEN** the Health & Resolve section is visible in the right column between Initiative and Armor Class

#### Scenario: Three-row layout
- **WHEN** the Health & Resolve section renders
- **THEN** it shows three rows: Stamina Points, Hit Points, and Resolve Points — each with a Total value and a Current value

#### Scenario: Android shows only Hit Points
- **WHEN** the character race type is "drone"
- **THEN** only the Hit Points row is rendered; Stamina Points and Resolve Points rows are hidden
