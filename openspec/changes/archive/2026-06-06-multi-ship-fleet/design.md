## Context

Currently a campaign has exactly one spaceship enforced by a `UNIQUE` constraint on `spaceships.campaign_id`. The entire UI is built around this assumption: the sidebar has a single "Spaceship" link, the route is `/campaigns/[id]/spaceship`, and the layout fetches `Spaceship | null`.

The character system already implements the correct pattern for one-to-many within a campaign: sidebar lists each character by name, each links to `/campaigns/[id]/characters/[characterId]`. This design mirrors that pattern exactly.

## Goals / Non-Goals

**Goals:**
- Support any number of ships per campaign (fleet, main + shuttle, etc.)
- Mirror the character navigation pattern in the sidebar
- Move the editor to a ship-specific URL so each ship is bookmarkable
- Keep crew assignments per-ship and non-exclusive (a character may crew multiple ships)
- Zero breaking changes to child tables (`spaceship_weapons`, `spaceship_notes`, `spaceship_crew`)

**Non-Goals:**
- A "primary" or "active" ship concept — all ships are equal peers
- Crew exclusivity enforcement — the sheet tracks assignments; the GM resolves conflicts situationally
- A dedicated fleet overview/comparison page — sidebar is sufficient for navigation

## Decisions

### Decision: Mirror the character route pattern
`/campaigns/[id]/spaceship/[shipId]` for the editor, `/campaigns/[id]/spaceship` as landing.

**Rationale:** The pattern is already proven and familiar within this codebase. Alternatives considered:
- Keep `/campaigns/[id]/spaceship` as the editor with a ship picker — adds state management complexity and loses bookmarkability.
- Flat list on the root page only — works but the sidebar already serves that purpose better.

### Decision: `/spaceship` root redirects to first ship, or shows empty state
When ships exist, redirect to the first ship's URL. When none exist, show the existing create form (moved from the current page).

**Rationale:** Avoids an empty landing page when ships exist. Users coming from an old URL or clicking "Spaceship" in a nav always land somewhere useful.

### Decision: Sidebar "Spaceship" becomes a section header listing ships individually
Each ship appears as a named link (like characters), with an "+ Add ship" entry at the bottom.

**Rationale:** Consistent with the Characters section. The ship name alone is sufficient — no tier/size in the sidebar (keeps it clean; details are on the sheet).

### Decision: `getSpaceshipByCampaign` is replaced, not overloaded
Rename to `getSpaceshipsByCampaign` returning `Spaceship[]`. Any callers that need a single ship use `getSpaceshipById`.

**Rationale:** A query returning `Spaceship | null` alongside one returning `Spaceship[]` from the same campaign ID would be confusing. Clean break is better.

### Decision: Crew assignments remain non-exclusive
A character may appear on multiple ships' crew lists simultaneously. No application-layer enforcement.

**Rationale:** Fleet gameplay is situational. Enforcing exclusivity adds complexity and UI friction for a constraint the ruleset doesn't strictly require at the sheet level.

## Risks / Trade-offs

- **Redirect on `/spaceship` root depends on fetch order** → Mitigation: sort ships by `created_at` ascending so the redirect target is deterministic.
- **Layout fetches ship list on every request** → Acceptable: campaign sessions typically have 2-5 ships; no pagination needed.
- **Dropping a DB constraint is irreversible without another migration** → Mitigation: document in migration that uniqueness is intentionally relaxed; if ever needed again, a new migration adds it back.

## Migration Plan

1. Write a Supabase migration that executes:
   ```sql
   ALTER TABLE spaceships DROP CONSTRAINT spaceships_campaign_id_unique;
   ```
2. Apply migration via `mcp__claude_ai_Supabase__apply_migration` (or `supabase db push` locally).
3. Remove `.unique()` from the Drizzle schema — no data loss, purely dropping a constraint.
4. Deploy app changes. The layout and sidebar update atomically with the route restructure.

**Rollback:** If needed, a new migration can re-add the constraint — but only if no campaign already has more than one ship. Check first with:
```sql
SELECT campaign_id, COUNT(*) FROM spaceships GROUP BY campaign_id HAVING COUNT(*) > 1;
```

## Open Questions

- None — design is fully resolved from exploration session.
