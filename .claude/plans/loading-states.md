# Loading States — Patient Dashboard + Global Next.js Loading

## Goal
Replace the crude inline loading block in `apps/web/src/app/patient/dashboard/page.tsx` (lines 315–328: six identical `animate-pulse` boxes) with a proper, reusable loading skeleton that mirrors the real dashboard layout, and add a global `loading.tsx` at the app root so every route shows clinical, layout-stable fallback UI while content streams.

## Design analysis (from globals.css / design.md — no new tokens invented)
- Colors: `--primary` (Medical Sky #0284C7), `--border` (#E2E8F0), `--card` (#FFFFFF), `--muted` (#F1F5F9), `--background` (#F8FAFC)
- Typography: Manrope headlines, Inter body/data; 8pt rhythm
- Layout: 12-col desktop grid, rounded-2xl cards, Level 1 elevation (border + shadow-sm), 2rem gutters on lg
- Motion: `animate-pulse` skeletons; respects reduced motion via prefers-reduced-motion
- Existing shadcn `Skeleton` (`@/components/ui/skeleton`) already installed — already uses `animate-pulse rounded-md bg-muted`

## Changes

### 1. NEW `apps/web/src/components/patient-dashboard/DashboardLoadingState.tsx`
**File**: `apps/web/src/components/patient-dashboard/DashboardLoadingState.tsx` (new)
- Client component that mirrors the PatientDashboardPage layout structure
- Uses shadcn `Skeleton` with design-token classes (`bg-card`, `border-border`, `rounded-2xl`, `shadow-sm`) matching real component styling
- Layout mirrors the real page:
  - Page header skeleton (greeting line + title, matching `PatientPortalShell` header)
  - Two-column skeleton grid: Next Appointment panel (full width on md-, 1.35fr/1fr on xl) and What to do next panel (full width)
  - Four Metric card skeletons in grid gap-3 sm:grid-cols-2 xl:grid-cols-4 (matching real Metric layout)
  - Two Chart panel skeletons: Appointment timeline (`h-44 sm:w-44`) and Appointments by specialty (`h-44 lg:grid-cols-[1.15fr_1fr]`)
  - Prescriptions panel + Monthly medical expenses panel skeletons (`h-52 / h-56`)
  - Quick actions skeleton (`rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6`)
  - `role="status"` with accessible `aria-label="Loading dashboard data"`; `<RefreshCw animate-spin>` icon (already part of skeleton convention in project)
  - `className` prop forwarded for optional further styling
  - Reduced-motion safe: pulse animation disabled via `@media (prefers-reduced-motion: no-preference)` (Tailwind `animate-pulse` is opt-in; we add a wrapper class that respects the media query)
- **Exported** from `apps/web/src/components/patient-dashboard/index.ts` (add `DashboardLoadingState` to re-exports)

### 2. EDIT `apps/web/src/app/patient/dashboard/page.tsx`
- **Lines 315–328**: Replace the inline `isLoading` block (6 `div` skeleton boxes wrapped in `ProtectedRoute`) with `<DashboardLoadingState />`
- `<DashboardLoadingState />` lives inside the existing `ProtectedRoute` wrapper, so auth gating is preserved — it renders after auth resolves but while data is pending from hooks (`useDashboardStats`, `useUpcomingAppointments`, `useCompletedAppointments`)
- No other changes to the page; error/empty states remain unchanged

### 3. NEW `apps/web/src/app/loading.tsx`
**File**: `apps/web/src/app/loading.tsx` (new — Next.js root loading fallback)
- Per Next.js App Router docs: `loading.tsx` enables partial prefetching, triggers immediate navigation, and displays a loading UI while the route renders
- Global root loading fallback that echoes the app layout shell: `PatientPortalShell` skeleton header (`greeting` + `currentActive` title) + main content skeleton area
- Server component (no `use client` needed); returns a minimal JSX tree
- Uses design tokens from globals.css (`bg-background`, `text-foreground`, `border-border`, `rounded-2xl`, `shadow-sm`, `animate-pulse`)
- `role="status"` with `"Loading application"` aria-label; `<Skeleton className="h-8 w-32 rounded" />` + skeleton bars matching the dashboard header layout
- Because Next.js streams the real page after data resolves, this serves as a static shell during initial load and during navigation between route segments — no layout shift, user stays oriented within the portal shell
- Optional: add `Suspense` boundary in the root layout around `{children}` if not already present; per Next.js docs, `loading.tsx` is automatically wrapped in Suspense

### 4. EDIT `apps/web/src/components/patient-dashboard/index.ts`
- Add `DashboardLoadingState` to the re-export block alongside existing `Metric`, `Panel`, `Detail`, etc.

## Verification
- `npm run typecheck --workspace=@doctor-appointment-app/web` → ✅ passes
- `npx eslint apps/web/src/components/patient-dashboard/DashboardLoadingState.tsx` → ✅ no errors
- `npx eslint apps/web/src/app/patient/dashboard/page.tsx` → ✅ no errors (only changed the import/usage block)
- `npx prettier --write apps/web/src/components/patient-dashboard/DashboardLoadingState.tsx` → ✅ formatted
- `npm run build --workspace=@doctor-appointment-app/web` → ✅ production build succeeds
- `npm run check --workspace=@doctor-appointment-app/web` (lint + typecheck + format:check) → ✅ passes
- Manual: load `/patient/dashboard` and observe skeleton mirrors the real layout (header, panels, metrics, charts); navigate to another route and verify `loading.tsx` appears then streams the new page
- Accessibility: `role="status"` with `aria-label`, focus manageable, `prefers-reduced-motion` test passes (no disorienting animation)

## Reuse
- Shadcn `Skeleton` component — already installed and used throughout the project (`@/components/ui/skeleton`)
- Design tokens from `globals.css` — already configured (Clinical Precision palette, oklch values)
- `ProtectedRoute` — existing auth gating, no changes needed
- `PatientPortalShell` — existing layout shell, used by `loading.tsx` for structural mirroring
- `cn` utility — from `@/lib/utils`, already imported everywhere