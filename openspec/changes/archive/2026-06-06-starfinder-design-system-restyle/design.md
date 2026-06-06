## Context

The design handoff lives entirely in `design/README.md` (authoritative spec) and `design/Starfinder App (Standalone).html` (hi-fi interactive prototype). The wireframes file is reference only. All visual decisions below come from those files.

The existing app has a solid data model and routing. No schema changes are needed. The work is entirely visual and structural.

## Goals / Non-Goals

**Goals:**
- Apply the full design token set from `design/README.md`
- Load and apply the three design fonts
- Responsive shell: mobile AppBar + TabBar / desktop top-nav + sidebar
- Shared component set: Avatar, Pill, StatTile, ResourceBar, AccordionBlock
- Redesign all list pages, campaign detail, character sheet, and starship sheet to match the prototype

**Non-Goals:**
- Roll automation persistence (rolls are ephemeral toast-only)
- Session notes or initiative tracking UI beyond the icon-button placeholder in the Encounter section
- Dark mode system preference auto-detection (user-toggle only via localStorage)
- Any data model or server action changes

## Decisions

### Decision: Design tokens layered on top of shadcn, not replacing it

**Chosen**: Keep shadcn's `@layer base` token names (--background, --foreground, --primary, etc.) but redefine them to map to the design palette. Add the design's own named tokens (--bg, --surface, --chrome, --accent, etc.) as a second layer in `:root`.

**Rationale**: shadcn components throughout the codebase reference `--background`, `--border`, `--primary`, etc. Removing those aliases would require touching every shadcn component. Mapping them instead lets existing components inherit the new palette for free while new components use the design-spec names directly.

**Aliases used:**
```
--background  → --bg
--foreground  → --text-1
--border      → --border (same name, design value)
--primary     → --accent
--primary-foreground → --surface
--muted       → --surface-2
--muted-foreground   → --text-2
--accent      → --accent-bg  (shadcn's --accent ≠ design's --accent)
--accent-foreground  → --accent-text
--card        → --surface
--card-foreground    → --text-1
--destructive → --danger
```

### Decision: Dark mode via `data-dark="true"` on `<html>`, not via `.dark` class

**Chosen**: Set `data-dark="true"` on the `<html>` element (as the design spec requires). A `DarkModeProvider` client component reads `localStorage` on mount and applies the attribute.

**Rationale**: The design spec explicitly calls for `data-dark`. The existing shadcn integration uses `.dark` class — we keep both selectors in CSS so shadcn dark-mode components still work.

**Implementation**: Override tokens in `[data-dark="true"]` selector in globals.css. Also add `.dark [data-dark="true"]` fallback. The `DarkModeProvider` sits inside `<body>` in `layout.tsx`.

### Decision: Three-font loading strategy via `next/font/google`

**Chosen**: Load Space Grotesk, IBM Plex Sans, and IBM Plex Mono via `next/font/google` in `src/app/layout.tsx`. Expose each as a CSS variable (`--font-ui`, `--font-body`, `--font-mono`). Apply via `@theme inline` in globals.css.

**Rationale**: `next/font` self-hosts Google Fonts and eliminates layout shift. CSS variables allow Tailwind utility classes and inline styles to reference the fonts without global body overrides conflicting with shadcn's existing font setup.

### Decision: Responsive shell implemented at the `dashboard/layout.tsx` level

**Chosen**: `dashboard/layout.tsx` renders the TopBar (desktop only, hidden on mobile via `hidden md:flex`), and a fixed bottom TabBar (mobile only, hidden on desktop via `md:hidden`). The main content area gets `pb-[68px] md:pb-0` padding to account for the tab bar height on mobile.

**Rationale**: All dashboard pages are already children of this layout. A single layout-level change propagates to every page without per-page boilerplate.

**Campaign sidebar**: The sidebar lives inside `campaigns/[id]/layout.tsx` which is below the dashboard layout — it only renders on campaign-context pages. On mobile it is hidden (`hidden md:flex`); the bottom tab bar provides the same navigation.

### Decision: Mobile AppBar is a layout slot, not a component passed via props

**Chosen**: The `AppBar` component reads from a React context (`AppBarContext`) that any page can populate via a `useAppBar({ title, subtitle, backHref })` hook.

**Rationale**: The AppBar lives in the dashboard layout but its content (title, back link) is determined by the active page. Context + hook avoids prop drilling through layout files and keeps pages declarative. This is the pattern Next.js recommends for layout-to-page communication in the App Router.

### Decision: AccordionBlock is a custom component, not shadcn's Accordion

**Chosen**: Write `src/components/accordion-block.tsx` from scratch using a `useState` open/close toggle and a CSS `max-height` transition.

**Rationale**: shadcn's Accordion uses Radix primitives that apply `display:none` when closed. The design prototype uses a max-height slide transition. Wrapping Radix to produce that exact animation is more complex than a small custom component that matches the prototype exactly. The accordion is purely presentational (no a11y requirement beyond the toggle button itself).

### Decision: Avatar color hash

```ts
function nameToHue(name: string): number {
  return [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
}
// hsl(hue, 50%, 45%) — matches design spec exactly
```

### Decision: Roll toast is ephemeral client state, not persisted

The dice roll result (1d20 + skill total) is computed on the client, shown in a fixed-position toast for 1.8s, then auto-dismissed. No server round-trip. This is sufficient for table-play use.

### Decision: Starship sheet shield diagram and critical damage are local client state, saved via debounced action

Shield arc current values (shieldForwardCurrent, etc.) already exist in the `spaceship` DB row and are updated via `updateSpaceshipAction`. Critical damage state (`glitching | malfunctioning | wrecked | null` per system) is persisted the same way — the spaceship schema already has these fields in `_name-editor.tsx`. The UI redesign wires the same save actions to the new visual controls.

## Component Anatomy

### Avatar
```
<Avatar name="Zara Lyss" size={46} radius={12} />
→ hue = hash("Zara Lyss") % 360
→ div 46×46px, radius 12px, bg hsl(hue 50% 45%), color white
→ inner span: initials (first letter of first two words, uppercase)
   font: Space Grotesk 600, size ≈ 40% of avatar width
```

### Pill
```
<Pill variant="dm">DM</Pill>
<Pill variant="lv">3</Pill>
<Pill variant="code">AXTQ-7</Pill>
```

### StatTile
```
<StatTile label="EAC" value={14} dark />
<StatTile label="FORT" value={+3} mod="+CON" />
```

### ResourceBar
```
<ResourceBar
  label="Stamina"
  color="accent"          // accent | good | warn | danger
  current={18} max={24}
  onDecrement={fn} onIncrement={fn}
/>
```

### AccordionBlock
```
<AccordionBlock
  icon={<HeartIcon />}
  title="Health & Resolve"
  summary="18/24 SP · 12/12 HP"
  defaultOpen
>
  {children}
</AccordionBlock>
```

### AppBar (mobile only)
```
<AppBar
  title="Zara Lyss"
  subtitle="LV 5 · TECHNOMANCER"
  backHref="/dashboard/campaigns/[id]"
/>
```

### TabBar (mobile only, 4 tabs)
```
Tab: { icon: LucideIcon; label: string; href: string; active: boolean }
Tabs: Campaign | Characters | Sheet | Starship
Starship tab is hidden when no campaign is active
```

### RollToast
```
// Shown for 1.8s then removed
"Acrobatics: 17 +5 = 22"
// Nat 20: "Perception: 20 +3 = 23 · NAT 20! ✦"
// Nat 1:  "Stealth: 1 +2 = 3 · NAT 1"
```

## Screen Layouts

### Desktop Shell
```
┌──────────────── top-nav 54px (--chrome) ────────────────┐
│ ●Starfinder      [Campaigns] [Characters]      Sign out  │
└─────────────────────────────────────────────────────────┘
┌─sidebar 240px─┐ ┌──────── content (flex-1) ────────────┐
│               │ │                                       │
│  CAMPAIGN     │ │                                       │
│  ○ Overview   │ │                                       │
│  ● Characters │ │                                       │
│  ○ Starship   │ │                                       │
└───────────────┘ └───────────────────────────────────────┘
```

### Mobile Shell
```
┌──────── AppBar 56px (--chrome) ──────────────────┐
│ [←]    Page Title           [···]                │
│        sub-label (mono, muted)                   │
└──────────────────────────────────────────────────┘
│                                                  │
│         scrollable content                       │
│                                                  │
└──────────────────────────────────────────────────┘
┌──────── TabBar 68px (--surface, border-top) ─────┐
│  Campaign   Characters   Sheet     Starship      │
│    [icon]     [icon]    [icon]      [icon]       │
└──────────────────────────────────────────────────┘
```

### Character Sheet — Mobile (accordion)
```
[sticky: avatar, name, race/class, level badge]
[sticky: vitals strip: EAC · KAC · Initiative]
──────────────────────────────────────────────
▼ Health & Resolve          18/24 SP · 12/12 HP
  [SP bar] [HP bar] [RP bar]

▶ Ability Scores            STR 14 / DEX 12 / INT 16

▶ Skills                    8 skills

▶ Saving Throws             Fort +2 / Ref +1 / Will +4

▶ Attack Bonuses            BAB +3

▶ Weapons & Gear            2 items

▶ Spells                    —

▶ Description
```

### Character Sheet — Desktop (two-column + pill tabs)
```
[Stats] [Abilities & Gear] [Spells]   ← pill tabs

┌──────────────────┐ ┌───────────────────────┐
│ Ability Scores   │ │ Health & Resolve       │
│ Skills           │ │ Saving Throws          │
│                  │ │ Attack Bonuses         │
│                  │ │ Weapons                │
└──────────────────┘ └───────────────────────┘
```

### Starship Sheet — Desktop (3-column)
```
┌───────────┐ ┌───────────┐ ┌───────────┐
│ Shield    │ │ Weapons   │ │ Crit Dmg  │
│ Diagram   │ │ (5 arcs)  │ │ Crew      │
│           │ │           │ │           │
│ Hull &    │ │           │ │           │
│ Defenses  │ │           │ │           │
└───────────┘ └───────────┘ └───────────┘
```
