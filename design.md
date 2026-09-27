---
name: Clinical Clarity
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#3f4850'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#707881'
  outline-variant: '#bfc7d2'
  surface-tint: '#006398'
  primary: '#006194'
  on-primary: '#ffffff'
  primary-container: '#007bb9'
  on-primary-container: '#fdfcff'
  inverse-primary: '#93ccff'
  secondary: '#006a61'
  on-secondary: '#ffffff'
  secondary-container: '#86f2e4'
  on-secondary-container: '#006f66'
  tertiary: '#0051d5'
  on-tertiary: '#ffffff'
  tertiary-container: '#316bf3'
  on-tertiary-container: '#fefcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cce5ff'
  primary-fixed-dim: '#93ccff'
  on-primary-fixed: '#001d31'
  on-primary-fixed-variant: '#004b73'
  secondary-fixed: '#89f5e7'
  secondary-fixed-dim: '#6bd8cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#dbe1ff'
  tertiary-fixed-dim: '#b4c5ff'
  on-tertiary-fixed: '#00174b'
  on-tertiary-fixed-variant: '#003ea8'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.025em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: -0.005em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system delivers a clinical, calming, and high-precision environment engineered for healthcare workflows across patients, practitioners, and administrative staff. The aesthetic bridges the functional utility of high-end enterprise software (Linear, Stripe) with the warm, reassuring clarity required in healthcare contexts. 

The emotional objective is absolute reassurance, cognitive ease, and frictionless efficiency. The design balances generous whitespace, pristine typographic hierarchy, structural grid discipline, and micro-elevation cues to eliminate anxiety during high-stakes booking, triage, and patient schedule management.

## Colors

The palette establishes an immediate sense of hygiene, trust, and clinical authority while avoiding sterile coldness.

- **Primary (`#0284C7`)**: Medical Sky/Ocean Blue, deployed for core interactive focal points, primary action buttons, key indicators, and active navigation items.
- **Secondary (`#0D9488`)**: Restorative Teal/Mint, representing healing, recovery, wellness markers, verified physician statuses, and auxiliary highlights.
- **Tertiary (`#2563EB`)**: Technical Sapphire Blue, applied to scheduling data tags, routine notifications, and calendar slot selections.
- **Neutral (`#0F172A`)**: Deep Slate Navy anchor for high-contrast, accessible typography against neutral surfaces.
- **Canvas & Containers**: Canvas sits on `#F8FAFC`, stepping into `#F1F5F9` for secondary structural rails and nested background panels. Surface containers are pure `#FFFFFF` bounded by crisp slate borders (`#E2E8F0`).
- **Functional Semantics**:
  - **Success / Available (`#16A34A`)**: Confirmed appointments, active provider statuses, and positive triage indicators.
  - **Warning / Pending (`#D97706`)**: Pending intake confirmations, awaiting payment, or rescheduling notices.
  - **Destructive / Urgent (`#DC2626`)**: Critical cancellations, contraindications, and emergency slot callouts.

## Typography

Typography prioritizes scan speed and instant legibility across dense medical charts, calendar matrices, and patient intake forms.

- **Headlines (`Plus Jakarta Sans`)**: Delivers subtle warmth, structural modernity, and authoritative character for dashboard headings, doctor profiles, and intake headers. Tighter letter-spacing creates cohesive, optical grouping.
- **Body & Labels (`Inter`)**: Deployed for dense information architecture, data tables, clinical notes, and form fields. Neutral rendering and uniform vertical metrics ensure numeric tables and schedule times line up cleanly.
- **Monospace Numeric Rule**: For medical stats, dosage values, time-stamps, and operational metrics, utilize tabular figures (`font-feature-settings: 'tnum' 1`) to guarantee perfect vertical alignment across lists and appointment grids.

## Layout & Spacing

The layout is built on a rigid 8px base rhythm that governs padding, layout blocks, and gaps. 

- **Grid Architecture**: Desktop platforms (Doctor/Admin/Staff portals) utilize a responsive 12-column fluid grid system bounded at a maximum container width of `1440px`. Mobile viewports compress to a single-column stack with an optional 4-column sub-grid for mini calendar selectors.
- **Breakpoints**:
  - **Mobile (< 768px)**: 16px outer margin, sticky bottom CTA sheets, vertically stacked appointment cards.
  - **Tablet (768px - 1024px)**: 24px outer margin, collapsible sidebar navigation, split-pane calendar schedule.
  - **Desktop (> 1024px)**: 32px outer margin, multi-pane views (persistent sidebar, main timeline, side contextual drawer).
- **Reflow Principles**: Critical patient vitals and schedule status badges remain pinned above the fold. Multi-step appointment flows collapse from multi-column stepper views into progressive vertical disclosures on mobile.

## Elevation & Depth

Elevation employs a hybrid model: structural low-contrast ghost borders paired with soft, cool-slate ambient shadows. This keeps the interface clinical and clutter-free without relying on heavy skeuomorphic shading.

- **Level 0 (Base Canvas)**: Flat `#F8FAFC` background; no shadow.
- **Level 1 (Cards & Panels)**: `#FFFFFF` surface, surrounded by a 1px border (`#E2E8F0`), elevated by `0 1px 2px 0 rgba(15, 23, 42, 0.04)`. Used for doctor cards, summary tiles, and calendar events.
- **Level 2 (Hover States & Active Selections)**: 1px border (`#CBD5E1`), elevated by `0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`.
- **Level 3 (Dropdowns & Popovers)**: 1px border (`#E2E8F0`), elevated by `0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.03)`.
- **Level 4 (Modals & Emergency Drawers)**: Pure white `#FFFFFF` overlay accompanied by a backdrop scrim (`rgba(15, 23, 42, 0.45)` with `4px` blur), elevated by `0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`.

## Shapes

The interface balances precision engineering with approachable care using standard medium roundedness:

- **Base Radius (`rounded-md` / 8px)**: Used for buttons, text inputs, dropdowns, and micro-badges to communicate reliability and structure.
- **Large Radius (`rounded-lg` / 16px)**: Applied to appointment cards, physician summary panels, calendar date pickers, and patient intake forms.
- **Extra Large Radius (`rounded-xl` / 24px)**: Reserved for primary modal containers, prominent booking summary panels, and onboarding sheets.
- **Full Pill (`rounded-full`)**: Strictly reserved for status chips (e.g., "Confirmed", "In-Progress"), avatar frames, and floating notification badges.

## Components

### Buttons
- **Primary**: Solid `#0284C7` background, white text, 8px corner radius, height 40px (desktop) / 48px (mobile). Subtly darkens to `#0369A1` on hover with a crisp 2px focus ring (`#0284C7` at 20% opacity with 2px offset).
- **Secondary**: Pure `#FFFFFF` background, 1px border (`#E2E8F0`), `#0F172A` text. Hover shifts background to `#F8FAFC` and border to `#CBD5E1`.
- **Destructive**: Solid `#DC2626` background, white text, or ghost outline with red text for low-priority destructive actions.

### Chips & Badges
- Status pills use light-tint backgrounds with dark semantic text to ensure WCAG AAA compliance:
  - **Confirmed**: Background `#F0FDF4`, text `#15803D`, dot indicator `#22C55E`.
  - **Pending**: Background `#FFFBEB`, text `#B45309`, dot indicator `#F59E0B`.
  - **Cancelled**: Background `#FEF2F2`, text `#B91C1C`, dot indicator `#EF4444`.
  - **Routine/Info**: Background `#EFF6FF`, text `#1D4ED8`, dot indicator `#3B82F6`.

### Input Fields & Selectors
- Standard height 40px, 8px corner radius, `#FFFFFF` background, 1px `#E2E8F0` border.
- Active focus triggers a 1px border transition to `#0284C7` accompanied by a 3px ring (`rgba(2, 132, 199, 0.15)`).
- Error states swap border to `#DC2626` with an accompanying inline subtext message and leading alert icon.

### Cards & Calendar Slot Pickers
- **Standard Card**: White `#FFFFFF` surface, 16px corner radius, 1px `#E2E8F0` border, padding `1.5rem`.
- **Time Slot Selector**: Interactive tile (height 44px, 8px radius). Default state uses `#F8FAFC` fill and `#E2E8F0` border. Selected state swaps to `#0284C7` background with `#FFFFFF` bold text and micro-elevation. Unavailable state renders with `#F1F5F9` background, muted `#94A3B8` strikethrough text, and `pointer-events: none`.

### Lists & Data Tables
- Row heights locked to 56px (compact) or 72px (detailed with patient subtext). Alternating row divider lines (1px `#F1F5F9`). Row hover triggers subtle `#F8FAFC` tinting with instant cursor feedback.

### Clinical Quick-Action Bar
- Fixed bottom on mobile, sticky floating top-right on desktop. Contains single-tap rescheduling, direct clinical messaging, and intake document uploading with clear visual hierarchy.