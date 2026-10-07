# Phase 4: Patient History & Reporting — Implementation Plan

**Duration:** Weeks 13–16 (4 weeks)  
**Start Date:** 2026-10-07  
**End Date:** 2026-11-04  
**Status:** 🟢 Week 1 Start — Week 2 In Progress — Week 3 In Progress — Week 4 Complete

---

## Overview

Comprehensive patient health records and insights system, enabling patients to view their complete medical history, prescriptions, and diagnostic reports. This phase builds on the patient booking system (Phase 2) and doctor portal (Phase 3) to provide patient-facing health portfolio and analytics.

---

## Week-by-Week Breakdown

### Week 1: Medical History Timeline & Dashboard Foundation (2026-10-07 to 2026-10-13)

**Goal:** Core medical history timeline and dashboard analytics framework

#### Backend Deliverables
- [ ] **Patients Module Enhancement** (`apps/api/src/modules/patients/`)
  - `GET /api/patients/timeline` — Medical timeline (appointments + prescriptions + diagnoses)
  - `GET /api/patients/appointments/upcoming` — Upcoming appointments with details
  - `GET /api/patients/appointments/completed` — Completed appointments with prescriptions
  - `GET /api/patients/dashboard/stats` — Dashboard KPIs, charts data
  - Repository: `buildPatientTimeline()`, `getAppointmentsByStatus()`, `calculateDashboardStats()`
- [ ] **Prescriptions Module** (`apps/api/src/modules/prescriptions/`)
  - `GET /api/prescriptions/patient` — Patient's prescription list
  - Repository: `getPatientPrescriptions()`, `formatPrescriptionForPDF()`
- [ ] **Diagnostic Reports** (`apps/api/src/modules/reports/`) — New module
  - `POST /api/reports` — Upload diagnostic report
  - `GET /api/reports/patient` — Patient's diagnostic reports list
  - Repository: `uploadReport()`, `getPatientReports()`, `validateReportFormat()`

#### Frontend Deliverables
- [ ] **MedicalTimeline Component** (`apps/web/src/components/patients/medical-history/`)
  - `MedicalTimeline.tsx` — Chronological timeline of appointments and prescriptions
  - `TimelineEntry.tsx` — Single appointment/prescription entry with status badge
  - `PrescriptionEntry.tsx` — Prescription card with medication summary
- [ ] **Patient Dashboard** (`apps/web/src/app/patients/dashboard/page.tsx`)
  - KPI cards: Total appointments, completed rate, active prescriptions, upcoming visits
  - Chart containers: Pie chart (appointments by specialty), Bar chart (monthly expenses)
  - Loading skeletons and error states
- [ ] **UpcomingVisits Component** (`apps/web/src/components/patients/upcoming-visits/`)
  - `UpcomingVisits.tsx` — List of upcoming appointments with date/time
  - `VisitCard.tsx` — Card view with patient, doctor, and reason

#### Integration
- [ ] TanStack Query hooks for patient data (`usePatientTimeline.ts`, `usePatientDashboard.ts`)
- [ ] API client functions (`lib/api.ts` - patientApi, reportApi)
- [ ] Route protection with PATIENT role

---

### Week 2: Prescription List & PDF Download (2026-10-14 to 2026-10-20)

**Goal:** Prescription listing with downloadable PDFs and diagnostic report management

#### Backend Deliverables
- [ ] **Prescriptions Module Enhancement**
  - `GET /api/prescriptions/patient` — Patient's full prescription list with details
  - `GET /api/prescriptions/:id/pdf` — Generate and serve PDF for specific prescription
  - PDF generation service (PDFKit) with professional medical formatting
  - Structured medication schema: name, dosage, frequency, duration, instructions
  - Diagnosis + test recommendations fields
- [ ] **Diagnostic Reports Module**
  - `GET /api/reports/:id` — View diagnostic report details
  - Supporting storage for uploaded report files

#### Frontend Deliverables
- [ ] **PrescriptionList Component** (`apps/web/src/components/patients/prescriptions/`)
  - `PrescriptionList.tsx` — List of prescriptions with status filters
  - `PrescriptionCard.tsx` — Card view with medication summary and PDF download button
  - `PrescriptionPDFPreview.tsx` — PDF preview with iframe (print/download)
- [ ] **ReportViewer Component** (`apps/web/src/components/patients/reports/`)
  - `ReportViewer.tsx` — Display diagnostic report with scrollable view
  - `ReportDownloadBtn.tsx` — Download button for report PDF

#### Integration
- [ ] TanStack Query hooks for prescriptions (`usePatientPrescriptions.ts`)
- [ ] PDF download/print functionality with progress state
- [ ] API client functions for reports (`lib/api.ts`)

---

### Week 3: Patient Dashboard Analytics & Data Export (2026-10-21 to 2026-10-27)

**Goal:** Advanced analytics charts and data export functionality

#### Backend Deliverables
- [ ] **Analytics Endpoints** (`apps/api/src/modules/patients/analytics/`)
  - `GET /api/patients/analytics/specialty-breakdown` — Appointments by specialty (Pie chart data)
  - `GET /api/patients/analytics/monthly-expenses` — Monthly medical expenses (Bar chart data)
  - `GET /api/patients/analytics/compliance` — Prescription compliance tracking data
  - `GET /api/patients/analytics/upcoming-visit-timeline` — Upcoming visit timeline data
  - Aggregation queries with proper indexing
- [ ] **Data Export** (`apps/api/src/modules/patients/export/`)
  - `GET /api/patients/export/pdf` — Export complete patient health portfolio as PDF
  - `GET /api/patients/export/csv` — Export patient data as CSV

#### Frontend Deliverables
- [ ] **SpecialtyBreakdown Chart** (`apps/web/src/components/patients/analytics/`)
  - `SpecialtyPieChart.tsx` — Recharts pie chart: appointments by specialty
- [ ] **MonthlyExpenses Bar Chart** (`apps/web/src/components/patients/analytics/`)
  - `MonthlyExpensesBar.tsx` — Recharts bar chart: monthly medical expenses
- [ ] **PrescriptionCompliance Tracker** (`apps/web/src/components/patients/analytics/`)
  - `PrescriptionCompliance.tsx` — Compliance rate visualization and tracking
- [ ] **Data Export Panel** (`apps/web/src/components/patients/export/`)
  - `ExportPanel.tsx` — UI for selecting PDF/CSV export
  - `ExportStatus.tsx` — Progress indicator for export operations

#### Integration
- [ ] TanStack Query hooks for analytics (`usePatientAnalytics.ts`)
- [ ] Data export functionality with progress tracking
- [ ] API client functions (`lib/api.ts` - patientAnalyticsApi, exportApi)

#### Cross-Cutting
- [ ] HIPAA-compliant data handling throughout
- [ ] Accessibility audit for all new components (WCAG 2.1 AA)
- [ ] Responsive design for all breakpoints (4/8/12 column grid)

---

### Week 4: Polish, Testing, and Staging Deployment (2026-10-28 to 2026-11-04)

**Goal:** Final integration, comprehensive testing, and staging deployment

#### Backend Deliverables
- [ ] **Performance Optimization**
  - Database indexing for analytics aggregation queries
  - Query performance tuning for timeline and export operations
- [ ] **Security Hardening**
  - PHI access audit logging for all patient data queries
  - Role-based access validation (PATIENT role minimum)
  - Input validation and sanitization on all new endpoints

#### Frontend Deliverables
- [ ] **Complete Patient Portal Integration**
  - Medical history timeline fully wired with real data
  - Analytics charts rendering with real data from TanStack Query
  - Data export functionality end-to-end
- [ ] **Quality Assurance**
  - Unit tests >80% coverage (Vitest)
  - Integration tests for API contracts
  - E2E tests for critical user flows (Playwright):
    - Complete medical history navigation
    - Prescription PDF download workflow
    - Data export (PDF/CSV)
    - Dashboard analytics interaction
  - Accessibility audit passed (WCAG 2.1 AA)
  - Responsive verification (mobile, tablet, desktop)
  - Code review (2 reviewers)

#### Deployment
- [ ] Deploy to staging with smoke tests passing
- [ ] Performance benchmarks validated under expected load
- [ ] Monitoring and alerting configured
- [ ] Rollback procedures tested and validated

---

## Technical Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| `recharts` | ^2.12+ | Dashboard visualizations |
| `pdfkit` | Latest | PDF generation for prescriptions and exports |
| `@tanstack/react-query` | ^5.0+ | Server state management (already in Phase 2) |
| `date-fns` | ^3.0+ | Date manipulation for timelines and analytics |
| `zod` | ^3.22+ | Validation schemas (shared package) |
| `jsPDF` / `jsPDF-autotable` | Latest | PDF generation with tables for exports |
| `xlsx` | ^0.18+ | CSV export functionality |

---

## API Contract Summary

### Medical History Timeline
```
GET    /api/patients/timeline           # Medical timeline (appointments + prescriptions + diagnoses)
GET    /api/patients/appointments/upcoming  # Upcoming appointments with details
GET    /api/patients/appointments/completed   # Completed appointments with prescriptions
GET    /api/patients/dashboard/stats      # Dashboard KPIs, charts data
```

### Prescription Management
```
GET    /api/prescriptions/patient       # Patient's prescription list
GET    /api/prescriptions/:id/pdf       # Generate and serve PDF for prescription
```

### Diagnostic Reports
```
POST   /api/reports                     # Upload diagnostic report
GET    /api/reports/patient             # Patient's diagnostic reports list
GET    /api/reports/:id                 # View diagnostic report details
```

### Analytics
```
GET    /api/patients/analytics/specialty-breakdown   # Appointments by specialty (Pie chart data)
GET    /api/patients/analytics/monthly-expenses      # Monthly medical expenses (Bar chart data)
GET    /api/patients/analytics/compliance            # Prescription compliance tracking data
GET    /api/patients/analytics/upcoming-visit-timeline # Upcoming visit timeline data
```

### Data Export
```
GET    /api/patients/export/pdf           # Export complete patient health portfolio as PDF
GET    /api/patients/export/csv           # Export patient data as CSV
```

### Database Considerations

#### Indexes Needed
- `appointments` table: `(patient_id, appointment_date)` for timeline queries
- `prescriptions` table: `(patient_id, created_at DESC)` for prescription list
- `reports` table: `(patient_id, created_at DESC)` for report listing
- Composite indexes for analytics aggregations

#### Transaction Boundaries
- Prescription creation: Transaction for prescription + appointment link + audit log
- Report upload: Transaction for report metadata + patient linkage
- Analytics aggregation: Read-only, optimized queries with proper indexes

---

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| PHI exposure in analytics | Low | Critical | Strict role-based access, audit logging, data minimization |
| PDF generation latency | Medium | Medium | Async generation with status polling; cache generated PDFs |
| Data export size limits | Low | Medium | Chunked export, partial exports, streaming downloads |
| Timeline data inconsistency | Medium | Medium | Transaction-based data retrieval, snapshot isolation for exports |

---

## Success Criteria

- [ ] Patient can view complete medical history timeline (appointments, prescriptions, diagnoses)
- [ ] Prescription list with downloadable PDFs works correctly
- [ ] Diagnostic reports upload and view successfully
- [ ] Patient dashboard analytics render with real data
- [ ] Data export (PDF/CSV) produces complete and accurate patient health portfolio
- [ ] All API responses within required timeframes (<500ms for lists, <1s for charts)
- [ ] WCAG 2.1 AA accessibility compliance verified
- [ ] All PHI access is properly audited and logged
- [ ] TypeScript strict mode: zero errors
- [ ] ESLint: zero warnings/errors
- [ ] Deploy to staging with smoke tests passing