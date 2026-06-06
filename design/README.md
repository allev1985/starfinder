# Handoff: Starfinder Campaign Manager — Mobile-Responsive Redesign

## Overview
A complete visual and UX redesign of an existing Next.js Starfinder TTRPG companion app. The app manages campaigns, characters, and starships. The redesign adds full mobile responsiveness, a modern clean aesthetic with a sci-fi accent, and a new information architecture optimised for use at the table (phone in hand).

## About the Design Files
The files in this bundle (`Starfinder App (Standalone).html` and `Starfinder Wireframes (Standalone).html`) are **HTML design prototypes** — they demonstrate the intended look, layout, information hierarchy, and key interactions. They are **not** production code to copy directly.

Your task is to **recreate these designs inside the existing Next.js codebase**, using its established patterns (components, routing, data fetching, state management). Match the visual output as closely as possible; adapt the implementation to Next.js conventions.

## Fidelity
**High-fidelity.** The prototype (`Starfinder App (Standalone).html`) shows final colors, typography, spacing, component structure, and interactions. Recreate it pixel-closely. The wireframe file is reference only — the app prototype is the authoritative design.

---

## Design Tokens

### Colors
```css
/* Backgrounds */
--bg:         #f3f6fb;       /* page background */
--surface:    #ffffff;       /* card / panel surface */
--surface-2:  #f7f9fc;       /* secondary surface, input fills */
--border:     #e1e7f0;       /* default border */
--border-2:   #ccd3e2;       /* stronger border */

/* Text */
--text-1:     #0a1220;       /* primary text */
--text-2:     #505f74;       /* secondary / muted */
--text-3:     #8c97a8;       /* placeholder / disabled */

/* App chrome (nav bars, sidebar header) */
--chrome:     #0a1220;       /* dark navy */
--chrome-2:   #141e31;
--chrome-3:   #1d2c43;
--chrome-text:#dce8f6;       /* text on chrome */
--chrome-muted:#6a82a0;      /* muted text on chrome */

/* Accent — cyan */
--accent:        oklch(54% 0.16 215);   /* ≈ #0891b2 */
--accent-hover:  oklch(48% 0.16 215);
--accent-bright: oklch(78% 0.14 215);   /* ≈ #22d3ee  (glow dot, bar fills) */
--accent-bg:     oklch(97% 0.04 215);   /* ≈ #f0fcff  (badge background) */
--accent-border: oklch(88% 0.08 215);   /* ≈ #baeaf5 */
--accent-text:   oklch(38% 0.14 215);   /* ≈ #0c5f77  (text on accent-bg) */

/* Semantic */
--good:       #059669;       /* HP bars, positive */
--good-bg:    #ecfdf5;
--warn:       #d97706;       /* Resolve points, class-skill stars */
--warn-bg:    #fffbeb;
--danger:     #dc2626;       /* Hull HP, delete actions */
--danger-bg:  #fef2f2;
```

### Dark mode
Apply `data-dark="true"` on `<html>`. Override tokens:
```css
--bg: #060f1c;  --surface: #0c1826;  --surface-2: #101f31;
--border: #1b2b40;  --border-2: #243550;
--text-1: #dce8f6;  --text-2: #7a90aa;  --text-3: #475c72;
--accent-bg: #071a26;  --accent-border: #0b4a63;  --accent-text: #5fd8f0;
```

### Typography
```
Font families:
  --fn-ui:   'Space Grotesk'   — headings, nav, labels, buttons, numbers
  --fn-body: 'IBM Plex Sans'   — body copy, descriptions
  --fn-mono: 'IBM Plex Mono'   — stat labels, badges, monospaced values, join codes

Google Fonts import:
  Space Grotesk: 400 500 600 700
  IBM Plex Sans: 400 500 600
  IBM Plex Mono: 400 500 600
```

### Spacing & Radius
```
Border radius:
  --r-xs: 5px   --r-sm: 9px   --r: 12px   --r-lg: 16px   --r-xl: 22px

Shadows:
  --sh-xs: 0 1px 2px rgba(10,18,32,.05)
  --sh-sm: 0 1px 3px rgba(10,18,32,.08), 0 1px 2px rgba(10,18,32,.04)
  --sh:    0 4px 12px rgba(10,18,32,.06), 0 1px 3px rgba(10,18,32,.04)
  --sh-md: 0 8px 28px rgba(10,18,32,.09), 0 2px 6px rgba(10,18,32,.04)
```

### Layout dimensions
```
Desktop sidebar width:  240px
Desktop top nav height: 54px
Mobile bottom tab bar:  68px (+ env(safe-area-inset-bottom))
Responsive breakpoint:  768px  (below = mobile layout, above = desktop)
```

---

## Screens / Views

### 1. App Shell (all pages)

**Mobile layout** (< 768px):
- `position: fixed` or sticky top: dark `AppBar` (56px, `--chrome` bg)
  - Left: back button (icon only, 34×34px, `--chrome-3` bg, 9px radius) — shown on detail pages
  - Center: page title in Space Grotesk 700 16px `--chrome-text`, with a sub-label in IBM Plex Mono 10px `--chrome-muted` uppercase 0.05em tracking
  - Right: more (…) icon button (same styling as back button)
- Bottom: `TabBar` (4 tabs: Campaign · Characters · Sheet · Starship)
  - Background: `--surface`, `border-top: 1px solid --border`
  - Each tab: icon (22×22px SVG) + label (Space Grotesk 700 10px)
  - Active: `--accent` color. Inactive: `--text-3`
  - Grid: `repeat(4, 1fr)`

**Desktop layout** (≥ 768px):
- Top nav bar (54px, `--chrome` bg, full width):
  - Left: brand mark — cyan glow dot (9px circle, `--accent-bright` with `box-shadow: 0 0 10px var(--accent-bright)`) + "Starfinder" in Space Grotesk 700 16px `--chrome-text`
  - Center nav links: "Campaigns" and "Characters". Active state: `--chrome-3` bg, 9px radius, `--chrome-text`. Inactive: `--chrome-muted`, hover `--chrome-text`
  - Right: "Sign out" link, Space Grotesk 13px `--chrome-muted`
- Left sidebar (240px, `--surface` bg, `border-right: 1px solid --border`):
  - Section labels: IBM Plex Mono 10px uppercase 0.12em tracking, `--text-3`, 16px top margin
  - Nav items: 13.5px `--text-2`, 9px radius, 9px 10px padding. Active: `--accent-bg` bg, `--accent-text` color, 600 weight, with a 7px `--accent` dot. Hover: `--surface-2`
- Content area: fills remaining space, `overflow-y: auto`
- No bottom tab bar on desktop

---

### 2. Campaigns List

**Route:** `/campaigns`

**Content:**
- Page heading "Campaigns" (Space Grotesk 700 24px) + count sub-label (IBM Plex Mono 11px uppercase `--text-3`)
- "+ New" button (top right): accent filled, sm size
- List of campaign cards (see **List Card** component)
  - Avatar: 2-letter initials, color derived from campaign name (use HSL hue from string hash, 50% sat, 45% lgt)
  - Primary: campaign name + DM pill (if DM)
  - Secondary: join code as a `pill.code` badge
- FAB (mobile only): fixed, `--accent` bg, 54px circle, bottom: tabbar-height + 14px, right: 18px

---

### 3. Characters List

**Route:** `/characters`

Same layout as Campaigns List. Each card:
- Avatar: initials + hashed color
- Primary: character name + level pill (`pill.lv`)
- Secondary: "Race Class · Theme"

---

### 4. Campaign Detail / Party View

**Route:** `/campaigns/[id]`

**Desktop sidebar** shows: Campaign → Characters → Starship nav items.

**Content:**
- Heading row: campaign name (26px) + DM pill + Edit button (right)
- Sub-label: "JOIN CODE:" label + `pill.code` badge with the code
- **Party section** (`divlabel` "Party"):
  - One `PartyCard` per character: avatar (44px, 12px radius) + name/class + green HP bar (6px tall) + HP fraction (right-aligned, IBM Plex Mono 11px)
  - Clicking a party card navigates to that character's sheet
- **Starship section** (`divlabel` "Starship"):
  - Single card: dark avatar with ship icon + ship name + hull/shields summary
- **Encounter section** (`divlabel` "Encounter"):
  - 2-column grid of icon buttons: "Initiative" (dice icon) and "Session notes" (note icon)
  - Each: `--surface` bg, `--border` border, 12px radius, flex column, icon in `--accent`, Space Grotesk 600 13px label, hover: `--accent-bg` bg

---

### 5. Character Sheet

**Route:** `/campaigns/[id]/characters/[charId]` (and `/characters/[charId]` standalone)

#### Mobile layout

**Sticky header area** (not scrolling):
- `AppBar`: name + "LV N · CLASSNAME" sub
- **Character header** (16px pad):
  - Avatar: 52×52px, 14px radius, initials, hashed color
  - Name: Space Grotesk 700 21px
  - Sub: "Race · Class · Theme" IBM Plex Mono 11.5px `--text-2`
  - Level badge (right): `--accent-bg` bg, `--accent-border` border, 11px radius — "LEVEL" label (9px mono uppercase) + level number (Space Grotesk 700 22px `--accent-text`)
- **Vitals strip** (12px pad, `border-bottom: 1px solid --border`):
  - 3-column stat grid: EAC (dark tile) · KAC (dark tile) · Initiative (light tile with "DEX" mod label)

**Scrollable body** (accordion blocks, 8px 14px 16px padding):

Each accordion `Block`:
- Header: `--surface` bg, hover `--surface-2`, 13px 15px padding
  - Icon (16×16, `--accent`), title (Space Grotesk 600 12.5px uppercase 0.05em tracking), summary text (IBM Plex Mono 12px `--text-3`), caret icon (rotates -90° when closed)
  - `border-top: 1px solid --border` on body
- Body: 6px 15px 16px padding

**Accordion sections (in order):**

1. **Health & Resolve** — open by default
   - Summary: "N/N SP · N/N HP"
   - Content: 3 `ResourceBar` components (Stamina=accent, HP=good, Resolve=warn)

2. **Ability Scores**
   - Summary: "STR N / DEX N / INT N"
   - Content: 3×2 grid of `AbilityCard`:
     - IBM Plex Mono 10px uppercase label
     - Row: `−` button (26×26px, 7px radius, `--surface` bg, `--border` border, `--accent` color) + score (Space Grotesk 700 24px, 36px wide) + `+` button
     - IBM Plex Mono 13px `--accent` modifier below (e.g. "+2")
     - Buttons call `Math.floor((score - 10) / 2)` to recalculate modifier live

3. **Skills**
   - Summary: "N skills"
   - Content: skill rows (see `SkillRow` component)
   - Class skills with ranks get +3 class skill bonus
   - ★ marker on class-skill-for-this-class skills (Perception, Piloting for Technomancer)

4. **Saving Throws**
   - Summary: "Fort +N / Ref +N / Will +N"
   - Content: 3-column `StatTile` grid (Fort/Ref/Will with ability mod labels)

5. **Attack Bonuses**
   - Summary: "BAB +N"
   - Content: BAB field + 3-column grid (Melee/Ranged/Thrown stat tiles with formula labels)

6. **Weapons & Gear**
   - Summary: "N items" or "empty"
   - Content: weapon cards or empty state + "Add weapon" button

7. **Spells**
   - Summary: "—"
   - Content: Spells/Day · Known · Save DC tiles + empty state + "Add spell" button

8. **Description**
   - Content: 2-column field grid (Size, Walking Speed, Home World, Gender, Deity, Alignment)

#### Desktop layout
Two-column grid (left 1.1fr, right 1fr) with sub-tabs above:
- Sub-tabs: "Stats" / "Abilities & Gear" / "Spells" — pill-style selector (`--surface-2` bg, 4px padding, 11px radius)
- **Stats tab:** Left col = Ability Scores + Skills blocks; Right col = Health & Resolve + Saving Throws + Attack Bonuses + Weapons
- **Abilities & Gear tab:** Left = Weapons & Gear; Right = Description
- **Spells tab:** Spells block, max 600px wide

---

### 6. Starship Sheet

**Route:** `/campaigns/[id]/ship`

#### Mobile layout
- `AppBar`: ship name + "TIER N · CAMPAIGN NAME" sub
- **Shield diagram** (always visible, not in accordion):
  - "Forward" label + value + `−`/`+` stepper (centered above the grid)
  - 3-col grid: Port arc | Ship core | Starboard arc
  - Port/Starboard arcs: `--surface-2` bg, `--border` border, 11px radius, label/value/`−`+`+` steppers
  - Ship core: `--chrome` bg, 14px radius — ship icon + "Shields" label + "N / N" total
  - "Aft" label + value + steppers (below grid)
  - Shield values: Space Grotesk 700 20px `--accent`

**Accordion sections:**

1. **Hull & Defenses** — open by default
   - 2-col StatTile grid: AC + TL (dark tiles)
   - Hull Points `ResourceBar` (`--danger` color)
   - 2-col fields: Damage Threshold, Critical Threshold

2. **Weapons** (5 arcs: Forward/Port/Starboard/Aft/Turret)
   - Each: `weapon-card` style (11px radius, `--surface-2` bg, `--border` border)
   - "Add weapon" button

3. **Critical Damage**
   - One row per system: Life Support / Sensors / Engines / Power Core / Weapons Array
   - Three toggle buttons: "Glitching" (warn colors) / "Malfunc." (orange) / "Wrecked" (danger)
   - Toggle: click sets state, click again clears. Only one state per system at a time.

4. **Crew & Roles**: Captain / Pilot / Engineers / Gunners / Science Officers — each a `skill-row` style with crew icon

5. **Ship Specs**: 2-col field grid (Name, Tier, Speed, Maneuverability, Drift Rating, Power Core)

#### Desktop layout
3-column grid:
- Col 1: Shields block + Hull & Defenses block
- Col 2: Weapons block
- Col 3: Critical Damage block + Crew block

---

## Components

### List Card (`.list-card`)
```
Background: --surface
Border: 1px solid --border, 12px radius
Padding: 14px
Hover: border-color --accent-border, shadow --sh-sm
Layout: flex row, gap 13px, align-items center

Children:
  Avatar: 46×46px, 12px radius, initials, hashed bg
  Meta (flex:1):
    Name: Space Grotesk 600 15px + pill badges
    Detail: 13px --text-2, margin-top 2px
  Chevron: --text-3
```

### Stat Tile (`.stat-tile`)
```
Background: --surface-2
Border: 1px solid --border, 11px radius
Padding: 11px 8px, text-align center

label: IBM Plex Mono 9.5px uppercase 0.08em --text-3
value: Space Grotesk 700 22px, margin-top 3px
mod:   IBM Plex Mono 12px --accent

Dark variant (.dark): --chrome bg, white value, --accent-bright mod
```

### Resource Bar (`.resource`)
```
Top row (space-between):
  Left: dot (9px circle, color-coded) + name (Space Grotesk 600 13.5px)
  Right: "N / N" (IBM Plex Mono 13px, bold current value in Space Grotesk 700 17px)
Progress bar: 8px tall, 99px radius, --surface-2 bg + --border border
  Fill: colored, transition width 0.3s ease
Controls row (gap 8px, margin-top 7px):
  − button: flex:1, 8px pad, 9px radius, --border border, --danger color, hover --danger-bg
  + button: same, --good color, hover --good-bg
  Font: IBM Plex Mono 15px 600
```

### Block / Accordion (`.block`)
```
Background: --surface
Border: 1px solid --border, 12px radius
margin-bottom: 11px, overflow hidden

Header (.block-header):
  Padding: 13px 15px, cursor pointer
  Hover: --surface-2 bg
  Layout: flex row, gap 10px
  Icon: 16×16 --accent
  Title: Space Grotesk 600 12.5px uppercase 0.05em --text-1
  Summary: IBM Plex Mono 12px --text-3 (right-aligned, flex pushes it)
  Caret: 18×18 --text-3, rotate(-90deg) when closed, transition 0.2s

Body (.block-body):
  Padding: 6px 15px 16px
  border-top: 1px solid --border
  Hidden when closed
```

### Pill Badges
```
.pill.dm:   --chrome bg, white text, IBM Plex Mono 9.5px 600 uppercase 0.06em, 3px 8px, 99px radius
.pill.lv:   --accent-bg bg, --accent-text color, --accent-border border
.pill.code: --surface-2 bg, --border border, --text-2 color, 12px, normal case 0.05em tracking
```

### Skill Row
```
Layout: flex row, align-items center, gap 10px
Padding: 10px 4px, border-bottom: 1px solid --border (last-child: none)

Star (★): --warn, 12px
Name: flex:1, 14px, flex row with gap
Ability badge: IBM Plex Mono 10px --text-3, --surface-2 bg, --border border, 5px radius, 2px 6px pad
Total: Space Grotesk 700 16px, min-width 42px, text-align right
Roll button: 36×36px, 9px radius, --border border, --surface bg, --accent icon
  Hover: --accent-bg bg, --accent-border border
```

### Roll Toast
```
Position: fixed, bottom: tabbar-height + 12px, left 50%, translateX(-50%)
Background: --chrome, --chrome-text, IBM Plex Mono 14px 600
Padding: 10px 18px, 12px radius, --sh-md shadow
z-index: 200, pointer-events: none
Animation: fade+slide up (0.2s ease in), auto-dismiss after 1.8s
Result value: --accent-bright color
```

---

## Interactions & Behaviour

### Ability scores
- Each stat has `−` / `+` buttons clamped to range 3–20
- Modifier = `Math.floor((score - 10) / 2)`, shown as "+N" or "N"
- EAC = 10 + energyArmorBonus + dexMod + miscMod
- KAC = 10 + kineticArmorBonus + dexMod + miscMod
- Initiative = dexMod + miscMod

### Skill totals
```
total = ranks + (classSkill && ranks > 0 ? 3 : 0) + abilityMod + misc
```

### Save totals
```
Fort   = baseFort   + conMod  + miscFort
Reflex = baseReflex + dexMod  + miscReflex
Will   = baseWill   + wisMod  + miscWill
```

### Attack totals
```
BAB (set manually)
Melee  = BAB + strMod + miscMelee
Ranged = BAB + dexMod + miscRanged
Thrown = BAB + strMod + miscThrown
```

### Dice roll
- Tapping a skill's dice icon rolls 1d20 + skill total
- Shows roll toast: "Skill name: +N" (nat 20 adds "· NAT 20! ✦", nat 1 adds "· NAT 1")
- Toast dismisses automatically after 1.8s

### Shield arcs
- Each facing has its own current value (clamped 0..max)
- `−`/`+` buttons adjust the facing
- Total shown in centre

### Critical damage
- Per system: null | "glitching" | "malfunc" | "wrecked"
- Clicking a state sets it; clicking the active state clears it
- Button colors: glitching = warn, malfunc = orange, wrecked = danger

### Navigation
- Mobile: bottom tabs → Campaign (detail) / Characters (list) / Sheet (active char) / Starship
- Desktop: top nav (Campaigns / Characters) + left sidebar (campaign context nav)
- Clicking a party card opens that character's sheet
- Back button on mobile detail pages returns to campaign detail

### Responsive
- Below 768px: mobile layout (bottom tabs, AppBar, no sidebar)
- 768px+: desktop layout (top nav, sidebar, no bottom tabs, no mobile AppBar)

---

## State Shape (reference)

```typescript
interface Character {
  id: string
  name: string
  race: string
  class: string
  theme: string
  level: number
  abilities: { str: number; dex: number; con: number; int: number; wis: number; cha: number }
  armorBonusEnergy: number
  armorBonusKinetic: number
  miscAC: number; miscInit: number
  baseFort: number; baseReflex: number; baseWill: number
  miscFort: number; miscReflex: number; miscWill: number
  bab: number; miscMelee: number; miscRanged: number; miscThrown: number
  hpMax: number; hpCur: number
  spMax: number; spCur: number   // Stamina Points
  rpMax: number; rpCur: number   // Resolve Points
  size: string; walkSpeed: string; homeWorld: string; gender: string; deity: string; alignment: string
  skills: Skill[]
  weapons: Weapon[]
  spells: Spell[]
}

interface Skill {
  name: string; ability: keyof Abilities
  classSkill: boolean; star?: boolean
  ranks: number; misc: number
  // derived: total
}

interface Ship {
  id: string; name: string; tier: number
  shieldFwd: number; shieldFwdMax: number
  shieldPort: number; shieldPortMax: number
  shieldStarboard: number; shieldStarboardMax: number
  shieldAft: number; shieldAftMax: number
  hullMax: number; hullCur: number
  ac: number; tl: number
  damageThreshold: number; criticalThreshold: number
  crits: Record<string, 'glitching' | 'malfunc' | 'wrecked' | null>
  crew: { captain: string; pilot: string; engineers: string[]; gunners: string[]; science: string[] }
  driftRating: number; powerCore: string; driftEngine: string
}

interface Campaign {
  id: string; name: string; code: string; isDM: boolean
  charIds: string[]; shipId: string
}
```

---

## Files in This Package

| File | Purpose |
|---|---|
| `Starfinder App (Standalone).html` | **Primary reference** — full hi-fi interactive prototype. Open in any browser. |
| `Starfinder Wireframes (Standalone).html` | Layout exploration reference — shows 3 mobile sheet directions and nav rationale. |

## Implementation Notes for Claude Code

1. **Do not copy the HTML/JS directly** — reimplement using your existing Next.js components, Tailwind/CSS modules, Prisma schema, auth, etc.
2. **Priority order:** App shell + nav → Character sheet (mobile accordion first) → Starship sheet → Campaign/party view → Lists
3. **The existing app already has the data model** — focus changes are routing, layout, and component styling
4. **Calc functions** are straightforward — implement as pure functions in a `lib/starfinder.ts` helper
5. **Avatar colors** — hash the name string to a hue: `[...name].reduce((a,c)=>a+c.charCodeAt(0),0) % 360` → `hsl(hue 50% 45%)`
6. **The bottom tab bar** is contextual to an active campaign — hide the Starship tab if no campaign is active
7. **Dark mode** — implement via a CSS class or `data-dark` attribute on `<html>`, toggled via user preference stored in localStorage or a settings page
