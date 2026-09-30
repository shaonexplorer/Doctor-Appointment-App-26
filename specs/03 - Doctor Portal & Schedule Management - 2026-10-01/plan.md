# Phase 3: Doctor Portal & Schedule Management — Implementation Plan

**Duration:** Weeks 9–12 (4 weeks)  
**Start Date:** 2026-10-01  
**End Date:** 2026-10-29  
**Status:** 🟡 Planned

---

## Overview

Empower doctors to manage schedules, conduct consultations, and access analytics through a comprehensive Doctor Portal. This phase builds on the foundation (Phase 1) and patient booking system (Phase 2) to provide doctor-facing tools.

---

## Week-by-Week Breakdown

### Week 9: Schedule Management & Doctor Portal Shell (2026-10-01 to 2026-10-07)

**Goal:** Core schedule management with bulk operations and portal navigation

#### Backend Deliverables
- [ ] **Schedules Module Enhancement** (`apps/api/src/modules/schedules/`)
  - `POST /api/schedules/doctor/bulk` — Bulk create slots (generation wizard)
  - `PATCH /api/schedules/doctor/bulk` — Bulk update slots (block, delete, change status)
  - `GET /api/schedules/doctor` — Doctor's full schedule with slots (weekly view)
  - Repository: `createManySlots()`, `updateManySlots()`, `findWeeklySchedule()`

- [ ] **Doctor Profile Module** (`apps/api/src/modules/doctors/`)
  - `GET /api/users/me/doctor-profile` — Doctor's own profile with stats, clinic info
  - `PATCH /api/users/me/doctor-profile` — Update doctor profile (bio, specialties, fees)

#### Frontend Deliverables
- [ ] **Doctor Portal Shell** (`apps/web/src/components/doctor-portal/`)
  - `DoctorPortalShell.tsx` — Main layout with routeMap, auto-active detection
  - `DoctorSidebar.tsx` — Collapsible desktop navigation (9 items)
  - `DoctorHeader.tsx` — Header with global search (⌘K), notifications, profile menu
  - `DoctorMobileSidebar.tsx` — Mobile drawer navigation
  - `DoctorMobileNav.tsx` — Bottom mobile navigation (4-column grid)
  - Route protection with `ProtectedRoute` (DOCTOR role)

- [ ] **Schedule Grid Component** (`apps/web/src/components/doctor-schedule/`)
  - `ScheduleGrid.tsx` — Weekly calendar grid with time slots
  - `SlotCell.tsx` — Individual slot with status (Available/Booked/Blocked)
  - `BulkActions.tsx` — Toolbar for bulk operations
  - `GenerateSlotsDialog.tsx` — Wizard: date range + recurring blocks + interval
  - `ScheduleLegend.tsx` — Status color legend

#### Integration
- [ ] TanStack Query hooks for schedule management
- [ ] Real-time slot status updates via polling/WebSocket

---

### Week 10: Appointment Management & Patient List (2026-10-08 to 2026-10-14)

**Goal:** Complete appointment lifecycle and patient directory for doctors

#### Backend Deliverables
- [ ] **Appointments Module Enhancement** (`apps/api/src/modules/appointments/`)
  - `GET /api/appointments/stats/doctor` — Doctor dashboard KPIs
  - `GET /api/appointments/doctor` — Doctor's appointments with filters (date, status, type)
  - `GET /api/appointments/doctor/:id` — Single appointment detail (with patient, prescription)
  - `PATCH /api/appointments/doctor/:id/cancel` — Cancel with refund trigger
  - `PATCH /api/appointments/doctor/:id/reschedule` — Reschedule to new slot
  - `PATCH /api/appointments/doctor/:id/check-in` — Patient check-in (staff-assisted)

- [ ] **Patients Module Enhancement** (`apps/api/src/modules/patients/`)
  - `GET /api/patients/doctor` — Doctor's patient list with search, condition, status filters
  - `GET /api/patients/doctor/:id` — Patient detail (medical history, prescriptions, appointments)

#### Frontend Deliverables
- [ ] **Appointments Components** (`apps/web/src/components/doctor-appointments/`)
  - `AppointmentTabs.tsx` — Tab navigation (Scheduled/Completed/Cancelled/No-Show)
  - `AppointmentTable.tsx` — Desktop table with sorting, pagination
  - `AppointmentCard.tsx` — Mobile card view
  - `AppointmentDrawer.tsx` — Slide-over detail panel
  - `CancelDialog.tsx` — Cancellation confirmation with reason
  - `RescheduleDialog.tsx` — Slot picker for rescheduling

- [ ] **Patients Components** (`apps/web/src/components/doctor-patients/`)
  - `PatientTable.tsx` — Desktop table with search, condition/status filters
  - `PatientCard.tsx` — Mobile card view
  - `PatientDrawer.tsx` — Detail drawer with medical history timeline
  - `PatientFilters.tsx` — Filter sidebar (search, condition, status, date range)

#### Integration
- [ ] Appointment pages: `/doctor/appointments`, `/doctor/appointments/[id]`
- [ ] Patients page: `/doctor/patients`, `/doctor/patients/[id]`
- [ ] Check-in workflow integration

---

### Week 11: Digital Prescription Builder & Consultation (2026-10-15 to 2026-10-21)

**Goal:** Prescription creation, PDF generation, and consultation workspace

#### Backend Deliverables
- [ ] **Prescriptions Module Enhancement** (`apps/api/src/modules/prescriptions/`)
  - `POST /api/prescriptions` — Create prescription (linked to appointment)
  - `GET /api/prescriptions/doctor/recent` — Doctor's recent prescriptions
  - `GET /api/prescriptions/:id/pdf` — Generate and serve PDF
  - PDF generation service (PDFKit or Puppeteer)
  - Structured medication schema: name, dosage, frequency, duration, instructions
  - Diagnosis + test recommendations fields

#### Frontend Deliverables
- [ ] **Prescription Components** (`apps/web/src/components/doctor-prescriptions/`)
  - `PrescriptionForm.tsx` — Medication form with dynamic rows
  - `MedicationRow.tsx` — Single medication entry (name, dosage, frequency, duration, instructions)
  - `PrescriptionPreview.tsx` — Print-ready preview with clinical formatting
  - `DiagnosisSection.tsx` — Diagnosis + test recommendations
  - `PrescriptionBuilder.tsx` — Composed builder with stepper

- [ ] **Consultation Components** (`apps/web/src/components/doctor-consultation/`)
  - `ConsultationSidebar.tsx` — Patient info, appointment context, vitals
  - `ConsultationNotes.tsx` — SOAP notes editor (Subjective, Objective, Assessment, Plan)
  - `PrescriptionBuilder.tsx` — Integrated prescription creation during consultation
  - `ConsultationWorkspace.tsx` — Composed layout for active consultation

#### Integration
- [ ] Prescriptions page: `/doctor/prescriptions`, `/doctor/prescriptions/new`
- [ ] Consultation page: `/doctor/consultation/[appointmentId]`
- [ ] PDF download/print functionality

---

### Week 12: Doctor Dashboard Analytics & Polish (2026-10-22 to 2026-10-29)

**Goal:** Analytics dashboards, final integration, testing, and accessibility

#### Backend Deliverables
- [ ] **Analytics Endpoints** (`apps/api/src/modules/appointments/stats/`)
  - `GET /api/appointments/stats/doctor/volume` — Daily/weekly patient volume (7/30 days)
  - `GET /api/appointments/stats/doctor/utilization` — Slot utilization breakdown
  - `GET /api/appointments/stats/doctor/revenue` — Revenue by consultation type
  - Aggregation queries with proper indexing

#### Frontend Deliverables
- [ ] **Dashboard Components** (`apps/web/src/components/doctor-dashboard/`)
  - `DoctorMetric.tsx` — KPI cards (Today's Appointments, Completed, Waiting, Revenue)
  - `ChartCard.tsx` — Chart container with title, subtitle, action slot
  - `UpcomingAppointments.tsx` — Desktop table + mobile cards
  - `ScheduleTimeline.tsx` — Visual timeline with colored status dots
  - `RecentPatients.tsx` — Table with avatars, diagnosis, visit date
  - `VolumeChart.tsx` — Recharts line chart (daily/weekly volume)
  - `UtilizationDonutChart.tsx` — Donut chart (Booked/Available/Cancelled)
  - `RevenueStackedBarChart.tsx` — Stacked bar (Follow-up/New/Video)
  - `QuickActions.tsx` — 4-action button grid
  - `Legend.tsx` — Reusable legend for charts

- [ ] **Dashboard Page** (`apps/web/src/app/doctor/dashboard/page.tsx`)
  - Wire all components with real data from TanStack Query
  - Responsive grid layout (12/8/4 columns)
  - Loading skeletons and error states

#### Cross-Cutting
- [ ] **Global Search** (`apps/web/src/components/global-search/`) — Adapt for doctor role
- [ ] **Notification Center** (`apps/web/src/components/notification-center/`) — Adapt for doctor role
- [ ] **Doctor Profile Page** (`apps/web/src/app/doctor/profile/page.tsx`) — Profile hero, about, clinic info, schedule calendar, reviews

#### Quality Assurance
- [ ] Unit tests >80% coverage (Vitest)
- [ ] Integration tests for API contracts
- [ ] E2E tests for critical flows (Playwright):
  - Schedule generation wizard
  - Appointment cancel/reschedule
  - Prescription creation → PDF download
  - Consultation workflow
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Responsive verification (mobile, tablet, desktop)
- [ ] Code review (2 reviewers)
- [ ] Deploy to staging with smoke tests

---

## Technical Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| `recharts` | ^2.12+ | Dashboard visualizations |
| `pdfkit` / `puppeteer` | Latest | PDF generation for prescriptions |
| `@tanstack/react-query` | ^5.0+ | Server state management (already in Phase 2) |
| `date-fns` | ^3.0+ | Date manipulation for schedules |
| `zod` | ^3.22+ | Validation schemas (shared package) |

---

## API Contract Summary

### Schedule Management
```
POST   /api/schedules/doctor/bulk        # Create slots in bulk
PATCH  /api/schedules/doctor/bulk        # Update slots in bulk
GET    /api/schedules/doctor             # Weekly schedule view
```

### Doctor Appointments
```
GET    /api/appointments/stats/doctor           # Dashboard KPIs
GET    /api/appointments/doctor                 # List with filters
GET    /api/appointments/doctor/:id             # Detail with patient/Rx
PATCH  /api/appointments/doctor/:id/cancel      # Cancel + refund
PATCH  /api/appointments/doctor/:id/reschedule  # Move to new slot
PATCH  /api/appointments/doctor/:id/check-in    # Patient check-in
```

### Doctor Patients
```
GET    /api/patients/doctor                 # Patient list with filters
GET    /api/patients/doctor/:id             # Patient detail + history
```

### Prescriptions
```
POST   /api/prescriptions                   # Create prescription
GET    /api/prescriptions/doctor/recent     # Recent prescriptions
GET    /api/prescriptions/:id/pdf           # Download PDF
```

### Analytics
```
GET    /api/appointments/stats/doctor/volume      # Patient volume chart data
GET    /api/appointments/stats/doctor/utilization # Slot utilization data
GET    /api/appointments/stats/doctor/revenue     # Revenue by type data
```

### Doctor Profile
```
GET    /api/users/me/doctor-profile         # Own profile with stats
PATCH  /api/users/me/doctor-profile         # Update profile
```

---

## Database Considerations

### Indexes Needed
- `schedules` table: `(doctor_id, date, start_time)` for weekly queries
- `appointments` table: `(doctor_id, status, appointment_date)` for filtered lists
- `prescriptions` table: `(doctor_id, created_at DESC)` for recent list
- Composite indexes for analytics aggregations

### Transaction Boundaries
- Bulk slot creation: Single transaction for atomicity
- Appointment cancellation: Transaction for slot release + appointment update + refund record
- Prescription creation: Transaction for prescription + appointment link + audit log

---

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Schedule conflicts during bulk creation | Medium | High | DB unique constraint on (doctor_id, date, start_time) + transaction rollback |
| PDF generation latency | Medium | Medium | Async generation with status polling; cache generated PDFs |
| Double-booking during reschedule | Low | High | Row-level locking (SELECT FOR UPDATE) on target slot |
| Large patient lists performance | Medium | Medium | Cursor-based pagination, database indexes |
| Prescription data integrity | Low | Critical | Zod validation + Prisma transactions + audit logging |

---

## Success Criteria

- [ ] Doctor can generate 30-day schedule in <30 seconds via wizard
- [ ] Appointment list loads <500ms with 100+ appointments
- [ ] Prescription creation to PDF download <3 seconds
- [ ] Dashboard charts render with real data <1 second
- [ ] Zero double-booking incidents under concurrent load
- [ ] All E2E tests passing on staging
- [ ] Accessibility score ≥95 (axe-core)
- [ ] TypeScript strict mode: zero errors
- [ ] ESLint: zero warnings/errors