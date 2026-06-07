## 1. Prerequisites

- [x] 1.1 Run `npx shadcn@latest add table` to install the Table component
- [x] 1.2 Run `npx shadcn@latest add select` to install the Select component

## 2. Shared Admin Infrastructure

- [x] 2.1 Update `src/app/dashboard/page.tsx` to call `getUser`/`isAdmin` and conditionally render an Admin tile linking to `/dashboard/admin`
- [x] 2.2 Replace the stub at `src/app/dashboard/admin/page.tsx` with a tile grid containing a "Manage Data" tile linking to `/dashboard/admin/data`
- [x] 2.3 Create `src/app/dashboard/admin/data/[editionSlug]/_components/data-table.tsx` — generic data-table wrapper (thead/tbody, empty state slot)
- [x] 2.4 Create `src/app/dashboard/admin/data/[editionSlug]/_components/entity-modal.tsx` — generic Dialog scaffold for add/edit forms
- [x] 2.5 Create `src/app/dashboard/admin/data/[editionSlug]/_components/confirm-delete-dialog.tsx` — AlertDialog for delete confirmation
- [x] 2.6 Create `src/app/dashboard/admin/data/[editionSlug]/_components/expandable-row.tsx` — table row with expand chevron and inline panel slot
- [x] 2.7 Create `src/app/dashboard/admin/data/[editionSlug]/_components/breadcrumb.tsx` — breadcrumb component rendering Admin › Manage Data › [Edition] › [Category]

## 3. Edition Management

- [x] 3.1 Create `src/db/queries/admin-editions.ts` with `listEditions`, `createEdition` server actions
- [x] 3.2 Create `src/app/dashboard/admin/data/page.tsx` — edition list page with edition cards and "Add Edition" dialog (name + slug fields, duplicate-slug error handling)

## 4. Edition Data Navigation

- [x] 4.1 Create `src/app/dashboard/admin/data/[editionSlug]/page.tsx` — category grid (10 tiles: Races, Classes, Themes, Skills, Armor, Weapons, Equipment, Spells, Feats, Chassis); returns 404 for unknown slugs

## 5. Races

- [x] 5.1 Create `src/db/queries/admin-races.ts` with `listRaces`, `createRace`, `updateRace`, `deleteRace` server actions (all edition-scoped)
- [x] 5.2 Create `src/app/dashboard/admin/data/[editionSlug]/races/page.tsx` — races data table with add/edit/delete modal and confirm-delete dialog

## 6. Skills

- [x] 6.1 Create `src/db/queries/admin-skills.ts` with `listSkills`, `createSkill`, `updateSkill`, `deleteSkill` server actions
- [x] 6.2 Create `src/app/dashboard/admin/data/[editionSlug]/skills/page.tsx` — skills data table; delete action shows error if skill is referenced

## 7. Classes

- [x] 7.1 Create `src/db/queries/admin-classes.ts` with `listClasses`, `createClass`, `updateClass`, `deleteClass`, `listClassSkills`, `setClassSkill`, `listClassAbilities`, `createClassAbility`, `updateClassAbility`, `deleteClassAbility`, `listClassProficiencies`, `setClassArmorProficiency`, `setClassWeaponProficiency` server actions
- [x] 7.2 Create `src/app/dashboard/admin/data/[editionSlug]/classes/page.tsx` — classes data table with add/edit/delete modal
- [x] 7.3 Add expandable row to the classes table that renders a Tabs panel
- [x] 7.4 Implement Skills tab: checkbox grid over all edition skills; toggle calls `setClassSkill`
- [x] 7.5 Implement Abilities tab: inline add/edit/delete table of `classAbilities` with choicePool free-text field
- [x] 7.6 Implement Proficiencies tab: two checkbox groups (Armor: light/heavy/powered; Weapons: all weaponCategory values); toggle calls respective set actions

## 8. Themes

- [x] 8.1 Create `src/db/queries/admin-themes.ts` with `listThemes`, `createTheme`, `updateTheme`, `deleteTheme`, `listThemeAbilities`, `createThemeAbility`, `updateThemeAbility`, `deleteThemeAbility` server actions
- [x] 8.2 Create `src/app/dashboard/admin/data/[editionSlug]/themes/page.tsx` — themes data table with add/edit/delete modal
- [x] 8.3 Add expandable row for theme abilities: inline add/edit/delete list (name, description, level)

## 9. Armor

- [x] 9.1 Create `src/db/queries/admin-armor.ts` with `listArmor`, `createArmor`, `updateArmor`, `deleteArmor` server actions
- [x] 9.2 Create `src/app/dashboard/admin/data/[editionSlug]/armor/page.tsx` — armor data table with full add/edit modal (required + optional field sections)

## 10. Weapons

- [x] 10.1 Create `src/db/queries/admin-weapons.ts` with `listWeapons`, `createWeapon`, `updateWeapon`, `deleteWeapon` server actions
- [x] 10.2 Create `src/app/dashboard/admin/data/[editionSlug]/weapons/page.tsx` — weapons data table with add/edit modal

## 11. Equipment

- [x] 11.1 Create `src/db/queries/admin-equipment.ts` with `listEquipment`, `createEquipment`, `updateEquipment`, `deleteEquipment` server actions
- [x] 11.2 Create `src/app/dashboard/admin/data/[editionSlug]/equipment/page.tsx` — equipment data table with add/edit modal; System field shown conditionally for augmentation categories

## 12. Spells

- [x] 12.1 Create `src/db/queries/admin-spells.ts` with `listSpells`, `createSpell`, `updateSpell`, `deleteSpell`, `listSpellClasses`, `setSpellClass` server actions
- [x] 12.2 Create `src/app/dashboard/admin/data/[editionSlug]/spells/page.tsx` — spells data table with add/edit modal
- [x] 12.3 Add expandable row for class assignments: checkbox grid over all edition classes; toggle calls `setSpellClass`

## 13. Feats

- [x] 13.1 Create `src/db/queries/admin-feats.ts` with `listFeats`, `createFeat`, `updateFeat`, `deleteFeat` server actions; creation enforces unique name constraint
- [x] 13.2 Create `src/app/dashboard/admin/data/[editionSlug]/feats/page.tsx` — feats data table with add/edit modal; duplicate-name error surfaced in dialog

## 14. Chassis

- [x] 14.1 Create `src/db/queries/admin-chassis.ts` with `listChassis`, `createChassis`, `updateChassis`, `deleteChassis` server actions; delete checks for character references
- [x] 14.2 Create `src/app/dashboard/admin/data/[editionSlug]/chassis/page.tsx` — chassis data table with add/edit modal (name, bonus skill select, ability score defaults)

## 15. Lint & Type-check

- [x] 15.1 Run `npm run lint` and fix all errors
- [x] 15.2 Run `npx tsc --noEmit` and fix all type errors
