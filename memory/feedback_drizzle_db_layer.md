---
name: drizzle-db-layer-only
description: Drizzle (db client, drizzle-orm, schema imports) must never appear outside src/db/queries/. All other layers call query functions.
metadata:
  type: feedback
---

Drizzle ORM (`db`, `drizzle-orm` imports, schema table refs) is strictly confined to `src/db/queries/`. No other file — services, authorization utils, lib helpers, server actions — may import from `@/db` or `drizzle-orm` directly.

**Why:** User enforces a hard data-layer boundary. When `authorization.ts` was found to contain Drizzle imports, they called it out immediately.

**How to apply:** If a service, util, or action needs a DB check, add a query function in `src/db/queries/` and call that. Boolean existence checks (e.g. `checkIsCampaignDm`) belong in the queries layer alongside data-fetching functions.
