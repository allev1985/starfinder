## 1. Design Foundation — Tokens & Fonts

- [x] 1.1 Add Google Fonts to `src/app/layout.tsx`: import `Space_Grotesk` (400 500 600 700), `IBM_Plex_Sans` (400 500 600), `IBM_Plex_Mono` (400 500 600) via `next/font/google`; expose as CSS variables `--font-ui`, `--font-body`, `--font-mono`; remove `Geist` and `Geist_Mono` imports
- [x] 1.2 Rewrite `src/app/globals.css` `:root` block: install all design tokens from `design/README.md` — backgrounds (`--bg`, `--surface`, `--surface-2`), borders (`--border`, `--border-2`), text (`--text-1`, `--text-2`, `--text-3`), chrome (`--chrome`, `--chrome-2`, `--chrome-3`, `--chrome-text`, `--chrome-muted`), accent (`--accent`, `--accent-hover`, `--accent-bright`, `--accent-bg`, `--accent-border`, `--accent-text`), semantic (`--good`, `--good-bg`, `--warn`, `--warn-bg`, `--danger`, `--danger-bg`), radius (`--r-xs` through `--r-xl`), shadow tokens (`--sh-xs` through `--sh-md`)
- [x] 1.3 In `globals.css` `@theme inline` block, remap shadcn token names to design tokens (see `design.md` Aliases table) so existing shadcn components inherit the new palette without per-component changes
- [x] 1.4 Add `[data-dark="true"]` token overrides in `globals.css` matching the dark-mode values in `design/README.md`; also add `.dark` selector overrides for shadcn dark-mode compatibility
- [x] 1.5 Apply font CSS variables in `globals.css` `@layer base`: `html { font-family: var(--font-body) }`, heading elements use `var(--font-ui)`; `code, kbd, pre, .font-mono` use `var(--font-mono)`
- [x] 1.6 Update app metadata in `src/app/layout.tsx`: set `title` to "Starfinder" and remove the default Next.js description
- [x] 1.7 Run `npm run lint` and `npx tsc --noEmit` — fix any errors before proceeding

## 2. Shared Components

- [x] 2.1 Create `src/components/avatar.tsx`: accepts `name: string`, `size?: number` (default 46), `radius?: number` (default 12); derives initials (first char of each word, max 2); derives hue via `[...name].reduce((a,c) => a+c.charCodeAt(0), 0) % 360`; renders `hsl(hue 50% 45%)` bg with white Space Grotesk 600 text at ≈40% of size
- [x] 2.2 Create `src/components/pill.tsx`: variants `dm` (--chrome bg, white, mono 9.5px uppercase), `lv` (--accent-bg, --accent-text, --accent-border), `code` (--surface-2 bg, --border, --text-2, 12px, 0.05em tracking); accepts `children`
- [x] 2.3 Create `src/components/stat-tile.tsx`: props `label: string`, `value: string | number`, `mod?: string`, `dark?: boolean`; light variant uses `--surface-2` bg; dark variant uses `--chrome` bg with white value and `--accent-bright` mod; IBM Plex Mono 9.5px label, Space Grotesk 700 22px value, IBM Plex Mono 12px `--accent` mod
- [x] 2.4 Create `src/components/resource-bar.tsx`: props `label: string`, `color: 'accent'|'good'|'warn'|'danger'`, `current: number`, `max: number`, `onDecrement?: () => void`, `onIncrement?: () => void`, `readOnly?: boolean`; renders dot + name left / "N / N" right; 8px progress bar (99px radius); −/+ buttons with correct semantic colors; transition width 0.3s ease
- [x] 2.5 Create `src/components/accordion-block.tsx`: props `icon: React.ReactNode`, `title: string`, `summary?: string`, `defaultOpen?: boolean`, `children: React.ReactNode`; uses `useState` for open state; caret rotates -90deg when closed (transition 0.2s); body has `border-top: 1px solid --border`; `overflow: hidden` on outer block; `--surface` bg, `--border` border, 12px radius, 11px margin-bottom
- [x] 2.6 Run `npm run lint` and `npx tsc --noEmit`

## 3. Desktop Shell — Top Nav & Sidebar

- [x] 3.1 Rewrite `src/app/dashboard/_components/top-bar.tsx`: 54px height, `--chrome` bg (`bg-[var(--chrome)]`); left = 9px glow-dot (`--accent-bright` color + `box-shadow: 0 0 10px var(--accent-bright)`) + "Starfinder" Space Grotesk 700 16px `--chrome-text`; center = "Campaigns" and "Characters" nav links (active: `--chrome-3` bg, 9px radius, `--chrome-text`; inactive: `--chrome-muted`, hover `--chrome-text`); right = "Sign out" plain link 13px `--chrome-muted`; remove dropdown chevrons; add `hidden md:flex` class so it hides on mobile
- [x] 3.2 Rewrite `src/app/dashboard/campaigns/[id]/_components/campaign-sidebar.tsx`: 240px width, `--surface` bg, `border-right: 1px solid --border`; section labels = IBM Plex Mono 10px uppercase 0.12em tracking `--text-3` with 16px top margin; nav items = 13.5px `--text-2`, 9px radius, 9px 10px padding; active state = `--accent-bg` bg + `--accent-text` color + 600 weight + 7px `--accent` left dot; hover = `--surface-2`; add `hidden md:flex` class for mobile hide
- [x] 3.3 Run `npm run lint` and `npx tsc --noEmit`

## 4. Mobile Shell — AppBar & TabBar

- [x] 4.1 Create `src/components/app-bar-context.tsx`: React context exporting `AppBarContext` with `{ title: string; subtitle?: string; backHref?: string }` state and a `useSetAppBar(config)` hook that pages call to populate the AppBar
- [x] 4.2 Create `src/components/app-bar.tsx`: reads from `AppBarContext`; renders only on mobile (`md:hidden`); `position: fixed`, top 0, full width, 56px height, `--chrome` bg; left = back button (34×34px, `--chrome-3` bg, 9px radius, chevron-left icon, shown only when `backHref` set); center = title (Space Grotesk 700 16px `--chrome-text`) + subtitle (IBM Plex Mono 10px `--chrome-muted` uppercase 0.05em tracking); right = more button (same styling as back button, ellipsis icon)
- [x] 4.3 Create `src/components/tab-bar.tsx`: renders only on mobile (`md:hidden`); `position: fixed`, bottom 0, full width, 68px height + `env(safe-area-inset-bottom)`; `--surface` bg, `border-top: 1px solid --border`; `display: grid; grid-template-columns: repeat(4, 1fr)`; each tab = icon (22×22px) + label (Space Grotesk 700 10px); active = `--accent` color; inactive = `--text-3`; tabs: Campaign (building icon → current campaign `/dashboard/campaigns/[id]` or campaigns list), Characters (users icon → `/dashboard/characters`), Sheet (file icon → active character sheet), Starship (rocket icon → `/dashboard/campaigns/[id]/spaceship/[shipId]`); Starship tab hidden when no campaign context
- [x] 4.4 Update `src/app/dashboard/layout.tsx`: wrap children in `AppBarProvider`; render `<AppBar />` and `<TabBar />`; add `pt-[56px] md:pt-0` (for mobile app bar) and `pb-[68px] md:pb-0` (for tab bar) to the content area
- [x] 4.5 Update `src/app/dashboard/campaigns/[id]/layout.tsx`: pass campaign ID and first spaceship ID into `AppBarProvider` so the TabBar can resolve the Starship tab href
- [x] 4.6 Run `npm run lint` and `npx tsc --noEmit`

## 5. List Pages

- [x] 5.1 Rewrite `src/app/dashboard/campaigns/page.tsx`: page heading "Campaigns" (Space Grotesk 700 24px) + count sub-label (IBM Plex Mono 11px uppercase `--text-3`); "+ New" button top-right (accent filled, sm size); replace divide-y list with flex-col gap-3 list of cards; each card: `--surface` bg, `--border` border, 12px radius, 14px pad, hover border `--accent-border` + `--sh-sm`; flex row gap-13px; Avatar (46×46, 12px radius); meta flex-1: name Space Grotesk 600 15px + DM Pill (if DM) + code Pill (join code); detail `--text-2` 13px; chevron `--text-3`; mobile FAB: fixed, `--accent` bg, 54px circle, bottom: 68px + 14px, right 18px, `+` icon
- [x] 5.2 Rewrite `src/app/dashboard/characters/page.tsx`: same layout and card structure as campaigns; each card: Avatar + name + level Pill + "Race Class · Theme" sub-label; "+ New" button + mobile FAB
- [x] 5.3 Run `npm run lint` and `npx tsc --noEmit`

## 6. Campaign Detail

- [x] 6.1 Rewrite `src/app/dashboard/campaigns/[id]/page.tsx` content area: heading row (campaign name 26px + DM Pill + Edit button right-aligned); sub-label "JOIN CODE:" + code Pill; also call `useSetAppBar({ title: campaign.name, subtitle: 'CAMPAIGN' })` from a client wrapper for mobile AppBar
- [x] 6.2 Add Party section: `divlabel` "PARTY" (IBM Plex Mono 10px uppercase `--text-3`); one PartyCard per character: Avatar (44×44, 12px radius) + name/class text + green HP bar (6px tall `--good` color) + HP fraction (IBM Plex Mono 11px right-aligned); cards are `<Link>` to character sheet; fetch HP data via `getCampaignWithCharacters` which already returns characters (add HP fields to that query if not already present)
- [x] 6.3 Add Starship section: `divlabel` "STARSHIP"; single card: dark Avatar with ship icon + ship name + "Hull N/N · Shields N" summary; link to spaceship page; show only if spaceships exist
- [x] 6.4 Add Encounter section: `divlabel` "ENCOUNTER"; 2-column grid of icon buttons — "Initiative" (dice-5 icon) and "Session notes" (notebook icon); each: `--surface` bg, `--border` border, 12px radius, flex-col, icon `--accent` 22px, Space Grotesk 600 13px label; hover: `--accent-bg` bg; these are non-functional placeholders for now (onClick = noop)
- [x] 6.5 Run `npm run lint` and `npx tsc --noEmit`

## 7. Character Sheet — Sticky Header & Vitals Strip

- [x] 7.1 Create a `CharacterSheetHeader` client component in `src/app/dashboard/characters/[id]/_components/`: renders the sticky header visible on all screen sizes; Avatar (52×52, 14px radius, hashed color); name Space Grotesk 700 21px; "Race · Class · Theme" IBM Plex Mono 11.5px `--text-2`; level badge right-aligned (`--accent-bg` bg, `--accent-border` border, 11px radius, "LEVEL" label 9px mono uppercase + level number Space Grotesk 700 22px `--accent-text`)
- [x] 7.2 Create a `VitalsStrip` client component: 3-column grid using StatTile dark variant — EAC (value from context), KAC (value from context), Initiative (value from context with "DEX" mod label); `border-bottom: 1px solid --border`, 12px padding
- [x] 7.3 Update `character-stats-client.tsx` to render `CharacterSheetHeader` and `VitalsStrip` above the sheet content (always visible, not in an accordion)
- [x] 7.4 Call `useSetAppBar({ title: characterName, subtitle: `LV ${level} · ${className}` })` from within the client component for mobile AppBar
- [x] 7.5 Run `npm run lint` and `npx tsc --noEmit`

## 8. Character Sheet — Mobile Accordion Layout

- [x] 8.1 In `character-stats-client.tsx`, add a responsive branch: mobile renders accordion blocks stacked vertically; desktop renders the existing two-column tab layout (refactored in task 9); use Tailwind `md:hidden` / `hidden md:block` wrappers
- [x] 8.2 Wrap `HealthResolveSection` in `AccordionBlock` (icon: Heart, title: "Health & Resolve", summary: "N/N SP · N/N HP", defaultOpen); restyle internals to use `ResourceBar` components (Stamina = accent, HP = good, Resolve = warn)
- [x] 8.3 Wrap `AbilityScoresSection` in `AccordionBlock` (icon: Zap, title: "Ability Scores", summary: "STR N / DEX N / INT N"); restyle internals: 3×2 grid of AbilityCard — IBM Plex Mono 10px label, `−`/`+` buttons (26×26px, 7px radius, `--surface` bg, `--border` border, `--accent` color), score Space Grotesk 700 24px 36px wide, IBM Plex Mono 13px `--accent` modifier; buttons clamp score 3–20; modifier = `Math.floor((score - 10) / 2)`
- [x] 8.4 Wrap `SkillsSection` in `AccordionBlock` (icon: List, title: "Skills", summary: "N skills"); restyle skill rows: 10px 4px padding, `border-bottom: 1px solid --border` (last-child none); ★ in `--warn` 12px for class skills; name flex-1; ability badge (IBM Plex Mono 10px `--text-3`, `--surface-2` bg, `--border` border, 5px radius, 2px 6px pad); total Space Grotesk 700 16px min-width 42px right-aligned; dice roll button (36×36px, 9px radius, `--border` border, `--surface` bg, `--accent` icon); hover `--accent-bg` + `--accent-border`
- [x] 8.5 Create `src/components/roll-toast.tsx`: fixed, bottom: 80px, left 50%, translateX(-50%); `--chrome` bg, `--chrome-text`, IBM Plex Mono 14px 600; 10px 18px pad, 12px radius, `--sh-md`; `z-index: 200`, `pointer-events: none`; fade+slide-up 0.2s in, auto-dismiss after 1.8s; result value in `--accent-bright`; export `useRollToast()` hook that computes `1d20 + modifier` and shows the toast
- [x] 8.6 Wire dice roll button in each SkillRow to `useRollToast(skillName, total)`: output "Skill: d20 + total = result", plus "· NAT 20! ✦" on 20, "· NAT 1" on 1
- [x] 8.7 Wrap `CombatStatsSection` saving throws sub-section in `AccordionBlock` (icon: Shield, title: "Saving Throws", summary: "Fort +N / Ref +N / Will +N"); restyle to 3-column StatTile grid (Fort/Ref/Will with ability mod labels)
- [x] 8.8 Wrap attack bonuses sub-section in `AccordionBlock` (icon: Crosshair, title: "Attack Bonuses", summary: "BAB +N"); restyle to BAB field + 3-column StatTile grid (Melee/Ranged/Thrown with formula labels)
- [x] 8.9 Wrap weapons list in `AccordionBlock` (icon: Sword, title: "Weapons & Gear", summary: "N items" or "empty"); retain existing `WeaponCard` components inside
- [x] 8.10 Wrap `SpellsSection` in `AccordionBlock` (icon: Sparkles, title: "Spells", summary: "—" or spell count); retain existing spells internals inside
- [x] 8.11 Wrap `DescriptionSection` in `AccordionBlock` (icon: User, title: "Description"); restyle internals to 2-column field grid (Size, Walking Speed, Home World, Gender, Deity, Alignment)
- [x] 8.12 Run `npm run lint` and `npx tsc --noEmit`

## 9. Character Sheet — Desktop Two-Column Layout

- [x] 9.1 Refactor the desktop branch of `character-stats-client.tsx`: replace shadcn `<Tabs>` with pill-style sub-tabs — `--surface-2` bg container, 4px padding, 11px radius; each trigger: Space Grotesk 600 13px; active: `--surface` bg, `--sh-xs`; inactive: transparent, hover `--surface`
- [x] 9.2 Stats tab: left col (1.1fr) = Ability Scores block + Skills block; right col (1fr) = Health & Resolve block + Saving Throws block + Attack Bonuses block + Weapons block — all using the same AccordionBlock wrapper (defaultOpen on desktop) and redesigned internals from task 8
- [x] 9.3 Abilities & Gear tab: left = Weapons & Gear, Class Features, Theme Features, Feats, Languages; right = Credits & XP, Armor Inventory, Equipment Inventory — retain existing section components, apply AccordionBlock wrappers
- [x] 9.4 Spells tab: SpellsSection full-width, max-width 600px centered
- [x] 9.5 Run `npm run lint` and `npx tsc --noEmit`

## 10. Starship Sheet

- [x] 10.1 Update `src/app/dashboard/campaigns/[id]/spaceship/[shipId]/page.tsx` to call `useSetAppBar({ title: spaceship.name, subtitle: `TIER ${spaceship.tier} · ${campaignName}` })` via a client wrapper
- [x] 10.2 Extract shield state from `_name-editor.tsx` and build the Shield Diagram component (always visible, not in accordion): "Forward" label + value + `−`/`+` stepper centered above a 3-col grid; Port arc | Ship core (dark, ship icon, Shields N/N total) | Starboard arc; "Aft" below; arc panels: `--surface-2` bg, `--border` border, 11px radius; shield values Space Grotesk 700 20px `--accent`; steppers clamp 0..max; core: `--chrome` bg, 14px radius
- [x] 10.3 Wrap Hull & Defenses in `AccordionBlock` (defaultOpen): AC + TL as dark StatTile 2-col grid; Hull Points `ResourceBar` (`--danger` color); Damage Threshold and Critical Threshold as 2-col input fields; wire to existing `updateSpaceshipAction`
- [x] 10.4 Wrap Weapons in `AccordionBlock` (icon: Crosshair, title: "Weapons"): 5 arc sections (Forward/Port/Starboard/Aft/Turret); each arc shows existing weapon cards + "Add weapon" button; retain existing `createWeaponAction` / `deleteWeaponAction` wiring
- [x] 10.5 Wrap Critical Damage in `AccordionBlock` (icon: AlertTriangle, title: "Critical Damage"): 5 system rows — Life Support / Sensors / Engines / Power Core / Weapons Array; each row has 3 toggle buttons: Glitching (`--warn` colors) / Malfunc. (orange `#ea580c`) / Wrecked (`--danger`); clicking active state clears it; wire to `updateSpaceshipAction` via debounced save; retain existing `DamageStatus` logic, restyle buttons
- [x] 10.6 Wrap Crew & Roles in `AccordionBlock` (icon: Users, title: "Crew & Roles"): Captain / Pilot / Engineers / Gunners / Science Officers as crew rows (matching SkillRow style with user icon instead of dice); retain `CrewSection` internals, apply new styling
- [x] 10.7 Wrap Ship Specs in `AccordionBlock` (icon: Settings, title: "Ship Specs"): 2-col field grid (Name, Tier, Speed, Maneuverability, Drift Rating, Power Core); retain existing input wiring
- [x] 10.8 Desktop 3-column grid: Col 1 = Shields + Hull & Defenses; Col 2 = Weapons; Col 3 = Critical Damage + Crew; Ship Specs below all 3 columns full-width
- [x] 10.9 Run `npm run lint` and `npx tsc --noEmit`

## 11. Final Polish & Verification

- [x] 11.1 Audit every page for leftover `bg-background`, `text-foreground`, `border-border` Tailwind classes that conflict with the new token mapping — replace with explicit design-token classes or verify they resolve correctly via the alias
- [x] 11.2 Verify dark mode: toggle `data-dark="true"` on `<html>` in browser DevTools and confirm all surfaces, text, and accent colors flip correctly
- [x] 11.3 Verify responsive breakpoint at exactly 768px: top nav hidden and AppBar + TabBar shown on mobile; sidebar hidden on mobile; no layout overlap at the breakpoint
- [x] 11.4 Verify character sheet: accordion open/close animations smooth; dice roll toast appears and auto-dismisses; ability score −/+ buttons update modifier live
- [x] 11.5 Verify starship sheet: shield arc steppers clamp correctly; critical damage toggle buttons cycle and clear correctly
- [x] 11.6 Verify list pages: avatar initials and hashed colors render; pills render; hover states work
- [x] 11.7 Run final `npm run lint` and `npx tsc --noEmit` — zero errors required before marking complete
