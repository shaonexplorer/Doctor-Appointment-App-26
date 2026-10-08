# Phase 5: Admin & Staff Operations — Validation & Testing Strategy

**Last Updated:** 2026-10-08  
**Status:** ✅ Defined

---

## Validation Approach

This document outlines the validation strategy for Phase 5 deliverables, ensuring all requirements are met through a combination of automated testing, manual verification, and stakeholder review.

## Testing Levels

### 1. Unit Testing (Target: >80% coverage)
- **Framework:** Vitest
- **Scope:** Individual functions, components, and utilities
- **Requirements:**
  - All new business logic must have unit tests
  - Utility functions (date formatting, validation helpers) must be tested
  - Zod schema validation tests for all new schemas
  - React component unit tests with @testing-library/react
  - Admin service function tests (metric calculations, user role updates, rule updates)
  - PDF generation service unit tests (for refunds, reports)
  - Export format validation tests
- **Tools:** Vitest, @testing-library/react, @testing-library/jest-dom, MSW (Mock Service Worker)

### 2. Integration Testing
- **Framework:** Vitest + SuperTest (for API), MSW (for frontend)
- **Scope:** API endpoint contracts, service-layer interactions, database operations
- **Requirements:**
  - API endpoint validation (request/response schemas using Zod)
  - Service-to-repository interaction tests
  - Database transaction tests (staff booking, check-in, refund, role assignment)
  - Authentication and authorization checks (role-based access control)
  - Business rules engine update integration tests
  - Audit log verification tests (ensure logs are created correctly)
  - Payment status update integration tests
  - Role assignment change integration tests

### 3. End-to-End Testing (E2E)
- **Framework:** Playwright
- **Scope:** Critical user flows across the entire application
- **Requirements:**
  - Test scripts for all major admin and staff user journeys
  - Cross-browser testing (Chromium, Firefox, WebKit)
  - Accessibility validation integrated into E2E tests
  - Performance benchmarking in test scenarios
  - Full flow tests for: staff booking → appointment creation → audit log
  - Full flow tests for: check-in kiosk → status update → audit log
  - Full flow tests for: refund initiation → payment status update → audit log
  - Full flow tests for: admin role assignment → user access change → audit log

### 4. Manual Verification
- **Scope:** Exploratory testing, usability validation, edge case checking
- **Requirements:**
  - Exploratory testing sessions with representative admin/staff users
  - Usability testing with clinic administrators and staff members
  - Edge case and boundary condition testing
  - Visual regression testing for all new components
  - Performance testing under load (concurrent admin actions)

---

## Validation by Feature Area

### 1. Admin Dashboard Validation

#### 1.1 Dashboard Overview
- **Unit Tests:**
  - Dashboard KPI calculation logic (total users, active appointments, revenue)
  - Chart data transformation functions (daily trends, role distribution)
  - Comparison value calculations (vs previous period)
  - Activity feed item generation logic
- **Integration Tests:**
  - API endpoint for dashboard metrics retrieval
  - Database query performance for aggregation queries
  - Data freshness and caching logic verification
- **E2E Tests:**
  - Complete dashboard navigation flow
  - Chart interactive tooltips display accurate values
  - Comparison period toggles (day/week/month/year) work correctly
  - Activity feed loads and displays events correctly
  - Loading states and error handling
- **Manual Verification:**
  - Visual validation of dashboard with various data densities
  - Performance testing with large datasets (1000+ users, 10000+ appointments)
  - Complex filter combination testing (role + status + date range)
  - Accessibility validation of dashboard controls and charts
  - Screen reader compatibility testing for KPI cards and chart summaries
  - Manual recalculation verification with known data

### 2. User Management Validation

#### 2.1 User Listing and Role Assignment
- **Unit Tests:**
  - User listing filter logic (role, status, search)
  - Role assignment validation functions
  - Self-demotion prevention logic
  - Last ADMIN protection logic
- **Integration Tests:**
  - API endpoint for user listing with various filter combinations
  - Database query performance with filters applied
  - Role assignment change persistence verification
  - Audit log entry creation verification on role update
- **E2E Tests:**
  - Complete user management flow: list → search → filter → role assignment
  - Role assignment workflow: select user → assign role → confirmation → audit log
  - Last ADMIN protection: prevent demotion when only admin remains
  - Search relevance validation across various user data patterns
  - Role assignment persists across navigation
  - Reset filters returns to full user list
- **Manual Verification:**
  - Performance testing with large user datasets and active filters
  - Search relevance validation across different data patterns (common names, rare names)
  - Accessibility validation of filter controls and role assignment dialogs
  - Mobile responsiveness of user management page
  - Performance testing with active filters on large datasets
  - Edge case: attempting to assign duplicate roles, unusual user states

### 3. Clinic/Department Management Validation

#### 3.1 Clinic CRUD Operations
- **Unit Tests:**
  - Clinic creation validation logic (required fields, unique name)
  - Clinic update validation logic
  - Clinic soft-delete logic
  - Clinic data structure formatting
- **Integration Tests:**
  - API endpoint for clinic creation with various inputs
  - Database persistence and retrieval verification
  - Clinic listing with pagination and filtering
  - Soft-delete restoration (if applicable)
- **E2E Tests:**
  - Complete clinic management flow: create → list → edit → soft-delete
  - Clinic creation with all required and optional fields
  - Clinic name uniqueness validation
  - Clinic edit and update workflow
  - Clinic soft-delete and reactivation
- **Manual Verification:**
  - Testing various clinic name formats and lengths
  - Edge case testing (very long names, special characters, duplicate names)
  - Accessibility validation of clinic form controls
  - Mobile responsiveness of clinic management page
  - Performance testing with many clinics registered

### 4. Staff Booking Interface Validation

#### 4.1 Staff On-Behalf Patient Booking
- **Unit Tests:**
  - Booking form validation logic (patient selection, doctor selection, slot validation)
  - Slot availability check functions
  - Double-booking prevention logic
  - Appointment creation data structure validation
- **Integration Tests:**
  - API endpoint for staff booking with various filter combinations
  - Service-to-repository interaction (appointment creation + slot release + audit log)
  - Database transaction tests (atomicity of bulk operations)
  - Authentication and authorization checks (STAFF/ADMIN only)
- **E2E Tests:**
  - Complete staff booking flow: patient search → doctor selection → slot picker → confirmation → audit log
  - Patient search by name, ID, and phone number
  - Doctor filter by specialty and availability
  - Slot picker shows only genuinely available slots
  - Booking confirmation dialog and final creation
  - Multiple bookings in sequence
  - Error handling: slot becomes unavailable during booking, network errors
- **Manual Verification:**
  - Testing various patient search queries and data patterns
  - Edge case testing (patient with no existing appointments, multiple patients with same name)
  - Accessibility validation of form controls and slot picker
  - Mobile responsiveness of staff booking page
  - Performance testing with many available slots and doctors
  - Verify audit log entries contain: staff user, patient, doctor, slot, timestamp

#### 4.2 Available Slots for Staff Booking
- **Unit Tests:**
  - Available slots query logic (date range, type filter, status filter)
  - Slot status filtering functions
- **Integration Tests:**
  - API endpoint for available slots with various filter combinations
  - Database query performance with filters applied
- **E2E Tests:**
  - Staff views available slots for a doctor
  - Filter by date range works correctly
  - Filter by appointment type (IN_PERSON/VIDEO) works
- **Manual Verification:**
  - Performance testing with many slots and active filters
  - Accessibility validation of slot list and filters

### 5. Patient Check-in Kiosk Validation

#### 5.1 Check-in Kiosk Workflow
- **Unit Tests:**
  - Patient identification logic (QR code, ID lookup, name search)
  - Appointment matching functions
  - Check-in data structure validation
  - Wait time calculation logic
- **Integration Tests:**
  - API endpoint for check-in recording
  - Appointment status update integration
  - Audit log entry creation verification
  - Check-in and check-out (status) flow
- **E2E Tests:**
  - Complete check-in kiosk flow: patient identification → appointment selection → check-in → confirmation
  - QR code scanning simulation (or manual ID entry)
  - Patient name search and matching
  - Associated appointments display for identified patient
  - Check-in button action and status update
  - Wait time display after check-in
  - Multiple patient check-ins in sequence
- **Manual Verification:**
  - Testing various patient identification methods
  - Edge case: patient with no upcoming appointments, multiple appointments, past appointments
  - Accessibility validation of kiosk interface (large buttons, high contrast)
  - Mobile responsiveness (kiosk mode is typically fullscreen on large display)
  - Performance testing with many patients checking in concurrently
  - Verify audit log: staff user, patient, appointment, check-in time, wait time

#### 5.2 Check-in Queue View
- **Unit Tests:**
  - Queue item calculation logic (wait time from scheduled time)
  - Patient prioritization functions
- **Integration Tests:**
  - API endpoint for check-in queue retrieval
  - Real-time queue updates (if using WebSocket or polling)
- **E2E Tests:**
  - Staff views check-in queue
  - Queue orders correctly by wait time or appointment time
  - Mark patient as checked in from queue
  - Queue updates after check-in

### 6. Billing & Payments Validation

#### 6.1 Payment Status Tracking
- **Unit Tests:**
  - Payment status validation logic (PENDING/PAID/REFUNDED)
  - Refund eligibility calculation
  - Payment amount validation
- **Integration Tests:**
  - API endpoint for billing info retrieval
  - Payment status update integration
  - Database appointment update verification
  - Audit log entry creation on payment status change
- **E2E Tests:**
  - Complete billing flow: view billing → update payment status → audit log
  - View billing information for an appointment
  - Update payment status from PENDING to PAID
  - Update payment status from PAID to REFUNDED after refund initiation
- **Manual Verification:**
  - Testing various payment status combinations
  - Edge case: refund amount > paid amount, partial refunds
  - Accessibility validation of billing forms and tables
  - Mobile responsiveness of billing management page
  - Performance testing with many appointments and payment records

#### 6.2 Refund Initiation
- **Unit Tests:**
  - Refund amount validation (must be ≤ total cost)
  - Refund reason enum validation
  - Refund data structure formatting
- **Integration Tests:**
  - API endpoint for refund initiation
  - Payment status update integration (appointment + refund record)
  - Audit log entry creation verification on refund
  - Refund record persistence and retrieval
- **E2E Tests:**
  - Complete refund flow: initiate refund → payment status update → refund record → audit log
  - Refund amount must be ≤ total appointment cost
  - Select refund reason from enumeration
  - Refund processing and status tracking
  - Multiple refunds for same appointment (if allowed)
- **Manual Verification:**
  - Testing various refund amount scenarios
  - Edge case: full refund vs. partial refund, refund after grace period
  - Accessibility validation of refund dialog and forms
  - Mobile responsiveness of refund management page
  - Verify audit log contains: admin user, appointment, refund amount, refund reason, processed date

### 7. Business Rules Engine Validation

#### 7.1 Rule Configuration and Updates
- **Unit Tests:**
  - Rule value validation logic (numerical ranges, format validation)
  - Rule type-specific validators (cancellation_policy, slot_interval, etc.)
  - Old value vs. new value comparison
  - Audit log entry formatting for rule changes
- **Integration Tests:**
  - API endpoint for rules retrieval with all rule types
  - API endpoint for rule update with various inputs
  - Database rule value persistence and retrieval
  - Audit log entry creation on rule update
  - Change history retrieval and filtering
- **E2E Tests:**
  - Complete rules management flow: view rules → update rule → verify change → audit log
  - View all business rules with descriptions and current values
  - Update cancellation policy grace period
  - Update slot interval
  - Update notification template text
  - Update working hours configuration
  - Update max concurrent appointments
  - Update default appointment duration
  - Rule change is reflected immediately in relevant flows
  - Audit log entry created and viewable for each rule update
- **Manual Verification:**
  - Testing various rule update scenarios and value ranges
  - Edge case: invalid values, out-of-range numbers, malformed templates
  - Accessibility validation of rules editor and forms
  - Mobile responsiveness of business rules management page
  - Performance testing with many rule updates
  - Verify change history is maintained and rules can be rolled back conceptually

#### 7.2 Rule Change Validation
- **Unit Tests:**
  - Rule change validation functions (range checks, format checks)
  - Prevent invalid rule configurations
  - Cross-rule dependency validation (changing one rule affects others)
- **Integration Tests:**
  - API endpoint validation for rule updates
  - Database constraint validation on rule values
- **Manual Verification:**
  - Attempting to set invalid rule values and verifying validation errors
  - Testing cross-rule scenarios (e.g., changing slot interval affects existing appointments)
  - Testing that rule changes take effect immediately or require restart

---

## Testing by Non-Functional Area

### 8. Accessibility Validation

#### 8.1 WCAG 2.1 AA Compliance
- **Automated Testing:**
  - WCAG 2.1 AA compliance scanning (axe-core) for all new admin and staff components
  - Color contrast ratio validation for all color combinations (using Clinical Precision tokens: --primary, --secondary, --tertiary, --destructive, --neutral, --surface)
  - Keyboard navigation testing (Tab order, focus management, focus indicators)
  - ARIA attribute validation for all interactive elements (tables, buttons, filters, modals, dialogs)
  - Screen reader testing of complete admin/staff flows (timeline, user management, billing, rules)
- **Manual Testing:**
  - Screen reader testing (JAWS, NVDA, VoiceOver) on complete admin dashboard, user management, clinic management, staff booking, check-in kiosk, billing, and rules management flows
  - Voice control testing (Windows Voice Control, macOS VoiceOver) on critical flows
  - Motor impairment accommodations testing (keyboard-only navigation through all admin/staff workflows)
  - Cognitive accessibility validation (simplified layouts, clear language, consistent patterns)
  - Color blindness friendly palettes validation using the Clinical Precision palette
  - Color contrast validation for all color combinations against WCAG AA standards

### 9. Performance Validation

#### 9.1 Load Testing
- **Schedule Testing:**
  - Admin dashboard loading: <500ms for all KPIs and charts tested with 5+ concurrent users
  - User list loading: <300ms for 100+ users with filters applied tested with varying loads
  - Clinic list loading: <200ms tested with varying loads
  - Staff booking slot lookup: <300ms for available slots query tested with varying loads
  - Check-in kiosk patient lookup: <200ms tested with varying loads
  - Billing info retrieval: <200ms per appointment tested with varying loads
  - Business rules API: <200ms for all rules retrieval tested with varying loads
  - API response times: <200ms for 95% of requests under expected load
  - Dashboard chart rendering: <1 second with real data tested with various data volumes

- **Tools:** k6, Lighthouse, Web Vitals

### 10. Security Validation

#### 10.1 Role-Based Access Control
- **Unit Tests:**
  - RBAC validation logic for all new endpoints
  - Role check functions for admin, staff, doctor, patient roles
- **Integration Tests:**
  - API endpoints return correct status for various roles (ADMIN can do everything, STAFF can do staff actions, DOCTOR limited, PATIENT denied)
  - Unauthorized role access is blocked and logged
- **E2E Tests:**
  - PATIENT role can only access patient-owned data (cannot access admin endpoints)
  - DOCTOR role can access limited features (own profile, own schedule)
  - STAFF role has appropriate access levels (staff booking, check-in, billing)
  - Unauthorized role attempts are blocked and logged with appropriate error messages
- **Manual Verification:**
  - Attempting admin actions as STAFF/DOCTOR/PATIENT and verifying access is blocked
  - Verifying audit logs capture all access attempts (successful and blocked)
  - Testing privilege escalation scenarios
  - Verifying session timeout after 15 minutes of inactivity

#### 10.2 PHI Protection
- **Unit Tests:**
  - PHI data handling validation logic
  - Audit log entry structure and PHI field handling
- **Integration Tests:**
  - API endpoints trigger audit logs correctly for PHI access
  - Database audit log storage verification (PHI fields logged but secured)
- **E2E Tests:**
  - PHI access is logged when admin views user list
  - PHI access is logged when staff books appointment
  - PHI access is logged when staff records check-in
  - PHI access is logged when staff processes refund
  - PHI access is logged when admin updates business rules
  - Audit logs are not accessible to unauthorized roles
  - Unauthorized access attempts are logged and blocked
- **Manual Verification:**
  - Database audit log inspection after various admin/staff actions
  - Unauthorized access attempts are logged and blocked appropriately
  - Log entries contain required fields: user, action, timestamp, resource, details
  - PHI is not exposed in error messages, URLs, or non-secure contexts

### 11. Release Validation Checklist

Before any Phase 5 feature is considered complete, the following must be verified:

1. **Code Quality:**
   - [ ] TypeScript compiles with `tsc --noEmit --strict` (zero errors)
   - [ ] ESLint passes with `npm run lint` (zero warnings/errors)
   - [ ] Prettier formatting passes `npm run format:check`

2. **Test Coverage:**
   - [ ] Unit test coverage >80% for new code (measured by Vitest coverage)
   - [ ] All new components have corresponding unit tests
   - [ ] All new API endpoints have integration tests
   - [ ] Critical user flows have E2E tests

3. **Functional Validation:**
   - [ ] All requirements from requirements.md are implementable and testable
   - [ ] Acceptance criteria from requirements.md are satisfied
   - [ ] User stories can be successfully completed
   - [ ] Edge cases and error conditions handled appropriately

4. **Non-Functional Validation:**
   - [ ] Performance benchmarks met under expected load
   - [ ] WCAG 2.1 AA accessibility compliance verified
   - [ ] Security scanning shows no critical vulnerabilities
   - [ ] Responsive design validated across breakpoints (4/8/12 column grid)
   - [ ] HIPAA compliance verified for all PHI handling

5. **Documentation:**
   - [ ] API documentation updated with new endpoints
   - [ ] Component documentation updated with usage examples
   - [ ] User guides updated for new features (admin guide, staff guide)
   - [ ] Operational documentation updated (runbooks, troubleshooting guide for admin/staff)

### Definition of Done (Per Feature)

A feature in Phase 5 is considered "Done" when:

- [ ] Unit tests >80% coverage
- [ ] Integration tests for API contracts
- [ ] E2E tests for critical user flows (Playwright)
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] Code review approved (2 reviewers)
- [ ] Deployed to staging with smoke tests passing
- [ ] Performance benchmarks met
- [ ] Security validation passed
- [ ] HIPAA compliance verified
- [ ] Documentation updated

### Release Validation

Before promotion to production:

- [ ] Smoke tests pass in production-like staging environment
- [ ] Performance benchmarks validated under expected production load
- [ ] Security scan shows no new vulnerabilities
- [ ] Database migration scripts tested and validated
- [ ] Rollback procedures tested and validated
- [ ] Monitoring and alerting configured and tested
- [ ] User acceptance testing completed with stakeholder sign-off
- [ ] Runbooks and operational documentation updated
- [ ] HIPAA Business Associate Agreement (BAA) updated if applicable
- [ ] Training materials updated (admin guide, staff guide, clinician guide)

---

## Test Data Strategy

### 1. Synthetic Test Data Generation
- Admin users with various role combinations (ADMIN, STAFF, DOCTOR, PATIENT)
- Clinic/department data with various specialties and configurations
- Test appointment data spanning different payment statuses (PENDING, PAID, REFUNDED)
- Test patient data for check-in scenarios (various appointment types and statuses)
- Business rules data with all rule types and default values
- Audit log entries covering all expected action types and role combinations

### 2. Edge Case Data
- Boundary values (minimum/maximum slot intervals, grace period hours, max concurrent appointments)
- Date range edge cases (leap years, month boundaries, year boundaries)
- Very long and very short names in all text fields
- Special character handling in all text fields (names, addresses, notes)
- Concurrent modification scenarios (simultaneous admin actions on same resource)
- Empty state testing (no users, no clinics, no appointments, no audit log entries)
- Role assignment edge cases (last ADMIN protection, self-demotion prevention)

### 3. Performance Test Data
- Large datasets for stress testing (500+ users, 200+ clinics, 5000+ appointments, 1000+ audit log entries)
- Peak load simulation (clinic with high admin activity, multiple staff members online)
- Longitudinal data for admin analytics (multi-year appointment history for trend analysis)
- Concurrent user simulations (multiple admins/staff accessing system simultaneously)

### 4. Security Test Data
- SQL injection attempt patterns on all new admin endpoints
- XSS payload vectors in all text input fields (patient names, notes, templates)
- Authentication bypass attempts on admin/staff data endpoints
- Privilege escalation scenarios (patient attempting admin actions, staff attempting role assignment)
- Data exfiltration attempt patterns (large export attempts from admin dashboard)

### 5. Accessibility Test Data
- Screen reader compatible content for all admin tables and forms
- Keyboard navigable test scenarios for all interactive elements
- Color blindness test palettes using the Clinical Precision token set
- Motor impairment accommodation test cases (keyboard-only navigation through all workflows)
- Cognitive load test scenarios (simplified admin views, clear hierarchy, consistent patterns)

---

## Tools & Environments

### Testing Frameworks
- **Unit/Integration:** Vitest
- **E2E:** Playwright
- **Accessibility:** axe-core, Lighthouse
- **Performance:** k6, Lighthouse, Web Vitals
- **Security:** OWASP ZAP, Snyk, Burp Suite (manual), custom security test suites
- **Code Quality:** ESLint, Prettier, TypeScript
- **Coverage:** Vitest built-in coverage

### Environments
- **Development:** Local Docker-compose or manual setup
- **Testing:** Isolated test environment with synthetic data
- **Staging:** Production-like environment with anonymized data
- **Production:** Monitored with feature flags and canary releases

### Continuous Integration
- Automated testing on every pull request
- Nightly test runs for comprehensive validation
- Performance testing on schedule (weekly)
- Security scanning on schedule (daily)
- Deployments to staging on main branch updates
- Manual promotion to production with validation gate

---

## Risk-Based Testing Focus

### High Risk Areas (Focused Testing)
1. **PHI Exposure:** Rigorous testing of role-based access and audit logging for all admin data
2. **Role Assignment Security:** Comprehensive testing of role changes and authorization checks
3. **Billing Data Integrity:** Comprehensive validation of payment status updates and refund processing
4. **Audit Log Integrity:** Comprehensive testing that all critical actions are logged correctly and logs are immutable

### Medium Risk Areas (Standard Testing)
1. **Business Rules Configuration:** Standard unit, integration, and E2E testing for all rule types and update flows
2. **User Management UI:** Standard unit, integration, and E2E testing for all admin user flows
3. **Clinic/Department Management:** Standard testing for CRUD operations and data validation
4. **Staff Booking Interface:** Standard testing for appointment booking on behalf of patients

### Low Risk Areas (Basic Testing)
1. **Static Content:** Basic rendering and linkage validation
2. **Utility Functions:** Standard unit testing
3. **Configuration Settings:** Validation of persistence and retrieval
4. **Helper Functions:** Standard unit testing

---

## Validation Metrics & Reporting

### Test Metrics Dashboard
- **Test Coverage:** Unit, integration, E2E coverage percentages
- **Test Performance:** Test execution times, flakiness rates
- **Defect Metrics:** Bug leakage, mean time to detect/resolve
- **Quality Metrics:** Code quality trends, technical debt indicators
- **Release Metrics:** Release frequency, mean time to recovery

### Reporting Cadence
- **Daily:** Test results summary for active development branches
- **Weekly:** Comprehensive test report for main branch
- **Per Release:** Full validation report including all test levels
- **Per Incident:** Post-mortem analysis with test gap identification
- **Quarterly:** Trend analysis and test strategy adjustments

### Escalation Procedures
- **Test Failures:** Immediate notification to developers and QA lead
- **Performance Regression:** Performance team notification if >10% degradation
- **Security Findings:** Immediate security team notification for critical issues
- **Accessibility Issues:** Accessibility team notification for WCAG violations
- **Release Blockers:** Automatic release hold with notification to release manager

---

## References

- [Phase 5 Plan](./plan.md)
- [Phase 5 Requirements](./requirements.md)
- [Project Testing Strategy](../../../TESTING.md)
- [Accessibility Guidelines](../../../docs/accessibility.md)
- [Security Testing Guidelines](../../../docs/security-testing.md)
- [Performance Testing Guidelines](../../../docs/performance-testing.md)
- [API Documentation](../../../docs/api.md)
- [Component Library Guidelines](../../../docs/components.md)