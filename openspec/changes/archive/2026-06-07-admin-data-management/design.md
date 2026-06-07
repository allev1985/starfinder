## Context

The admin section exists (`/dashboard/admin`) but renders only a stub. The database already has all edition-scoped reference tables (races, classes, themes, skills, armor, weapons, equipment, spells, feats, chassis) — no schema changes are needed. The admin layout guard (`isAdmin()`) is already in place. All CRUD will be wired through Next.js Server Actions, consistent with the rest of the app.

Two shadcn/ui components are not yet installed — `Table` and `Select` — and must be added before implementation begins.

## Goals / Non-Goals

**Goals:**
- Admin can pick an edition and manage all character reference data from a UI
- All mutations (create, update, delete) happen via Server Actions with `revalidatePath`
- Sub-data (class skills, class abilities, class proficiencies, theme abilities, spell-class assignments) is managed inline without leaving the parent page
- Pattern is consistent across all 10 entity types — one shared data-table layout, one shared modal scaffold

**Non-Goals:**
- Spaceship reference data (no reference tables exist; deferred)
- Bulk import / CSV upload
- Audit logging of admin changes
- Role management UI (admins are assigned via Supabase app_metadata directly)

## Decisions

### 1. URL shape: edition slug as route segment

`/dashboard/admin/data/[editionSlug]/<category>`

**Why**: Keeps the edition always visible in the URL, enables direct links to a specific edition's data, and matches the existing pattern of slug-based routing in the app. A session/cookie-stored edition context was considered but rejected — it breaks on direct links and makes the URL ambiguous.

### 2. CRUD via Server Actions only (no API routes)

All mutations use `"use server"` functions called from client components. `revalidatePath` flushes the server-rendered list after each mutation.

**Why**: Consistent with how all other mutations in the app work (campaigns, characters, spaceships). Adding a separate REST layer would be over-engineering for an admin-only surface.

### 3. Data table + inline Dialog modal for all CRUD

Each category page renders:
- A plain HTML `<table>` styled with the shadcn `Table` component
- An "Add" button that opens a shadcn `Dialog` with the create form
- Row-level Edit (opens same `Dialog` pre-filled) and Delete (opens `AlertDialog` for confirmation)

**Why**: shadcn `Table` and `Dialog` already match the design system. A full-page edit route per entity would be excessive for simple reference data.

### 4. Inline sub-data via expandable row + Tabs

For classes, themes, and spells, clicking a chevron on the table row reveals an inline expansion panel containing shadcn `Tabs`. Each tab manages a junction or child table for that specific parent row.

```
Class row → [expand chevron]
  └─ Tabs: [Skills] [Abilities] [Proficiencies]
             │           │            │
             junction    child        junction
             add/remove  CRUD         checkbox grid
```

For class skills: checkbox grid over all skills for that edition — checked = class skill.
For class armor/weapon proficiency: checkbox grid over enum values.
For class abilities: add/edit/delete table of `classAbilities` rows; each ability optionally opens a further inline editor for `classAbilityOptions`.
For theme abilities: same as class abilities but simpler (no options).
For spell class assignments: multi-select checkboxes over all classes for that edition.

**Why**: A drill-down sub-route would require URL nesting and back-navigation. Given the density is manageable (skills list < 25 items, proficiencies < 10 enum values), inline is faster to use and simpler to implement.

### 5. New shadcn components required

`npx shadcn@latest add table` and `npx shadcn@latest add select` must be run before any page work starts. `Select` is needed for enum fields (armorType, weaponCategory, equipmentCategory, raceType, spellSchool, augmentationSystem).

### 6. Shared `_components/` inside the admin data route

All reusable pieces (data-table wrapper, entity-modal scaffold, expandable-row, confirm-delete dialog) live at:

`src/app/dashboard/admin/data/[editionSlug]/_components/`

Each category page imports from this directory rather than each defining its own table/modal boilerplate.

### 7. Edition creation — slug must be user-supplied

The `editions` table has `slug` (unique) and `name`. The admin supplies both on creation. No auto-slugging from name — slugs are used in URLs and must be stable.

## Risks / Trade-offs

- **Large forms for weapons/armor/equipment** → Many nullable fields. Use optional sections / collapsible fieldsets in the modal to avoid overwhelming admins. Keep required fields at the top.
- **classAbilityOptions nesting depth** → Two levels of inline expansion (class row → abilities tab → options inline). If this feels cramped, options can be a small inline table within the abilities tab. Stick to this until UX proves otherwise.
- **No optimistic updates** → Server Actions + `revalidatePath` means a round-trip on every save. Fine for low-traffic admin UI, but adds perceived latency. Accept this trade-off.
- **Edition delete not included** → Deleting an edition would cascade-delete all reference data. This is intentionally excluded from scope; an edition is effectively immutable once created.

## Migration Plan

No database migrations needed. All reference tables already exist. Implementation is purely additive (new pages, server actions, components).

Deployment: merge to main, no special rollout steps. The admin route is protected by the existing `isAdmin()` layout guard.

## Open Questions

- Should the admin category nav show row counts per category (e.g. "Races (12)")? Adds one extra query per category per page load. Deferred — can add after initial implementation.
- `classAbilityOptions` — the `choicePool` field on `classAbilities` is a text field. Does it need a structured editor or is free text acceptable for now? Assume free text.
