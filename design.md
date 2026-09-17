---
name: Clinical Precision
colors:
  surface: "#faf8ff"
  surface-dim: "#d2d9f4"
  surface-bright: "#faf8ff"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#f2f3ff"
  surface-container: "#eaedff"
  surface-container-high: "#e2e7ff"
  surface-container-highest: "#dae2fd"
  on-surface: "#131b2e"
  on-surface-variant: "#444653"
  inverse-surface: "#283044"
  inverse-on-surface: "#eef0ff"
  outline: "#757684"
  outline-variant: "#c4c5d5"
  surface-tint: "#3755c3"
  primary: "#00288e"
  on-primary: "#ffffff"
  primary-container: "#1e40af"
  on-primary-container: "#a8b8ff"
  inverse-primary: "#b8c4ff"
  secondary: "#006c4a"
  on-secondary: "#ffffff"
  secondary-container: "#82f5c1"
  on-secondary-container: "#00714e"
  tertiary: "#532a00"
  on-tertiary: "#ffffff"
  tertiary-container: "#743d00"
  on-tertiary-container: "#ffa85d"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  primary-fixed: "#dde1ff"
  primary-fixed-dim: "#b8c4ff"
  on-primary-fixed: "#001453"
  on-primary-fixed-variant: "#173bab"
  secondary-fixed: "#85f8c4"
  secondary-fixed-dim: "#68dba9"
  on-secondary-fixed: "#002114"
  on-secondary-fixed-variant: "#005137"
  tertiary-fixed: "#ffdcc3"
  tertiary-fixed-dim: "#ffb77d"
  on-tertiary-fixed: "#2f1500"
  on-tertiary-fixed-variant: "#6e3900"
  background: "#faf8ff"
  on-background: "#131b2e"
  surface-variant: "#dae2fd"
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 3rem
    fontWeight: "700"
    lineHeight: 3.5rem
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Manrope
    fontSize: 2rem
    fontWeight: "700"
    lineHeight: 2.5rem
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 1.625rem
    fontWeight: "700"
    lineHeight: 2.125rem
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Manrope
    fontSize: 1.5rem
    fontWeight: "600"
    lineHeight: 2rem
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Manrope
    fontSize: 1.25rem
    fontWeight: "600"
    lineHeight: 1.75rem
    letterSpacing: -0.01em
  title-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: "600"
    lineHeight: 1.5rem
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: "400"
    lineHeight: 1.75rem
  body-md:
    fontFamily: Inter
    fontSize: 0.9375rem
    fontWeight: "400"
    lineHeight: 1.5rem
  body-sm:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: "400"
    lineHeight: 1.25rem
  label-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: "500"
    lineHeight: 1.25rem
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: "600"
    lineHeight: 1rem
    letterSpacing: 0.04em
  caption:
    fontFamily: Inter
    fontSize: 0.6875rem
    fontWeight: "500"
    lineHeight: 0.875rem
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-md: 1.5rem
  gutter-lg: 2rem
  margin: 1rem
  margin-md: 1.5rem
  margin-lg: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system delivers an immaculate, modern clinical experience engineered for a tripartite audience: anxious patients seeking immediate care, highly focused physicians balancing time-critical consults, and administrative operators overseeing dense schedules.

The aesthetic sits at the intersection of **Corporate / Modern** structure and **Hygienic Minimalism**. The emotional response it elicits is clinical reassurance, operational velocity, and pristine reliability. Every pixel must project sterile clarity without feeling cold or hostile. Visual noise is systematically reduced: decorative gradients, heavy skeuomorphism, and superfluous motion are replaced by crisp delineation, deliberate typographic cadence, high legibility, and unmistakable status signifiers.

## Colors

The palette establishes clinical authority and instant state comprehension, tuned strictly to exceed WCAG 2.1 AA contrast requirements across all interactive states.

- **Primary (`#1E40AF` - Clinical Cobalt):** Anchors core actions, navigation selections, interactive links, and primary booking triggers. Conveys medical competence and technological reliability.
- **Secondary (`#059669` - Vital Emerald):** Represents confirmed bookings, open appointment slots, healthy status markers, and positive operational states.
- **Tertiary (`#D97706` - Triage Amber):** Signifies pending slots, check-in holds, unconfirmed records, and expiring waitlists.
- **Destructive (`#DC2626` - Critical Red):** Reserved strictly for cancellations, late no-shows, emergency alerts, and system warnings.
- **Neutral (`#0F172A` - Deep Navy):** Provides high-contrast grounding for primary typography, dominant icons, and focused table headers, avoiding the harshness of pure black while retaining maximum definition.
- **Surfaces & Canvases:** Base app canvas defaults to `#F8FAFC`, secondary paneling and toolbars utilize `#F1F5F9`, and actionable surface cards use pristine `#FFFFFF`. Low-contrast structural borders utilize `#E2E8F0` and `#CBD5E1`.

## Typography

The typography pairings contrast the geometric precision and modern balance of **Manrope** for display and headline regions with the extreme legibility and systematic density of **Inter** for clinical data, doctor notes, schedules, and inputs.

- **Manrope:** Used exclusively across page titles, modal headers, schedule date banners, and high-level KPIs. Its balanced proportion maintains a human yet authoritative hospital posture.
- **Inter:** Applied to all dense tables, form controls, appointment slot tags, and EHR summaries. Tabular numerals (`tnum`, `zero`) must be toggled on across all calendar grids, timestamps, and medical ID labels to prevent horizontal shifting when data updates dynamically.
- **Scale Hierarchy:** Mobile scaling activates below `768px`, where `display-lg` steps down gracefully and `headline-lg` converts to `headline-lg-mobile` to maintain visual composure in patient booking flows.

## Layout & Spacing

This design system uses an adaptable 12-column layout built for high-throughput healthcare workflows, scaling systematically across phone, tablet, and multi-monitor clinical workstations.

- **Grid Architecture:**
  - **Desktop (1200px+):** 12 columns, `2rem` gutters, and `2.5rem` outer canvas margins. Doctor and Admin views utilize fluid multi-pane columns (fixed mini-navigation at 72px/240px, dynamic agenda views, and a dedicated 360px patient context panel).
  - **Tablet (768px - 1199px):** 8 columns, `1.5rem` gutters, and `1.5rem` canvas margins. Context sidebars collapse into slide-over sheets.
  - **Mobile (<768px):** 4 columns, `1rem` gutters, and `1rem` canvas margins. Highly linear single-column triage and booking flows.
- **Rhythm Principle:** Layout gaps scale strictly on an 8-point system, with 4px (`space-xs`) reserved for micro-spacing between status pills and avatar clusters. Table rows and doctor schedule blocks must utilize `space-sm` vertical padding in compact modes to guarantee maximum vertical data visibility without screen scrolling.

## Elevation & Depth

Visual depth is achieved through **low-contrast outlines combined with ambient, tinted elevation**. Heavy drop shadows are banned to maintain an antiseptic, modern atmosphere.

- **Level 0 (Canvas):** Pure `#F8FAFC` base with no elevation.
- **Level 1 (Clinical Cards & Data Rows):** `#FFFFFF` surface with a `1px` structural outline (`#E2E8F0`) and an ambient shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.04)`.
- **Level 2 (Active Appointment Slots, Popovers, Dropdowns):** `#FFFFFF` surface with `#CBD5E1` outline and shadow: `0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`.
- **Level 3 (Modals & Patient Triage Drawers):** `#FFFFFF` surface accompanied by a semi-translucent backdrop (`#0F172A` at 35% opacity with `2px` blur). Shadow: `0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`.

## Shapes

The design system adheres to a **Soft (`1`)** roundedness profile (base radius `0.25rem` / `4px`, `rounded-lg` at `0.5rem` / `8px`, `rounded-xl` at `0.75rem` / `12px`).

- **Interactive Inputs & Buttons:** Use `0.375rem` (6px) corners to balance clinical discipline with touch ergonomics.
- **Clinical Cards & Calendar Cells:** Base `0.5rem` (8px), establishing clear modular units without wasting space in dense grid views.
- **Full Radius (Pills / Badges):** Pure pill shapes (`9999px`) are strictly isolated to status chips (e.g., "Confirmed", "In Consultation", "Cancelled") and user presence avatars.

## Components

### Buttons

- **Primary:** Solid `#1E40AF`, text `#FFFFFF`, font `label-md`. Hover state darkens to `#1E3A8A`. Disabled state drops to `#94A3B8` background.
- **Secondary:** Surface `#F1F5F9`, text `#0F172A`, border `1px` solid `#CBD5E1`. Hover shifts to `#E2E8F0`.
- **Ghost / Tertiary:** Transparent background, `#1E40AF` text, active states show `#EFF6FF`.
- **Destructive:** Background `#DC2626`, text `#FFFFFF`. Hover `#B91C1C`.

### Chips & Micro-Status Tags

Compact markers (`fontSize: 0.75rem`, `fontWeight: 600`, pill-shaped, padding `2px 8px`).

- **Available / Confirmed:** `#ECFDF5` background, `#047857` text, `1px` solid `#A7F3D0`. Includes a 6px solid emerald dot.
- **Pending / Hold:** `#FFFBEB` background, `#B45309` text, `1px` solid `#FDE68A`.
- **Cancelled / Critical:** `#FEF2F2` background, `#B91C1C` text, `1px` solid `#FECACA`.
- **Neutral / General:** `#F1F5F9` background, `#475569` text, `1px` solid `#E2E8F0`.

### Form Fields & Inputs

- Standard inputs: height `40px` (desktop) and `44px` (mobile), padding `0.5rem 0.75rem`, border `1px` solid `#CBD5E1`, surface `#FFFFFF`, text `#0F172A`. Placeholder in `#94A3B8`.
- Focus state: `1px` solid `#1E40AF` with a `3px` focus ring halo in `rgba(30, 64, 175, 0.15)`.
- Error state: `1px` solid `#DC2626` with `3px` focus ring halo in `rgba(220, 38, 38, 0.15)`.

### Selection Controls (Checkboxes & Radios)

- Box size `18px`, border `1.5px` solid `#94A3B8`, radius `4px` for checkboxes, fully circular for radios.
- Selected state fills with `#1E40AF` with a white checkmark or center pip.

### Medical Cards

White card container (`#FFFFFF`), `1px` solid border (`#E2E8F0`), Level 1 ambient shadow. Padding `1.25rem`. Headers feature an upper flex row with patient avatar, demographic labels, and micro-status tag on the trailing edge.

### Tabular & Scheduling Components

- **Data Tables:** Alternating rows not required; distinct `#F8FAFC` sticky column headers, bottom row borders `1px` solid `#F1F5F9`. Font features monospace numbers (`tnum`).
- **Time Slot Pickers:** Compact tiles (`height: 36px`), rounded `6px`, `1px` border `#E2E8F0`, `#FFFFFF` fill. Selected state activates `#1E40AF` fill with white text. Unavailable slots are rendered with `#F1F5F9` background, `#94A3B8` text, and diagonal subtle strike line.
