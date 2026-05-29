## ADDED Requirements

### Requirement: Edit and Delete controls on campaign detail page
The campaign detail page SHALL display Edit and Delete buttons visible only to the DM.

#### Scenario: DM sees Edit and Delete buttons
- **WHEN** the DM views the campaign detail page
- **THEN** an Edit button linking to `/dashboard/campaigns/[id]/edit` and a Delete button are displayed

#### Scenario: Non-DM does not see Edit or Delete buttons
- **WHEN** a player views the campaign detail page
- **THEN** no Edit or Delete controls are rendered

### Requirement: Delete confirmation dialog
The Delete button on the campaign detail page SHALL trigger an AlertDialog asking the DM to confirm before the deletion proceeds.

#### Scenario: Confirmation required before delete
- **WHEN** the DM clicks the Delete button
- **THEN** an AlertDialog is shown with a confirm and cancel option before any data is changed
