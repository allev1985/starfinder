## Context

The campaigns page is a stub. The schema has `campaigns`, `characters`, and `campaign_characters`. The queries layer has `getCampaignsByDm` but nothing for player membership. The service layer has `createCampaignForUser` but no list function.

## Goals / Non-Goals

**Goals:**
- Query campaigns where `dm_id = userId` (DM role)
- Query campaigns where a character with `owner_id = userId` appears in `campaign_characters` (player role)
- Merge and deduplicate in the service layer; attach a `role` label
- Render the list as a server component

**Non-Goals:**
- Campaign detail page (links are placeholders)
- Sorting or filtering
- Pagination
- Empty-state illustration (a plain text message is enough)

## Decisions

### 1. Two queries merged in the service layer (not a SQL UNION)

`getCampaignsForUser` in queries returns both sets separately. The service merges them with a `Map` keyed by `campaign.id`, preferring `'dm'` over `'player'` on collision.

**Why not a single UNION query**: Drizzle's support for `UNION` requires raw SQL or `sql` template tags, which undermines type safety. Two typed selects merged in TS is cleaner, equally fast at this scale, and stays within Drizzle's typed API.

### 2. Role label attached in the service, not the query

The query layer returns plain `Campaign[]`. The service layer produces `CampaignWithRole[]` — a typed intersection of `Campaign & { role: 'dm' | 'player' }`. This keeps the data layer free of presentation concerns.

### 3. Page is a server component

`campaigns/page.tsx` reads the auth user server-side via `createClient()`, calls the service, and renders the list. No client-side state needed for a read-only list. The `"use client"` directive is absent.

### 4. Campaign detail link is a placeholder

Each row links to `/dashboard/campaigns/[id]` which doesn't exist yet. Next.js renders a 404 on click — acceptable until the detail page is built.

## Risks / Trade-offs

- **Player-role query does a join across two tables** → Fine at this scale; index on `characters.owner_id` and `campaign_characters.character_id` would help at scale but are not needed now.
- **DM who also has a character in their own campaign shows once as DM** → Correct behaviour; dedup prefers `'dm'`.
