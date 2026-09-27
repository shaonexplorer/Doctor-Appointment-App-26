# Phase 2: Doctor Discovery & Patient Portal — Implementation Plan

**Duration:** Weeks 5–8 (4 weeks)  
**Start Date:** 2026-09-27  
**Target Completion:** 2026-10-25  
**Status:** 🔄 In Progress

---

## Overview

Enable patients to find and book doctors through a comprehensive discovery and booking platform. This phase builds on the authentication foundation from Phase 1 to deliver the core patient-facing functionality.

> **⚠️ CRITICAL: Component Extraction Required**  
> All frontend components MUST be extracted from `screens/Patient Portal/` (5 pre-built design screens) and adapted to `apps/web/src/components/`. Do NOT create new components from scratch. See `CLAUDE.md` → "STRICT INSTRUCTION: Component Extraction from Design Screens" for full rules.

### Design Screens Available for Extraction
| Screen | Path | Key Components |
|--------|------|----------------|
| Patient Dashboard | `screens/Patient Portal/patient-dashboard.tsx` | `Metric`, `Panel`, `Detail`, `Reminder`, `Action`, `EmptyDashboardState`, `DashboardErrorState`, Timeline, Charts (PieChart, BarChart) |
| Patient Appointments | `screens/Patient Portal/patient-appointments.tsx` | `AppointmentCard`, `Status` chip, `AppointmentDrawer`, `CancelModal`, `EmptyState`, Tab navigation, Search/Filter |
| Patient Portal Shell | `screens/Patient Portal/patient-portal-shell.tsx` | Sidebar nav, Header (search/notifications/profile), Mobile nav, `Brand`, `Metric`, `Activity` |
| Patient Records | `screens/Patient Portal/patient-records.tsx` | Category nav, `PrescriptionList`, `DocumentPlaceholder`, `PrescriptionPreview`, `Info` cards |
| Patient Profile Settings | `screens/Patient Portal/patient-profile-settings.tsx` | `field` input, `toggle` switch, Avatar upload, Sections (personal/medical/notifications/privacy) |

---

## Week 5: Doctor Profile Management & Search Infrastructure ✅ COMPLETED

### Goals
- [x] Doctor profile CRUD operations (Admin/Staff create, Doctor updates own)
- [x] Full-text search across name, specialty, designation, symptoms
- [x] Doctor listing with filters (specialty, availability, fee range)
- [x] PostgreSQL full-text search setup with materialized views

### Backend Tasks

#### 1. Doctor Module (`apps/api/src/modules/doctors/`)
- [x] Create module structure: types, validators, services, controllers, routes
- [x] Implement `DoctorProfileService` with:
  - `createProfile()` — Admin/Staff only
  - `updateOwnProfile()` — Doctor only
  - `getProfileById()` — Public with schedule preview
  - `searchDoctors()` — Full-text search with filters
  - `listDoctors()` — Paginated listing with filters
- [x] Add Zod validators for:
  - Profile create/update (specialty, designation, experience, fee, bio, clinic address)
  - Search query params (q, specialty, minFee, maxFee, availability, page, limit)
- [x] Implement PostgreSQL full-text search using `tsvector`/`tsquery`
- [x] Create materialized view for optimized search performance
- [x] Add database indexes on searchable columns

#### 2. Database Schema Updates
- [x] Verify `DoctorProfile` model has all required fields
- [x] Add `search_vector` tsvector column for full-text search
- [x] Create GIN index on search_vector
- [x] Add trigger to auto-update search_vector on profile changes

#### 3. API Endpoints
```
GET    /api/doctors                    # List with filters & pagination
GET    /api/doctors/search             # Full-text search
GET    /api/doctors/:id                # Doctor detail with schedule
POST   /api/doctors/profile            # Create (Admin/Staff)
PATCH  /api/doctors/profile/me         # Update own (Doctor)
GET    /api/doctors/profile/me         # Get own profile (Doctor)
```

### Frontend Tasks (Component Extraction from `screens/Patient Portal/`)

#### 1. Extract & Adapt Reusable Components → `apps/web/src/components/`
- [x] **`DoctorCard`** — Extract from `patient-dashboard.tsx` `Metric` + `Action` patterns; props: photo, name, designation, specialty, rating, fee, nextAvailableSlot, onClick
- [x] **`SpecialtyChip`** — Extract from `patient-appointments.tsx` `Status` chip pattern; variants: specialty colors per design.md, size: sm/md
- [x] **`AvailabilityIndicator`** — Extract from `patient-dashboard.tsx` status indicators; real-time dot with pulse animation, states: available/pending/unavailable
- [x] **`FeeDisplay`** — Extract from `patient-dashboard.tsx` metric value formatting; formatted currency with consultation type label
- [x] **`SearchInput`** — Extract from `patient-portal-shell.tsx` `GlobalSearch` + `patient-appointments.tsx` search; debounced, with filter trigger
- [x] **`FilterSidebar`** — Extract from `patient-appointments.tsx` filter pattern; multi-select specialty, fee range slider, availability toggle
- [x] **`LoadingSkeleton`** — Extract from `patient-dashboard.tsx` pulse animation pattern; DoctorCard, SlotGrid, AppointmentCard variants
- [x] **`EmptyState`** — Extract from `patient-dashboard.tsx` `EmptyDashboardState` + `patient-appointments.tsx` `EmptyState`; configurable icon, title, description, action

#### 2. Doctor Search Page (`apps/web/src/app/doctors/search/`)
- [x] Compose `DoctorSearchPage` using extracted: `SearchInput`, `FilterSidebar`, `DoctorCard` grid, `EmptyState`, `LoadingSkeleton`
- [x] Infinite scroll / pagination with TanStack Query
- [x] Responsive: 4-col mobile, 8-col tablet, 12-col desktop (per design.md)

#### 3. Doctor Detail Page (`apps/web/src/app/doctors/[id]/`)
- [x] **`DoctorHero`** — Extract from `patient-portal-shell.tsx` avatar/name pattern; photo, name, designation, specialty chips, rating, clinic
- [x] **`DoctorAbout`** — Extract from `patient-records.tsx` `Info` card pattern; bio, experience, education, languages
- [x] **`ScheduleCalendar`** — Extract from `patient-portal-shell.tsx` booking flow calendar; weekly view (Mon-Sun), 7-day range
- [x] **`TimeSlotPicker`** — Extract/adapt from portal shell booking flow; 36px height, 6px radius, selected=Primary fill (per design.md)
- [x] Slot selection → navigate to booking flow (`/doctors/[id]/book?slotId=`)

---

## Week 6: Slot Availability & Booking Flow

### Goals
- [ ] Slot availability API with real-time status
- [ ] Booking flow: select slot → symptom notes → confirm
- [ ] Atomic slot locking (DB transaction) preventing double-booking
- [ ] Appointment confirmation + email/SMS notification stubs

### Backend Tasks

#### 1. Schedules Module (`apps/api/src/modules/schedules/`)
- [ ] Create module structure
- [ ] Implement `ScheduleService` with:
  - `getAvailableSlots(doctorId, dateRange)` — Returns slots with status
  - `lockSlot(slotId, patientId)` — Atomic row locking with SELECT FOR UPDATE
  - `releaseLock(slotId)` — Release lock on cancellation/timeout
  - `getSlotById(slotId)` — Slot details with doctor info
- [ ] Implement slot status transitions: AVAILABLE → LOCKED → BOOKED/CANCELLED

#### 2. Appointments Module (`apps/api/src/modules/appointments/`)
- [ ] Create module structure
- [ ] Implement `AppointmentService` with:
  - `createAppointment(patientId, slotId, symptomNotes)` — Within transaction
  - `getAppointmentById(appointmentId)` — With relations
  - `getPatientAppointments(patientId, filters)` — Paginated with status filter
  - `cancelAppointment(appointmentId, patientId)` — With 2-hour threshold check
- [ ] Add Zod validators for booking input (slotId, symptomNotes)

#### 3. Atomic Booking Transaction
```sql
BEGIN;
SELECT * FROM schedules WHERE id = $1 AND status = 'AVAILABLE' FOR UPDATE;
UPDATE schedules SET status = 'BOOKED', patient_id = $2 WHERE id = $1;
INSERT INTO appointments (slot_id, patient_id, symptoms, status) VALUES ($1, $2, $3, 'SCHEDULED');
COMMIT;
```

#### 4. API Endpoints
```
GET    /api/schedules/availability?doctorId=&from=&to=    # Available slots
POST   /api/appointments                                   # Book appointment
GET    /api/appointments/:id                               # Appointment details
GET    /api/appointments                                   # Patient appointment list
PATCH  /api/appointments/:id/cancel                        # Cancel (2hr threshold)
```

#### 5. Notification Stubs
- [ ] Create `NotificationService` with stub methods:
  - `sendBookingConfirmation(appointmentId)`
  - `sendBookingCancellation(appointmentId)`
  - `sendReminder24h(appointmentId)`
  - `sendReminder2h(appointmentId)`
- [ ] Queue-based architecture ready for BullMQ integration (Phase 6)

### Frontend Tasks (Component Extraction from `screens/Patient Portal/`)

#### 1. Extract & Adapt Reusable Components → `apps/web/src/components/`
- [ ] **`TimeSlotPicker`** — Extract from `patient-portal-shell.tsx` booking flow; 36px height, 6px radius, states: default/hover/selected/disabled, selected=Primary fill (#1E40AF)
- [ ] **`SlotGrid`** — Extract from `patient-dashboard.tsx` grid patterns; responsive: mobile 2-col, tablet 4-col, desktop 6-col, gap-3
- [ ] **`BookingStepper`** — Extract from `patient-portal-shell.tsx` step indicator; 4 steps (Slot → Symptoms → Confirm → Success), progress bar Primary color
- [ ] **`BookingSummary`** — Extract from `patient-appointments.tsx` `AppointmentDrawer` summary section; doctor, slot, fee, symptoms, clinic, edit links
- [ ] **`SymptomNotesField`** — Extract from `patient-profile-settings.tsx` `field` textarea pattern; max 1000 chars, character counter, optional
- [ ] **`ConfirmationModal`** — Extract from `patient-appointments.tsx` `CancelModal` pattern; adapted for booking confirmation with success state
- [ ] **`ToastNotification`** — Extract from `patient-dashboard.tsx` notice pattern; success/error variants, auto-dismiss, action button

#### 2. Booking Flow (`apps/web/src/app/doctors/[id]/book/`)
- [ ] **Step 1: Slot Selection** — Compose `SlotGrid` + `TimeSlotPicker` + `BookingStepper`, pre-selected slot from URL param
- [ ] **Step 2: Symptom Notes** — `SymptomNotesField` + `BookingStepper`, back navigation preserves slot selection
- [ ] **Step 3: Confirmation** — `BookingSummary` + `BookingStepper`, edit links return to previous steps with preserved state
- [ ] **Step 4: Success** — `ConfirmationModal` (success variant) with appointment ID, calendar download (.ics), next steps
- [ ] State management: React Context or URL state for step persistence

#### 3. Patient Appointments Page (`apps/web/src/app/patient/appointments/`)
- [ ] **`AppointmentTabs`** — Extract from `patient-appointments.tsx` tab navigation; Upcoming | Completed | Cancelled with counts
- [ ] **`AppointmentSearchFilter`** — Extract from `patient-appointments.tsx` search + filter; search input, specialty filter, date range
- [ ] **`AppointmentCard`** — Extract from `patient-appointments.tsx` `AppointmentCard`; props: appointment data, onView, onCancel, onReschedule, onDownloadPrescription
- [ ] **`AppointmentDrawer`** — Extract from `patient-appointments.tsx` `AppointmentDrawer`; full details, timeline, prescription download
- [ ] **`CancelModal`** — Extract from `patient-appointments.tsx` `CancelModal`; 2-hour threshold policy, refund eligibility, confirm/cancel
- [ ] **`RescheduleFlow`** — Compose: CancelModal → Doctor Search (pre-filtered) → Booking Flow (pre-selected doctor)

---

## Week 7: Patient Dashboard & Appointment Management

### Goals
- [ ] Patient dashboard: upcoming/completed/cancelled appointments
- [ ] Cancellation workflow with 2-hour threshold enforcement
- [ ] Dashboard analytics: upcoming visits timeline

### Backend Tasks

#### 1. Enhanced Appointments Queries
- [ ] Optimized queries for dashboard stats (counts by status)
- [ ] Upcoming appointments with doctor details for timeline
- [ ] Completed appointments with prescription links

#### 2. Patient Profile Module (`apps/api/src/modules/patients/`)
- [ ] Create module for patient-specific operations
- [ ] `getDashboardStats(patientId)` — Counts, next appointment, totals
- [ ] `getMedicalTimeline(patientId)` — Combined appointments + prescriptions

### Frontend Tasks (Component Extraction from `screens/Patient Portal/`)

#### 1. Extract & Adapt Reusable Components → `apps/web/src/components/`
- [ ] **`KPICard`** — Extract from `patient-dashboard.tsx` `Metric`; props: label, value, icon, tone (color variant), trend?
- [ ] **`DashboardPanel`** — Extract from `patient-dashboard.tsx` `Panel`; title, action button, children slot
- [ ] **`Timeline`** — Extract from `patient-dashboard.tsx` timeline section; vertical, date markers, status chips, icons
- [ ] **`QuickActionGrid`** — Extract from `patient-dashboard.tsx` `Action` + `patient-portal-shell.tsx` quick actions; 4-col grid, icon + label + chevron
- [ ] **`ActivityFeed`** — Extract from `patient-portal-shell.tsx` `Activity` + `patient-dashboard.tsx` reminders; icon, title, detail, timestamp
- [ ] **`SpecialtyPieChart`** — Extract from `patient-dashboard.tsx` PieChart; Recharts, inner radius 52, outer 74, Clinical Precision colors
- [ ] **`ExpenseBarChart`** — Extract from `patient-dashboard.tsx` BarChart; Recharts, rounded bars, currency formatter
- [ ] **`StatusDonutChart`** — New from `patient-dashboard.tsx` chart patterns; appointment status distribution
- [ ] **`ComplianceTracker`** — New from `patient-dashboard.tsx` reminder patterns; prescription compliance indicator

#### 2. Patient Dashboard (`apps/web/src/app/patient/dashboard/`)
- [ ] Compose `PatientDashboard` using: `KPICard`×4, `DashboardPanel` (Next Appointment + What To Do Next), `DashboardPanel` (Timeline + Specialty Pie), `DashboardPanel` (Prescriptions + Expenses), `QuickActionGrid`
- [ ] Data fetching: TanStack Query for dashboard stats, timeline, prescriptions, expenses
- [ ] Loading states: `LoadingSkeleton` for each panel
- [ ] Error state: `DashboardErrorState` from `patient-dashboard.tsx`
- [ ] Empty state: `EmptyDashboardState` from `patient-dashboard.tsx`
- [ ] Refresh button with loading indicator

#### 3. Medical Records / Prescriptions (`apps/web/src/app/patient/records/`)
- [ ] **`CategoryNavigation`** — Extract from `patient-records.tsx` sidebar nav; Prescriptions | Diagnostic Reports | Lab Results | Visit History
- [ ] **`DocumentList`** — Extract from `patient-records.tsx` `PrescriptionList`; generic for any document type, search, upload button
- [ ] **`DocumentPreviewModal`** — Extract from `patient-records.tsx` `PrescriptionPreview`; medication table, test recommendations, print/download
- [ ] **`DocumentPlaceholder`** — Extract from `patient-records.tsx` `DocumentPlaceholder`; empty state with upload CTA
- [ ] Compose `PatientRecords` page with category nav + dynamic content

#### 4. Profile & Settings (`apps/web/src/app/patient/profile/`, `/settings/`)
- [ ] **`FormField`** — Extract from `patient-profile-settings.tsx` `field`; label, input, type, disabled, validation
- [ ] **`ToggleSwitch`** — Extract from `patient-profile-settings.tsx` `toggle`; label, description, value, onChange, disabled
- [ ] **`AvatarUpload`** — Extract from `patient-profile-settings.tsx` avatar section; preview, camera icon, file input
- [ ] **`Section`** — Extract from `patient-profile-settings.tsx` section pattern; title, description, icon, children
- [ ] Compose `PatientProfile` (personal + medical info) and `PatientSettings` (account, notifications, privacy)

---

## Week 8: Polish, Testing & Integration

### Goals
- [ ] Search and filter performance <300ms
- [ ] Zero double-booking incidents under load
- [ ] E2E tests for critical user flows
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Documentation

### Backend Tasks

#### 1. Performance Optimization
- [ ] Add Redis caching for doctor search results (TTL: 5 min)
- [ ] Add Redis caching for slot availability (TTL: 30 sec)
- [ ] Database query optimization (EXPLAIN ANALYZE)
- [ ] Connection pooling verification

#### 2. Load Testing
- [ ] Simulate concurrent booking attempts on same slot
- [ ] Verify zero double-bookings under 100 concurrent users
- [ ] Search latency under load

#### 3. Security Hardening
- [ ] Rate limiting on booking endpoints (10 req/min per user)
- [ ] Input sanitization on symptom notes
- [ ] Audit logging for all booking actions

### Frontend Tasks (Component Extraction from `screens/Patient Portal/`)

#### 1. Extract & Polish Remaining Components
- [ ] **`ErrorBoundary`** — Wrap booking flow, dashboard, appointments; fallback UI with retry
- [ ] **`ToastProvider` + `useToast`** — Extract from `patient-dashboard.tsx` notice pattern; context-based, multiple positions, auto-dismiss
- [ ] **`PageLoadingSkeleton`** — Full-page skeleton for each route (search, detail, booking, dashboard, appointments, records)
- [ ] **`ResponsiveContainer`** — Extract from `patient-portal-shell.tsx` main content wrapper; 4/8/12 col breakpoints, max-w-[1440px]
- [ ] **`MobileBottomNav`** — Extract from `patient-portal-shell.tsx` bottom nav; 5 items, active state, safe-area-inset

#### 2. Testing
- [ ] **Unit Tests (Vitest)** — Each extracted component:
  - `DoctorCard`, `SpecialtyChip`, `AvailabilityIndicator`, `FeeDisplay`
  - `TimeSlotPicker`, `SlotGrid`, `BookingStepper`, `BookingSummary`
  - `AppointmentCard`, `AppointmentTabs`, `CancelModal`
  - `KPICard`, `Timeline`, `QuickActionGrid`, `SpecialtyPieChart`, `ExpenseBarChart`
  - `FormField`, `ToggleSwitch`, `AvatarUpload`, `CategoryNavigation`
- [ ] **Integration Tests (MSW)** — API contracts for:
  - Doctor search/list/detail
  - Slot availability
  - Booking flow (create, confirm)
  - Appointments CRUD
  - Dashboard stats, timeline, prescriptions, expenses
- [ ] **E2E Tests (Playwright)** — Critical flows:
  - Search → Filter → Select Doctor → Select Slot → Symptoms → Confirm → Success
  - Double-booking attempt (2 users, same slot) → only one succeeds
  - Cancel appointment within 2 hours → fee forfeit warning
  - Cancel appointment >2 hours → full refund
  - Dashboard loads with correct KPIs, timeline, charts
  - Records: category nav → list → preview → download

#### 3. Accessibility Audit (WCAG 2.1 AA)
- [ ] **Semantic HTML** — All pages: proper heading hierarchy, landmarks, lists
- [ ] **Keyboard Navigation** — Tab order, focus visible, skip links, modal focus trap
- [ ] **ARIA** — Labels on all interactive elements, live regions for toasts, dialog roles
- [ ] **Color Contrast** — Verify all Clinical Precision tokens meet 4.5:1 (text) / 3:1 (UI)
- [ ] **Screen Reader** — NVDA/VoiceOver testing: announcements, form labels, status changes
- [ ] **Responsive** — 4-col mobile, 8-col tablet, 12-col desktop; touch targets ≥44px

#### 4. Polish & Integration
- [ ] **Error Boundaries** — Per-route boundaries with `DashboardErrorState` fallback
- [ ] **Toast System** — Global provider, success/error/info variants, action buttons
- [ ] **Loading States** — All async: skeletons, spinners, disabled states
- [ ] **Responsive Verification** — All pages at 375px, 768px, 1024px, 1440px
- [ ] **Cross-browser** — Chrome, Firefox, Safari, Edge (latest 2 versions)
- [ ] **Performance** — Lighthouse >90, bundle analysis, chunk splitting
- [ ] **Documentation** — Component stories (Storybook), API docs (OpenAPI), README updates

---

## Deliverables Checklist

| Deliverable | Target | Status |
|-------------|--------|--------|
| Doctor search with full-text & filters | Week 5 | ⬜ |
| Doctor detail page with schedule | Week 5 | ⬜ |
| Real-time slot availability API | Week 6 | ⬜ |
| Atomic booking with double-book prevention | Week 6 | ⬜ |
| Multi-step booking flow UI | Week 6 | ⬜ |
| Patient appointment management | Week 7 | ⬜ |
| Patient dashboard with timeline | Week 7 | ⬜ |
| Medical records / prescriptions | Week 7 | ⬜ |
| Profile & settings pages | Week 7 | ⬜ |
| Search performance <300ms | Week 8 | ⬜ |
| Zero double-booking under load | Week 8 | ⬜ |
| E2E tests for booking flow | Week 8 | ⬜ |
| Accessibility audit passed | Week 8 | ⬜ |
| All components extracted from design screens | Week 8 | ⬜ |

---

## Technical Decisions

| Decision | Rationale |
|----------|-----------|
| PostgreSQL full-text search (tsvector) | Native, no external dependency, good for <100k records |
| SELECT FOR UPDATE for slot locking | ACID guarantee, simple, handles race conditions |
| Materialized view for search | Pre-computed results for <300ms latency |
| Redis caching layer | Reduce DB load, improve response times |
| Notification stubs | Decouple from external providers, ready for Phase 6 |

---

## Dependencies

- **Phase 1 Complete**: Authentication, RBAC, User/Doctor models
- **Database**: PostgreSQL 16+ with full-text search extensions
- **Redis**: For caching and rate limiting
- **Design System**: Clinical Precision tokens from `design.md`

---

## Component Extraction Implementation Order

| Week | Phase | Components to Extract | Source Screen |
|------|-------|----------------------|---------------|
| **5** | Search Infrastructure | `DoctorCard`, `SpecialtyChip`, `AvailabilityIndicator`, `FeeDisplay`, `SearchInput`, `FilterSidebar`, `LoadingSkeleton`, `EmptyState` | `patient-dashboard.tsx`, `patient-appointments.tsx`, `patient-portal-shell.tsx` |
| **6** | Booking Flow | `TimeSlotPicker`, `SlotGrid`, `BookingStepper`, `BookingSummary`, `SymptomNotesField`, `ConfirmationModal`, `ToastNotification`, `AppointmentTabs`, `AppointmentSearchFilter`, `AppointmentCard`, `AppointmentDrawer`, `CancelModal`, `RescheduleFlow` | `patient-portal-shell.tsx`, `patient-appointments.tsx`, `patient-dashboard.tsx` |
| **7** | Dashboard & Records | `KPICard`, `DashboardPanel`, `Timeline`, `QuickActionGrid`, `ActivityFeed`, `SpecialtyPieChart`, `ExpenseBarChart`, `StatusDonutChart`, `ComplianceTracker`, `CategoryNavigation`, `DocumentList`, `DocumentPreviewModal`, `DocumentPlaceholder`, `FormField`, `ToggleSwitch`, `AvatarUpload`, `Section` | `patient-dashboard.tsx`, `patient-records.tsx`, `patient-profile-settings.tsx`, `patient-portal-shell.tsx` |
| **8** | Polish & Testing | `ErrorBoundary`, `ToastProvider`/`useToast`, `PageLoadingSkeleton`, `ResponsiveContainer`, `MobileBottomNav` + all unit/integration/E2E tests + accessibility audit | `patient-dashboard.tsx`, `patient-portal-shell.tsx` |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Double-booking race conditions | DB-level row locking + optimistic concurrency |
| Search performance at scale | PostgreSQL full-text search + materialized views + Redis cache |
| Slot availability stale data | Short TTL (30s) + WebSocket updates (future) |
| Component duplication | Mandatory extraction from `screens/Patient Portal/` before creating new |
| Design system drift | All extracted components mapped to Clinical Precision tokens |
| Accessibility gaps | WCAG 2.1 AA audit in Week 8, screen reader testing |

---

## Definition of Done

- [ ] All API endpoints implemented with validation
- [ ] Unit tests >80% coverage for services
- [ ] Integration tests for API contracts
- [ ] E2E tests for booking flow (Playwright)
- [ ] Search latency <300ms (p95)
- [ ] Zero double-bookings in load test (100 concurrent)
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] Code review approved (2 reviewers)
- [ ] Deployed to staging with smoke tests passing
- [ ] Documentation updated (API docs, component stories)