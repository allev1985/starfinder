## Why

Today only the GM can create a spaceship for a campaign (gated at 3 UI/route points), even though editing and deleting an *existing* ship is already open to every campaign participant in practice — `SpaceshipEditor`, the delete action, and every `actions.ts` server action check `isCampaignParticipant`, not GM status; only the written `campaign-spaceship` spec still claims non-GM participants are read-only. The user wants any campaign participant (i.e., anyone with a character in the campaign, which is the only way to be a non-GM participant under the current data model) to be able to create a ship too, with full edit rights on any ship thereafter — which matches existing behavior for edit/delete already, so this mostly needs the create-gate removed plus a spec correction.

## What Changes

- **BREAKING** (authorization loosening): any campaign participant (GM or non-GM) SHALL be able to create a new spaceship for the campaign, not just the GM.
- Remove the GM-only gate at `src/app/dashboard/campaigns/[id]/spaceship/new/page.tsx` (currently redirects non-GM away).
- Update `src/app/dashboard/campaigns/[id]/spaceship/page.tsx` to show the create form to any participant instead of only the GM.
- Update `src/app/dashboard/campaigns/[id]/_components/campaign-sidebar.tsx`'s "+ Add ship" link to show for any participant.
- Update `src/app/dashboard/campaigns/[id]/page.tsx`'s empty-state "+ Add ship" link (added in `campaign-starship-empty-state`) to show for any participant.
- Correct the `campaign-spaceship` spec: remove the "Only the DM can create or edit" / "non-DM sees read-only" requirement, since editing was never actually gated in code and creating is no longer gated either.
- No change to `createSpaceshipAction` or any other server action — they already correctly check `isCampaignParticipant`.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `campaign-spaceship`: creating a spaceship is no longer GM-only; the existing "Only the DM can create or edit the spaceship" requirement (which included a non-DM read-only claim never actually implemented) is replaced with a requirement that any campaign participant may create, edit, or delete spaceships.

## Impact

- `src/app/dashboard/campaigns/[id]/spaceship/new/page.tsx`
- `src/app/dashboard/campaigns/[id]/spaceship/page.tsx`
- `src/app/dashboard/campaigns/[id]/_components/campaign-sidebar.tsx`
- `src/app/dashboard/campaigns/[id]/page.tsx`
- No database or server action changes
