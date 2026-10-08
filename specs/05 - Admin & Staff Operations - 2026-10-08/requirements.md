# Phase 5: Admin & Staff Operations — Requirements

**Last Updated:** 2026-10-08  
**Status:** ✅ Defined

---

## Functional Requirements

### 1. Admin Dashboard & Platform Metrics

#### 1.1 Dashboard Overview
- Admin must be able to view platform-wide metrics dashboard
- Dashboard must display KPI cards:
  - Total registered users (lifetime)
  - Active appointments today
  - Total platform revenue (all time, current period)
  - Staff count by role
- Charts must display:
  - Daily appointment trend (last 30 days)
  - User role distribution (ADMIN/STAFF/DOCTOR/PATIENT breakdown)
  - Appointment status distribution (SCHEDULED/COMPLETED/CANCELLED/NO_SHOW)
  - Revenue by consultation type (if tracked)
- Recent activity feed showing last 24 hours of system events
- Comparison to previous period (week-over-week, month-over-month)

#### 1.2 User Management
- Admin must be able to list all users with the following filters and pagination:
  - Role filter (ADMIN/STAFF/DOCTOR/PATIENT)
  - Status filter (active, inactive, suspended)
  - Search by name, email, or patient ID
  - Pagination (default 20 per page, configurable)
- Admin must be able to update a user's role:
  - Assign or revoke ADMIN/STAFF/DOCTOR/PATIENT roles
  - Role assignment must require justification/audit trail
  - Prevent self-demotion if user is the last ADMIN
  - Validate role assignment against business rules

### 2. Clinic/Department Setup

#### 2.1 Clinic/Department Management
- Admin must be able to list all clinics/departments with pagination
- Admin must be able to create a new clinic/department:
  - Required fields: name, description, contact information, address
  - Optional fields: timezone, working hours, insurance provider
  - Default status: active
- Admin must be able to update clinic/department information
- Admin must be able to soft-delete a clinic/department (set inactive rather than delete)
- Each clinic/department should be associable with multiple doctors

### 3. Staff Booking Interface

#### 3.1 Staff On-Behalf Patient Booking
- Staff member must be able to create an appointment on behalf of a patient
- Booking form must include:
  - Patient selector (search by name, ID, or contact info)
  - Doctor selector (filter by specialty, availability)
  - Slot picker from available slots
  - Appointment date and time selection
  - Appointment type (IN_PERSON, VIDEO)
  - Symptom notes or reason for visit (optional, free text)
  - Payment status pre-configuration (PENDING/PAID)
- System must validate that the selected slot is available for the selected doctor
- System must prevent double-booking via database constraints and validation
- Booking must create an audit log entry recording: staff user, patient, doctor, slot, timestamp

#### 3.2 Available Slots for Staff Booking
- Staff must be able to view available slots for a given doctor
- Filtering capabilities:
  - By date range
  - By appointment type (IN_PERSON, VIDEO)
  - By availability status
- Pagination for large slot lists

### 4. Patient Check-in Kiosk Mode

#### 4.1 Check-in Kiosk Workflow
- Kiosk mode must present a simplified interface for patient check-in
- Patient identification methods:
  - QR code scanning (display patient QR code for kiosk to scan)
  - Patient ID lookup (manual entry of patient ID or phone number)
  - Name search (search by patient name)
- Once patient is identified, must show:
  - Associated appointment(s) for today or upcoming
  - Appointment details (time, doctor, type, reason)
- Check-in action must:
  - Update appointment status to "Checked In"
  - Record the actual check-in time (timestamp)
  - Track wait time from scheduled appointment time to check-in time
  - Generate audit log entry: staff user, patient, appointment, check-in time, wait time
- Must enforce that only staff (STAFF/ADMIN role) can initiate check-in

#### 4.2 Check-in Queue View
- Staff must be able to view a queue of patients waiting to be checked in
- Queue must show:
  - Patient name and ID
  - Scheduled appointment time
  - Wait time (current time - scheduled time)
  - Appointment priority (if configured)
- Ability to mark patient as checked in from the queue view

### 5. Billing & Payment Support

#### 5.1 Payment Status Tracking
- Each appointment must have a `payment_status` field with values:
  - PENDING (appointment scheduled, payment not yet processed)
  - PAID (payment received for appointment)
  - REFUNDED (full or partial refund processed)
- Payment status must be updatable by staff with ADMIN/STAFF role
- System must track refund amounts and refund reasons

#### 5.2 Refund Initiation
- Staff must be able to initiate a refund for a cancelled appointment
- Refund form must require:
  - Appointment ID
  - Refund amount (must be ≤ total appointment cost)
  - Refund reason (CANCELLATION_BY_PATIENT, CANCELLATION_BY_DOCTOR, INSURANCE, PATIENT_REQUEST, etc.)
  - Refund date and processing notes
- System must create a refund record with:
  - Original payment details (masked for security)
  - Refund amount
  - Refund reason
  - Processed by (staff user)
  - Processed date
  - Status (PENDING, COMPLETED, FAILED)
- Refund must update the appointment's payment_status to REFUNDED
- Must create audit log entry for all refund operations

#### 5.3 Billing Information Retrieval
- Staff must be able to view billing information for any appointment
- Billing info must include:
  - Appointment total cost
  - Payment status (PENDING/PAID/REFUNDED)
  - Amount paid
  - Amount refunded (if applicable)
  - Payment method (masked)
  - Billing cycle dates
- Must be filterable by payment status, date range, and appointment type

### 6. System Settings & Business Rules Engine

#### 6.1 Business Rules Configuration
- System must provide a configurable business rules engine with the following rule types:
  - `cancellation_policy` — Object containing:
    - `grace_period_hours` — Hours after appointment start when cancellation is allowed (default: 2)
    - `refund_eligibility` — Whether refund is eligible within grace period (default: true)
    - `refund_percentage` — Percentage refundable (100, 50, 0 based on timing)
  - `slot_interval` — Default slot duration in minutes (default: 20, configurable 10-60)
  - `notification_templates` — Object containing configurable text for:
    - `appointment_reminder` — SMS/email reminder template
    - `cancellation_notification` — Cancellation notice template
    - `reschedule_notification` — Rescheduling notice template
    - `checkin_confirmation` — Check-in confirmation template
  - `working_hours` — Doctor working hours configuration:
    - `default_start` — Default start time (e.g., "09:00")
    - `default_end` — Default end time (e.g., "17:00")
    - `break_interval` — Break duration in minutes (e.g., 60)
    - `break_start` — Break start time (e.g., "12:00")
  - `max_concurrent_appointments` — Maximum appointments per doctor per day (default: 20, configurable 1-100)
  - `default_appointment_duration` — Default appointment duration in minutes (default: 30, configurable 15-120)

#### 6.2 System Settings API
- Admin must be able to retrieve all current system settings/configuration values
- Admin must be able to update any system setting/configuration value
- Each setting update must create an audit log entry recording:
  - Admin user who made the change
  - The rule/setting key that was changed
  - The old value and new value
  - Timestamp of change
  - Reason/context for change (optional)

#### 6.3 Rule Change Validation
- System must validate rule values on update:
  - Numerical ranges must be within allowed bounds
  - Template strings must not contain invalid syntax
  - Date/time formats must be valid
  - Prevent rules that would break existing business logic
  - Change must require ADMIN role confirmation

---

## Non-Functional Requirements

### 5.1 Performance Requirements
- Admin dashboard loading: <500ms for all KPIs and charts (with real data)
- User list loading: <300ms for 100+ users with filters applied
- Clinic list loading: <200ms
- Staff booking slot lookup: <300ms for available slots query
- Check-in kiosk: <200ms for patient lookup and check-in recording
- Billing info retrieval: <200ms per appointment
- Business rules API: <200ms for all rules retrieval
- API response times: <200ms for 95% of requests
- Dashboard chart rendering: <1 second with real data

### 5.2 Security & Privacy Requirements
- Role-based access control minimum:
  - ADMIN role: Full access to all admin features
  - STAFF role: Staff booking, check-in, billing views (limited)
  - DOCTOR role: Own profile, own schedule, own patients (limited admin features)
  - PATIENT role: No access to admin features
- PHI protection audit logging for all admin data access queries
- Session timeout after 15 minutes of inactivity for admin/Staff sessions
- All admin actions must be logged with user, action, timestamp, resource type, and details
- Input validation and sanitization on all new endpoints
- No PHI displayed in non-secure contexts or without proper role authentication
- Audit logs must be immutable (cannot be deleted, only viewed)

### 5.3 Accessibility Requirements
- WCAG 2.1 AA compliance for all new admin and staff components
- Keyboard navigable interface throughout all admin/staff flows
- ARIA labels for all interactive elements (tables, filters, buttons, modals)
- Color contrast ratios meeting WCAG AA standards (using Clinical Precision tokens)
- Screen reader compatibility for tables, forms, and complex UI
- Responsive design for mobile/tablet/desktop (4/8/12 column grid per design.md)
- Focus management and visible focus indicators on all interactive elements

### 5.4 Reliability Requirements
- 99.9% uptime SLA for admin/staff endpoints
- Graceful degradation for non-critical features (charts optional)
- Database connection pooling and retry logic for all new endpoints
- Circuit breaker pattern for external services (PDF generation, email services)
- Automated failover and backup systems for configuration data
- Audit log durability: logs must not be lost on system restart

### 5.5 Scalability Requirements
- Horizontal scaling capability for admin data volume
- Database read replicas for reporting queries (admin dashboard, analytics)
- Caching layer for frequently accessed data (platform metrics, user lists)
- Asynchronous processing for non-UI tasks (refund processing, report generation)
- Load balancing across application instances
- Efficient database indexing strategies for admin queries

### 5.6 Usability Requirements
- Intuitive interface for clinic administrators and staff
- Clear error messages and success notifications
- Confirmation dialogs for destructive actions (role changes, deletions)
- Tooltip help text for complex configuration fields
- Inline validation for all forms
- Consistent design language using Clinical Precision design system

---

## User Stories

### As an Administrator, I want to...

1. **View platform metrics** so I can understand the overall health of the healthcare platform
   - As an admin, I want to see KPI cards and charts showing total users, active appointments, and revenue so I can gauge platform usage and inform business decisions.

2. **Manage user roles** so I can control system access
   - As an admin, I want to assign and revoke roles (ADMIN/STAFF/DOCTOR/PATIENT) for users so I can control who has access to which features and when.

3. **Configure clinics/departments** so I can organize the healthcare platform
   - As an admin, I want to create, update, and deactivate clinics/departments so I can organize doctors and appointments by specialty or location.

4. **View audit logs** so I can monitor system activity and ensure compliance
   - As an admin, I want to view and filter audit logs showing who did what and when so I can ensure compliance and investigate any issues.

5. **Configure business rules** so I can customize platform behavior
   - As an admin, I want to configure cancellation policies, slot intervals, and notification templates so the platform behaves according to my clinic's policies.

### As a Staff Member, I want to...

6. **Book appointments on behalf of patients** so I can assist patients who need help booking
   - As staff, I want to book appointments for patients so I can help those who are unable to book themselves (elderly, disabled, language barriers, etc.).

7. **View available slots** so I can find open appointment times
   - As staff, I want to see available slots for any doctor so I can book appointments efficiently.

8. **Check in patients** so I can track arrivals and wait times
   - As staff, I want to record patient check-ins so I can track wait times, manage room utilization, and support the doctor's workflow.

9. **View billing and process refunds** so I can manage payments
   - As staff, I want to view appointment billing information and process refunds so I can manage clinic finances and handle cancellations fairly.

### As a Patient, I want to...

10. **Know that staff can assist with check-in** so I can have a smooth arrival experience
    - As a patient, I want staff to be able to check me in at the clinic so my wait time is tracked and I can be seen by the doctor promptly.

11. **Receive fair refund policies** so I can trust the booking system
    - As a patient, I want cancellation and refund policies to be clearly defined and consistently applied so I feel confident booking appointments.

---

## Acceptance Criteria

### Admin Dashboard
- [ ] Dashboard KPI cards display accurate, real-time platform metrics
- [ ] User role distribution chart renders correct data
- [ ] Appointment status distribution chart renders correct data
- [ ] Daily appointment trend chart renders correct data (last 30 days)
- [ ] Recent activity feed shows last 24 hours of system events
- [ ] Comparison to previous period is displayed correctly

### User Management
- [ ] Admin can list users with role filter, status filter, and search
- [ ] Admin can update a user's role with proper authorization
- [ ] Role assignment requires audit trail entry
- [ ] Prevent self-demotion when user is last ADMIN
- [ ] Search returns relevant results across name, email, patient ID

### Clinic/Department Management
- [ ] Admin can list all clinics/departments with pagination
- [ ] Admin can create a new clinic/department with required fields
- [ ] Admin can update clinic/department information
- [ ] Admin can soft-delete a clinic/department (set inactive)
- [ ] Clinic search and filtering works correctly

### Staff Booking Interface
- [ ] Staff can book appointments on behalf of patients
- [ ] Patient selector search works (by name, ID, contact info)
- [ ] Doctor filter by specialty works
- [ ] Slot picker shows only available slots
- [ ] No double-booking can occur (database constraint + validation)
- [ ] Booking creates audit log entry
- [ ] Appointment type (IN_PERSON/VIDEO) is recorded

### Patient Check-in Kiosk
- [ ] Kiosk mode presents simplified check-in interface
- [ ] Patient identification via QR code, ID lookup, or name search works
- [ ] Associated appointments are displayed correctly
- [ ] Check-in updates appointment status to "Checked In"
- [ ] Check-in time is recorded accurately
- [ ] Wait time is calculated (current time - scheduled time)
- [ ] Audit log entry created for each check-in
- [ ] Only STAFF/ADMIN role can initiate check-in
- [ ] Queue view shows patients waiting with wait times

### Billing & Payments
- [ ] Each appointment has payment_status field (PENDING/PAID/REFUNDED)
- [ ] Staff can update payment status
- [ ] Refund initiation form requires amount and reason
- [ ] Refund record created with all required fields
- [ ] Appointment payment_status updated to REFUNDED on refund
- [ ] Billing info retrieval works for any appointment
- [ ] Billing info filterable by payment status and date range
- [ ] Audit log entry created for each refund operation

### Business Rules Engine
- [ ] All rule types configurable via API
- [ ] Default values match Phase 2/3/4 specifications
- [ ] Rule validation on update (numerical ranges, format validation)
- [ ] Change history with audit logging
- [ ] ADMIN role required for rule updates
- [ ] `cancellation_policy.grace_period_hours` defaults to 2
- [ ] `slot_interval` defaults to 20 minutes
- [ ] `max_concurrent_appointments` defaults to 20
- [ ] `default_appointment_duration` defaults to 30 minutes

### Technical Requirements
- [ ] All API endpoints respond within required timeframes
- [ ] System maintains WCAG 2.1 AA accessibility compliance
- [ ] All PHI access is properly audited and logged
- [ ] TypeScript code compiles with zero errors in strict mode
- [ ] ESLint passes with no warnings/errors
- [ ] Unit test coverage >80% for new code
- [ ] Deploy to staging with smoke tests passing
- [ ] Performance benchmarks met under expected load
- [ ] Security scanning shows no critical vulnerabilities