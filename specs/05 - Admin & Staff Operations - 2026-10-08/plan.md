# Phase 5: Admin & Staff Operations — Implementation Plan

**Duration:** Weeks 17–20 (4 weeks)  
**Start Date:** 2026-10-08  
**End Date:** 2026-11-04  
**Status:** 🟢 Week 1 Pending — Week 2 Pending — Week 3 Pending — Week 4 Pending

---

## Overview

Platform administration and front-desk tooling enabling clinic administrators and staff to manage the healthcare platform, configure business rules, monitor operations, and assist patients. This phase builds on the complete patient booking system (Phase 2), doctor portal (Phase 3), and patient history system (Phase 4) to provide administrative control and staff efficiency tools.

---

## Week-by-Week Breakdown

### Week 1: Admin Dashboard & Platform Metrics (2026-10-08 to 2026-10-14)

**Goal:** Core admin dashboard with platform-wide metrics and user management

#### Backend Deliverables
- [ ] **Admin Module** (`apps/api/src/modules/admin/`)
  - `GET /api/admin/dashboard` — Platform metrics (active users, appointments, revenue, staff count)
  - `GET /api/admin/users` — List all users with role-based filtering and pagination
  - `PATCH /api/admin/users/:id` — Update user role (assign/revoke ADMIN/STAFF/DOCTOR/PATIENT)
  - `GET /api/admin/audit-logs` — Audit log listings with filtering and pagination
  - Repository: `getPlatformMetrics()`, `listUsers()`, `updateUserRole()`, `filterAuditLogs()`

- [ ] **System Settings API** (`apps/api/src/settings/`)
  - `GET /api/settings` — Retrieve all system configuration values
  - `PATCH /api/settings` — Update system configuration (slot intervals, cancellation policies, notification templates)
  - Repository: `getAllSettings()`, `updateSetting()`

#### Frontend Deliverables
- [ ] **AdminDashboard** (`apps/web/src/components/admin/dashboard/`)
  - KPI Cards: Total registered users, active appointments today, total revenue, pending prescriptions
  - Charts: Daily appointment trends, user role distribution, appointment status breakdown
  - Recent activity feed (last 24 hours)
  - Quick stats with comparison to previous period

- [ ] **UserManagement** (`apps/web/src/components/admin/users/`)
  - `UserTable.tsx` — Table with search, role filter, pagination, role assignment controls
  - `RoleAssignmentDialog.tsx` — Modal for assigning/revoking user roles
  - Bulk role assignment capability

- [ ] **AuditLogs** (`apps/web/src/components/admin/audit-logs/`)
  - `AuditLogTable.tsx` — Log entries with user, action, timestamp, resource type, details
  - Filtering by date range, action type, user role, resource type
  - Export functionality for audit logs

#### Integration
- [ ] TanStack Query hooks: `useAdminDashboard.ts`, `useAdminUsers.ts`, `useAuditLogs.ts`
- [ ] API client functions (`lib/api.ts` - adminApi, settingsApi)
- [ ] Route protection with ADMIN role

---

### Week 2: Clinic/Department Setup & Staff Tools (2026-10-15 to 2026-10-21)

**Goal:** Clinic/department configuration and staff booking interface

#### Backend Deliverables
- [ ] **Clinic/Department Module** (`apps/api/src/modules/clinics/`)
  - `GET /api/clinics` — List all clinics/departments
  - `POST /api/clinics` — Create new clinic/department
  - `PATCH /api/clinics/:id` — Update clinic information
  - `DELETE /api/clinics/:id` — Soft-delete clinic (set inactive)
  - Repository: `createClinic()`, `getClinics()`, `updateClinic()`, `softDeleteClinic()`

- [ ] **Staff Booking Interface** (`apps/api/src/modules/staff-bookings/`)
  - `POST /api/staff-bookings` — Create appointment on behalf of a patient
  - `GET /api/staff-bookings/available-slots` — Available slots for staff booking
  - `GET /api/staff-bookings/patient-appointments` — Patient's existing appointments
  - Repository: `createStaffBooking()`, `getAvailableSlots()`, `getPatientAppointments()`

#### Frontend Deliverables
- [ ] **ClinicManagement** (`apps/web/src/components/admin/clinics/`)
  - `ClinicTable.tsx` — Table with search, status toggle, action buttons
  - `CreateClinicDialog.tsx` — Modal for creating new clinic
  - `ClinicDetailDialog.tsx` — Modal for editing clinic information

- [ ] **StaffBookingInterface** (`apps/web/src/components/staff/booking/`)
  - `StaffBookingForm.tsx` — Form for staff to book appointments on behalf of patients
    - Patient selector (search/select)
    - Doctor selector
    - Slot picker from available slots
    - Symptom notes field (optional)
    - Payment status configuration
  - `BookingConfirmation.tsx` — Confirmation dialog after staff booking

- [ ] **Staff Dashboard** (`apps/web/src/components/staff/dashboard/`)
  - KPI Cards specific to staff workflow
  - Quick actions: New staff booking, Check-in patient, View today's appointments
  - Patient queue view

#### Integration
- [ ] TanStack Query hooks: `useClinics.ts`, `useStaffBookings.ts`, `useStaffDashboard.ts`
- [ ] API client functions (`lib/api.ts` - clinicsApi, staffBookingsApi)
- [ ] Route protection with ADMIN/STAFF roles

---

### Week 3: Patient Check-in Kiosk & Billing Support (2026-10-22 to 2026-10-28)

**Goal:** Patient check-in kiosk mode and billing/payment support

#### Backend Deliverables
- [ ] **Check-in Module** (`apps/api/src/modules/checkin/`)
  - `POST /api/checkin` — Record patient check-in for appointment
  - `PATCH /api/checkin/appointment/:id` — Update appointment status to checked-in
  - `GET /api/checkin/appointment/:id` — Retrieve appointment details for check-in
  - Repository: `recordCheckIn()`, `getCheckInAppointment()`

- [ ] **Billing & Payments Module** (`apps/api/src/modules/billing/`)
  - `GET /api/billing/appointment/:id` — Retrieve billing info for appointment
  - `PATCH /api/billing/appointment/:id` — Update payment status (PENDING/PAID/REFUNDED)
  - `POST /api/billing/refund` — Initiate refund for cancellation
  - Repository: `getAppointmentBilling()`, `updatePaymentStatus()`, `initiateRefund()`

- [ ] **Payment Status API Enhancements**
  - Extend appointment model to include payment_status field
  - Refund trigger logic when appointment is cancelled

#### Frontend Deliverables
- [ ] **CheckInKiosk** (`apps/web/src/components/patient/checkin-kiosk/`)
  - `CheckInKiosk.tsx` — Fullscreen kiosk mode for patient check-in
  - QR code or patient ID lookup for appointment identification
  - Check-in button with audit logging
  - Waiting area display

- [ ] **BillingManagement** (`apps/web/src/components/admin/billing/`)
  - `BillingTable.tsx` — Appointments with payment status, amounts, refund history
  - `ProcessRefundDialog.tsx` — Modal for initiating refunds
  - Payment status badges and filters
  - Revenue reports by payment status and date range

- [ ] **CheckInComponent** (`apps/web/src/components/patients/checkin/`)
  - Updated check-in flow for patient portal with staff assistance

#### Integration
- [ ] TanStack Query hooks: `useCheckIn.ts`, `useBilling.ts`, `useCheckInKiosk.ts`
- [ ] API client functions (`lib/api.ts` - checkinApi, billingApi)
- [ ] Route protection with ADMIN/STAFF roles
- [ ] Audit logging for all check-in and billing operations

---

### Week 4: System Settings, Business Rules & Polish (2026-10-29 to 2026-11-04)

**Goal:** Configurable business rules engine and final polish

#### Backend Deliverables
- [ ] **Business Rules Engine** (`apps/api/src/rules/`)
  - `GET /api/rules` — List all configurable business rules
  - `PATCH /api/rules/:id` — Update a specific business rule value
  - Core rule types:
    - `cancellation_policy` — Grace period hours, refund eligibility
    - `slot_interval` — Default slot duration in minutes
    - `notification_templates` — Email/SMS notification content configuration
    - `working_hours` — Doctor working hours configuration
    - `max_concurrent_appointments` — Maximum appointments per doctor per day
  - Repository: `getRules()`, `updateRule()`

- [ ] **System Settings Integration**
  - Migrate existing settings to the rules engine
  - Version tracking for rule changes with audit logs
  - Rule change validation (prevent invalid configurations)

#### Frontend Deliverables
- [ ] **BusinessRules** (`apps/web/src/components/admin/rules/`)
  - `RulesTable.tsx` — Editable table of all business rules with descriptions
  - `RuleEditor.tsx` — inline or modal editor for each rule type
  - Rule type validators for each rule category
  - Rule change history and audit trail

- [ ] **SettingsPage** (`apps/web/src/components/admin/settings/`)
  - General configuration form
  - Notification template editor
  - Slot interval configuration
  - Cancellation policy configuration

#### Integration
- [ ] TanStack Query hooks: `useBusinessRules.ts`, `useSystemSettings.ts`
- [ ] API client functions (`lib/api.ts` - rulesApi)
- [ ] Route protection with ADMIN role

#### Cross-Cutting
- [ ] All new components: WCAG 2.1 AA accessibility audit
- [ ] Responsive design verification (mobile, tablet, desktop - 4/8/12 column grid)
- [ ] Code review (2 reviewers)
- [ ] Deploy to staging with smoke tests passing
- [ ] Performance benchmarks validated under expected load

---

## Technical Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| `@tanstack/react-query` | ^5.0+ | Server state management (already in Phase 2) |
| `zod` | ^3.22+ | Validation schemas (shared package) |
| `recharts` | ^2.12+ | Dashboard visualizations |
| `pdfkit` | Latest | PDF generation for reports and refunds |
| `date-fns` | ^3.0+ | Date manipulation for rules and analytics |
| `xlsx` | ^0.18+ | Excel export for reports |

---

## API Contract Summary

### Admin Dashboard
```
GET    /api/admin/dashboard           # Platform metrics
GET    /api/admin/users              # List all users with filtering
PATCH  /api/admin/users/:id         # Update user role
GET    /api/admin/audit-logs         # Audit log listings
GET    /api/settings                 # System configuration
PATCH  /api/settings                 # Update system configuration
GET    /api/rules                    # Business rules list
PATCH  /api/rules/:id               # Update business rule
```

### Staff Booking
```
POST   /api/staff-bookings           # Create appointment on behalf of patient
GET    /api/staff-bookings/available-slots  # Available slots
GET    /api/staff-bookings/patient-appointments  # Patient's existing appointments
```

### Check-in
```
POST   /api/checkin                  # Record patient check-in
PATCH  /api/checkin/appointment/:id  # Update appointment status
GET    /api/checkin/appointment/:id  # Retrieve appointment details
```

### Billing
```
GET    /api/billing/appointment/:id  # Retrieve billing info
PATCH  /api/billing/appointment/:id  # Update payment status
POST   /api/billing/refund           # Initiate refund
```

### Business Rules
```
GET    /api/rules                    # List all rules
PATCH  /api/rules/:id               # Update a rule
```

---

## Database Considerations

### Indexes Needed
- `users` table: `(role, status, updated_at)` for admin user filtering
- `appointments` table: `(payment_status, updated_at)` for billing queries
- `appointments` table: `(status, check_in_time)` for check-in tracking
- `clinics` table: `(is_active)` for clinic filtering
- `settings` table: `(key)` for system configuration lookup
- `rules` table: `(key)` for business rules lookup

### Transaction Boundaries
- Staff booking: Transaction for appointment creation + slot release + audit log
- Check-in: Transaction for appointment status update + check-in time recording + audit log
- Refund: Transaction for payment status update + refund record + audit log
- Rule updates: Transaction for rule value update + audit log entry

---

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Unauthorized role assignment | Low | Critical | ADMIN-only access for role changes, audit logging of all role updates |
| Billing data inconsistency | Medium | High | Transaction-bound refund processing, audit trail for all payment changes |
| Kiosk mode security bypass | Medium | High | Role-based access (STAFF+ only), session timeout, input validation |
| Business rules misconfiguration | Medium | Medium | Validation on rule updates, change history with rollback capability |
| PHI exposure in admin views | Low | Critical | Role-based access controls, audit logging, data minimization in admin views |

---

## Success Criteria

- [ ] Admin dashboard displays accurate platform metrics in real-time
- [ ] User management: ADMIN can assign/revoke roles with proper authorization
- [ ] Clinic/department management: CRUD operations working correctly
- [ ] Staff booking interface: Staff can book appointments on behalf of patients
- [ ] Check-in kiosk: Staff can record patient check-in efficiently
- [ ] Billing/payment: Payment status tracking and refund initiation working
- [ ] Business rules engine: All rule types configurable and savable
- [ ] All new components: WCAG 2.1 AA accessibility compliant
- [ ] Responsive design validated across breakpoints (4/8/12 column grid)
- [ ] TypeScript strict mode: zero errors
- [ ] ESLint: zero warnings/errors
- [ ] Deploy to staging with smoke tests passing
- [ ] Performance benchmarks met under expected load