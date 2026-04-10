# Plantometer — Web Design System Plan

## Context

Plantometer currently uses a utilitarian dark-mode UI with muted gray/green tones and Geist Sans font. While functional, it has no brand identity, no visual delight, and doesn't communicate anything about healthy eating or plant diversity. This plan redesigns the entire visual system to be minimalist, health-focused, and energetic — inspiring users to engage with their plant diversity goals.

The redesign shifts from dark mode to a warm light mode as the primary experience, introduces a new font pairing designed for health/food contexts, and builds a comprehensive Tailwind CSS 4 theme.

---

## 1. Typography System

### Fonts

**Heading: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)**
A geometric humanist sans-serif with slightly organic, rounded terminals. Widely used by modern wellness and food brands (Oatly-adjacent aesthetic). Its large numerals are exceptionally legible — crucial for the diversity score hero metric. Variable weight axis covers display through body.

**Body: [DM Sans](https://fonts.google.com/specimen/DM+Sans)**
Low-contrast geometric sans designed specifically for small-size UI legibility. Pairs naturally with Plus Jakarta Sans without competing. Perfect for chip labels, form inputs, captions, and list items.

### Type Scale

| Role                          | Font              | Size             | Weight | Line Height | Tracking           |
| ----------------------------- | ----------------- | ---------------- | ------ | ----------- | ------------------ |
| Display (score numeral)       | Plus Jakarta Sans | 4.5rem / 72px    | 800    | 1.0         | -0.03em            |
| H1 (page title)               | Plus Jakarta Sans | 1.75rem / 28px   | 700    | 1.2         | -0.02em            |
| H2 (section title)            | Plus Jakarta Sans | 1.25rem / 20px   | 600    | 1.3         | -0.01em            |
| H3 (card title)               | Plus Jakarta Sans | 1rem / 16px      | 600    | 1.4         | 0                  |
| Body                          | DM Sans           | 0.9375rem / 15px | 400    | 1.6         | 0                  |
| Body Strong                   | DM Sans           | 0.9375rem / 15px | 500    | 1.6         | 0                  |
| Label (chip text, tags)       | DM Sans           | 0.8125rem / 13px | 500    | 1.4         | 0.01em             |
| Caption                       | DM Sans           | 0.75rem / 12px   | 400    | 1.5         | 0.02em             |
| Caption Strong (date headers) | DM Sans           | 0.6875rem / 11px | 600    | 1.4         | 0.06em + uppercase |

**Design coherence trick:** Checked/active/completed states use Plus Jakarta Sans (heading font). Inactive/secondary states use DM Sans. A completed plant type "reads" as more important — not just visually, but typographically. This is borrowed from editorial design and feels premium without being showy.

---

## 2. Color Palette

### Strategy

- Yellow-green primary (hue 100–130°) instead of the standard teal/emerald (#10b981). Feels like actual plants and food, not a generic wellness app.
- Warm amber accent for energy, vitality, spice.
- Warm-tinted stone neutrals (not cool gray) — invisible to conscious perception but makes everything feel less clinical.
- Light mode primary; dark mode as an optional additive override.

### Sprout (Primary Green)

| Token                | Hex       | Usage                                      |
| -------------------- | --------- | ------------------------------------------ |
| `--color-sprout-50`  | `#f2f9ee` | Checked type backgrounds, score card bg    |
| `--color-sprout-100` | `#e0f2d6` | Hover states, checklist checked bg         |
| `--color-sprout-200` | `#bde4a8` | Decorative accents, subtle borders         |
| `--color-sprout-400` | `#72c441` | Secondary accents, icon color              |
| `--color-sprout-500` | `#57b02b` | Selected chips, progress bar fill, success |
| `--color-sprout-600` | `#429920` | Primary buttons, strong accent, nav active |
| `--color-sprout-700` | `#2f7015` | Button hover, dark text on light green bg  |
| `--color-sprout-900` | `#1a3d0a` | Dark mode primary bg                       |

### Saffron (Accent Amber)

| Token                 | Hex       | Usage                             |
| --------------------- | --------- | --------------------------------- |
| `--color-saffron-50`  | `#fffbeb` | Highlight backgrounds             |
| `--color-saffron-100` | `#fef3c7` | Notification surfaces             |
| `--color-saffron-400` | `#fbbf24` | Accent icons, progress indicators |
| `--color-saffron-500` | `#f59e0b` | Strong accents                    |
| `--color-saffron-600` | `#d97706` | Text on light backgrounds         |

### Stone (Warm Neutrals)

| Token               | Hex       | Usage                         |
| ------------------- | --------- | ----------------------------- |
| `--color-stone-0`   | `#fafaf8` | Page background               |
| `--color-stone-50`  | `#f5f5f2` | Card/surface background       |
| `--color-stone-100` | `#ebebе6` | Elevated surface, input bg    |
| `--color-stone-200` | `#d6d6d0` | Borders, dividers             |
| `--color-stone-300` | `#b0b0a8` | Disabled borders              |
| `--color-stone-400` | `#888880` | Placeholder text, muted icons |
| `--color-stone-500` | `#666660` | Secondary text, captions      |
| `--color-stone-600` | `#4a4a45` | Body text (secondary)         |
| `--color-stone-700` | `#333330` | Strong body text              |
| `--color-stone-800` | `#1e1e1c` | Headings on light bg          |
| `--color-stone-900` | `#111110` | Near-black                    |
| `--color-stone-950` | `#0a0a09` | Dark mode page background     |

### Semantic

| Token                | Hex       | Usage                                  |
| -------------------- | --------- | -------------------------------------- |
| `--color-success`    | `#57b02b` | Confirmations, checkmarks              |
| `--color-success-bg` | `#f2f9ee` | Success backgrounds                    |
| `--color-error`      | `#dc2626` | Destructive actions, validation errors |
| `--color-error-bg`   | `#fef2f2` | Error state backgrounds                |
| `--color-warning`    | `#d97706` | Warnings                               |
| `--color-muted`      | `#888880` | Muted elements                         |

### Plant Type Color Dots

Small 8px circles used consistently across checklist, catalog, log history, and chips:

| Type           | Color       | Hex       |
| -------------- | ----------- | --------- |
| Vegetables     | sprout-400  | `#72c441` |
| Fruits         | saffron-500 | `#f59e0b` |
| Grains         | Wheat       | `#d4a853` |
| Legumes        | Sage        | `#7cb87a` |
| Nuts & Seeds   | Nut brown   | `#b58a4a` |
| Herbs & Spices | Herb purple | `#8b5cf6` |

---

## 3. Design Tokens

### Border Radius

| Token           | Value    | Usage                             |
| --------------- | -------- | --------------------------------- |
| `--radius-sm`   | `6px`    | Badges, type tags, small elements |
| `--radius-md`   | `10px`   | Standard cards, form inputs, rows |
| `--radius-lg`   | `14px`   | Section containers                |
| `--radius-xl`   | `20px`   | Score card, hero panels           |
| `--radius-full` | `9999px` | Chips/pills                       |

### Shadow System (warm-tinted, not cold gray)

| Token            | Value                                                           | Usage                                |
| ---------------- | --------------------------------------------------------------- | ------------------------------------ |
| `--shadow-xs`    | `0 1px 2px rgba(20,20,18,0.06)`                                 | Input fields, flat cards             |
| `--shadow-sm`    | `0 2px 8px rgba(20,20,18,0.08)`                                 | Cards on page                        |
| `--shadow-md`    | `0 4px 16px rgba(20,20,18,0.10), 0 1px 4px rgba(20,20,18,0.06)` | Score card, elevated panels          |
| `--shadow-lg`    | `0 8px 32px rgba(20,20,18,0.12), 0 2px 8px rgba(20,20,18,0.06)` | Modals, dropdowns                    |
| `--shadow-green` | `0 4px 20px rgba(87,176,43,0.20)`                               | Primary button hover, selected chips |

---

## 4. Component Redesign Specs

### Navigation Bar

- Sticky top bar, 60px height, `sticky top-0 z-50`
- **Background:** Semi-transparent `bg-stone-0/80` + `backdrop-blur-sm` — frosted glass effect
- **Separator:** 1px `stone-200` bottom border only (no colored band)
- **Logo:** "Plantometer" in Plus Jakarta Sans 600, left-aligned
- **Nav links:** Right-aligned. Active = `sprout-600` text + 2px `sprout-500` underline. Inactive = `stone-500` → `stone-800` on hover
- Max-width container `max-w-xl` centered, same as page content

### Dashboard Score Card (Hero Metric)

- Large `rounded-xl` card with `bg-sprout-50`, `border border-sprout-200`, `shadow-md`
- Score lockup: large numeral in Plus Jakarta Sans 800 72px `sprout-600`, with "/6 types" + "N unique plants" DM Sans stacked right
- Progress bar below: 6px height, `rounded-full`, `bg-sprout-100` track, `bg-sprout-500` fill, animated on mount with `transition-all duration-700`
- **6/6 state:** `sprout-100` bg + `sprout-400` border + dashed `outline: 2px dashed sprout-400; outline-offset: 4px`
- **0/6 state:** `stone-100` bg + `stone-300` border (muted)
- Week navigation sits ABOVE the card as a slim row, not inside it

### Plant Type Checklist Items

- Each row: `rounded-md shadow-xs`, min-height 56px, `px-5 py-3.5`
- **Unchecked:** `bg-stone-50`, `stone-200` border, `stone-400` text, 60% opacity, empty 20px circle indicator (left), type name in DM Sans 500 `stone-500`
- **Checked:** `bg-sprout-50`, `sprout-200` border, full opacity, filled 20px `bg-sprout-500` circle with white checkmark SVG, type name in Plus Jakarta Sans 600 `stone-800`, plant sub-list in DM Sans 400 12px `sprout-700`, small "N plants" badge right side
- Transitions: `transition-all duration-300`

### Chip Selector

- Container: `bg-stone-50 rounded-lg p-4 shadow-xs border border-stone-200`
- **Unselected chip:** `bg-white border border-stone-200 text-stone-700` DM Sans 500 13px `rounded-full px-4 py-2`. Hover: `bg-stone-100`
- **Selected chip:** `bg-sprout-500 text-white shadow-green scale-105` + inline "×" suffix `opacity-70`
- Transitions: `transition-all duration-150`
- Submit button: anchored at bottom, `opacity-0 translate-y-1` → `opacity-100 translate-y-0` animated in when selection is non-empty

### Form Inputs

- **Base:** `bg-white border border-stone-200 rounded-md shadow-xs` height 44px
- **Focus:** `border-sprout-400` (2px) + `box-shadow: 0 0 0 3px rgba(87,176,43,0.15)` green glow ring
- **Error:** `border-error` + `box-shadow: 0 0 0 3px rgba(220,38,38,0.15)`, error message DM Sans 400 12px `error` below field
- Labels: DM Sans 500 13px `stone-700`, always above field (no floating labels)

### Button Hierarchy

- **Primary:** `bg-sprout-600 text-white` Plus Jakarta Sans 600 15px `rounded-md px-5 h-11`. Hover: `bg-sprout-700 shadow-green`. Active: `scale-[0.98]`. Disabled: `opacity-40 cursor-not-allowed`
- **Secondary:** `bg-stone-100 text-stone-700` same dimensions. Hover: `bg-stone-200`
- **Ghost:** No bg/border, `text-sprout-600` with `underline` on hover, DM Sans 500 14px. Used for toggles
- **Destructive icon:** Ghost × icon in `stone-400` → `error` red on hover. No background — reduces accidental deletion risk

---

## 5. Tailwind CSS 4 Theme (`app/globals.css`)

Replace the current theme block with:

```css
@import "tailwindcss";
@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap");

@theme {
  /* ── Fonts ─────────────────────────────────────────────── */
  --font-heading: "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;
  --font-body: "DM Sans", ui-sans-serif, system-ui, sans-serif;
  --font-sans: var(--font-body);
  --font-mono: ui-monospace, "Geist Mono", monospace;

  /* ── Sprout (primary green) ────────────────────────────── */
  --color-sprout-50: #f2f9ee;
  --color-sprout-100: #e0f2d6;
  --color-sprout-200: #bde4a8;
  --color-sprout-400: #72c441;
  --color-sprout-500: #57b02b;
  --color-sprout-600: #429920;
  --color-sprout-700: #2f7015;
  --color-sprout-900: #1a3d0a;

  /* ── Saffron (accent amber) ────────────────────────────── */
  --color-saffron-50: #fffbeb;
  --color-saffron-100: #fef3c7;
  --color-saffron-400: #fbbf24;
  --color-saffron-500: #f59e0b;
  --color-saffron-600: #d97706;

  /* ── Stone (warm neutrals) ─────────────────────────────── */
  --color-stone-0: #fafaf8;
  --color-stone-50: #f5f5f2;
  --color-stone-100: #ebebе6;
  --color-stone-200: #d6d6d0;
  --color-stone-300: #b0b0a8;
  --color-stone-400: #888880;
  --color-stone-500: #666660;
  --color-stone-600: #4a4a45;
  --color-stone-700: #333330;
  --color-stone-800: #1e1e1c;
  --color-stone-900: #111110;
  --color-stone-950: #0a0a09;

  /* ── Semantic ──────────────────────────────────────────── */
  --color-success: #57b02b;
  --color-success-bg: #f2f9ee;
  --color-error: #dc2626;
  --color-error-bg: #fef2f2;
  --color-warning: #d97706;
  --color-muted: #888880;
  --color-muted-text: #666660;

  /* ── Page aliases ──────────────────────────────────────── */
  --color-background: var(--color-stone-0);
  --color-surface: var(--color-stone-50);
  --color-foreground: var(--color-stone-800);

  /* ── Border radius ─────────────────────────────────────── */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 20px;
  --radius-full: 9999px;
  --radius-DEFAULT: var(--radius-md);

  /* ── Shadows ───────────────────────────────────────────── */
  --shadow-xs: 0 1px 2px rgba(20, 20, 18, 0.06);
  --shadow-sm: 0 2px 8px rgba(20, 20, 18, 0.08);
  --shadow-md:
    0 4px 16px rgba(20, 20, 18, 0.1), 0 1px 4px rgba(20, 20, 18, 0.06);
  --shadow-lg:
    0 8px 32px rgba(20, 20, 18, 0.12), 0 2px 8px rgba(20, 20, 18, 0.06);
  --shadow-green: 0 4px 20px rgba(87, 176, 43, 0.2);
}

:root {
  background-color: var(--color-background);
  color: var(--color-foreground);
}

body {
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

**Optional dark mode override** (add after the block above):

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: var(--color-stone-950);
    --color-surface: #1a1a18;
    --color-foreground: #f0f0ee;
    /* Sprout/saffron colors stay the same — they work on dark bg */
  }
}
```

---

## 6. Page Layout Specs

### Global

- **Max width:** `max-w-xl` (576px) — slightly wider than current `max-w-lg` to give score card breathing room
- **Horizontal padding:** `px-5` (mobile), `sm:px-6` (larger screens) on `<main>`
- **Top padding:** `pt-8` below sticky nav
- **Section gap:** `gap-8` on dashboard, `gap-6` on list pages

### Dashboard (Home)

1. **Week nav row** (40px) — prev arrow | "This week" + date range | next arrow. `mb-5`
2. **Score card** (`rounded-xl`, `sprout-50`, `p-6`, `shadow-md`) — score lockup left, progress bar below. `mb-8`
3. **Type checklist** — Section title H3 (`mb-3`) + `flex flex-col gap-2` of 6 rows
4. **Log plants card** (`stone-50 rounded-lg p-5 shadow-sm`) — ChipSelector + "Add new plant" ghost toggle separated by `border-t`
5. **Today's entries** — Section title H2 with count, list of compact rows or empty state

### Plants Catalog

- H1 "Your Plants" above page content
- Add form in `stone-50 rounded-lg p-5 shadow-sm` card at top
- Optional: filter text input with magnifying glass SVG prefix below form
- Plant list: `flex flex-col gap-2`, each row has type dot + name + type badge + edit/delete ghost buttons

### Log History

- H1 + count badge inline
- Date headers: DM Sans 600 11px uppercase `stone-500` with `tracking-wide`, sticky within scroll: `sticky top-[60px] bg-stone-0/90 backdrop-blur-sm`
- Entry rows: `bg-white rounded-md shadow-xs border border-stone-100` with type dot
- Empty state: large `stone-200` leaf icon, "No entries yet" H2, "Start logging" primary link

### Loading Skeleton

- Skeleton blocks: `bg-stone-100 animate-pulse rounded-md`
- Score card skeleton: `rounded-xl bg-sprout-50/60` at 120px height
- Checklist skeletons: 6 rows × 56px, `bg-stone-100 rounded-md gap-2`

---

## Critical Files

| File                                  | Change                                                            |
| ------------------------------------- | ----------------------------------------------------------------- |
| `app/globals.css`                     | Replace `@theme` block entirely, add font import                  |
| `app/layout.tsx`                      | Redesign nav bar (fonts, colors, sticky + frosted glass)          |
| `app/page.tsx`                        | Redesign all dashboard sections (score card, checklist, week nav) |
| `app/components/chip-selector.tsx`    | Redesign chip states, container, submit button                    |
| `app/components/add-plant-inline.tsx` | Redesign toggle + form                                            |
| `app/plants/page.tsx`                 | Redesign add form card layout                                     |
| `app/plants/plant-row.tsx`            | Add type color dot, redesign row                                  |
| `app/log/page.tsx`                    | Sticky date headers, redesign entries, empty state                |
| `app/log/edit-intake-plant.tsx`       | Redesign edit toggle                                              |
| `app/loading.tsx`                     | Warm skeleton colors                                              |

## Verification

1. `npm run dev` — confirm page loads with new fonts and colors
2. Check score card renders with green tint, progress bar animates
3. Toggle a plant intake — verify checklist row transitions smoothly (color + font switch)
4. Select chips — verify selected state pops with scale + green glow
5. Check form focus states — green glow ring appears
6. Resize to mobile (390px) — verify nav doesn't overflow, score card readable
7. `npm run lint` — no type errors from className changes
8. Optional: toggle OS dark mode — verify dark override applies
