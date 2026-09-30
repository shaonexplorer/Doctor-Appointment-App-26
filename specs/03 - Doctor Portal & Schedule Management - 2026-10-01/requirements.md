# Phase 3: Doctor Portal & Schedule Management — Requirements

**Last Updated:** 2026-10-01  
**Status:** ✅ Defined  

---

## Functional Requirements

### 1. Schedule Management
#### 1.1 Bulk Slot Creation Wizard
- Doctors must be able to generate schedule slots in bulk using a wizard interface
- Wizard must support:
  - Date range selection (start and end dates)
  - Recurring time blocks (daily, weekly, specific days of week)
  - Time interval configuration (default 20-minute slots)
  - Slot type selection (IN_PERSON, VIDEO, or both)
  - Preview of generated slots before confirmation
- System must prevent duplicate slot creation for the same doctor/time combination
- Bulk operations must be atomic (all succeed or all fail)

#### 1.2 Schedule Calendar View
- Weekly calendar view displaying Monday through Sunday
- Time slots displayed in 30-minute columns from 6:00 AM to 8:00 PM (configurable)
- Visual indicators for slot status:
  - Available (green/secondary color)
  - Booked (blue/primary color) 
  - Blocked/Cancelled (red/destructive color)
  - Pending confirmation (amber/tertiary color)
- Drag-and-drop functionality to:
  - Move booked appointments to different time slots
  - Block/unblock available slots
  - Extend or shorten appointment duration
- Slot click-to-edit functionality for individual slot modifications
- Keyboard navigation support for all calendar interactions

#### 1.3 Individual Slot Management
- Ability to set custom status for individual slots (Available, Booked, Blocked)
- Ability to add notes or restrictions to specific slots
- Automatic slot status updates when appointments are booked/cancelled
- Real-time synchronization of slot status across all views

### 2. Appointment Management
#### 2.1 Appointment List & Filtering
- Tabbed interface showing: Scheduled, Completed, Cancelled, No-Show appointments
- Each tab displays appointments relevant to that status with pagination
- Filtering capabilities:
  - Date range (today, tomorrow, this week, next week, custom range)
  - Appointment type (IN_PERSON, VIDEO)
  - Patient name search
  - Appointment duration
- Sorting options:
  - By time (ascending/descending)
  - By patient name (alphabetical)
  - By appointment type
- Bulk selection for operations (cancel, reschedule, mark as completed)

#### 2.2 Appointment Actions
- **Cancel Appointment:**
  - Requires cancellation reason selection
  - Enforces 2-hour cancellation policy (with configurable grace period)
  - Triggers refund process when applicable (based on payment status)
  - Releases time slot back to available status
  - Sends cancellation notification to patient
  - Maintains audit trail of cancellation
  
- **Reschedule Appointment:**
  - Slot picker showing only available slots
  - Preserves appointment details (patient, type, notes)
  - Validates no conflicts with existing appointments
  - Updates appointment timestamp and slot associations
  - Sends rescheduling confirmation to patient
  
- **Patient Check-in:**
  - Staff-assisted workflow (requires STAFF role or higher)
  - Updates appointment status to "Checked In"
  - Records actual check-in time
  - Enables consultation workflow initiation
  - Tracks wait time metrics

#### 2.3 Appointment Details View
- Comprehensive view showing:
  - Patient information (name, contact, demographics)
  - Appointment details (date, time, duration, type)
  - Slot information and scheduling history
  - Payment status and billing information
  - Prescription information (if any)
  - Consultation notes (if completed)
  - Audit trail of all modifications
- Print-friendly view for appointment summaries
- Ability to add clinical notes during/after consultation

### 3. Patient Management
#### 3.1 Patient Directory
- Searchable list of patients who have appointments with the doctor
- Search capabilities:
  - Patient name (first/last)
  - Patient ID or medical record number
  - Contact information (phone, email)
- Filtering options:
  - Medical condition/tags
  - Appointment status (upcoming, completed, etc.)
  - Date ranges (last visit, frequency)
  - Insurance/provider information
- Patient card/views showing:
  - Basic demographics
  - Upcoming appointment
  - Recent visit summary
  - Active prescriptions count

#### 3.2 Patient Detail View
- Comprehensive patient profile including:
  - Complete demographic information
  - Medical history summary
  - Complete appointment history (past/future)
  - Prescription history with status
  - Vital signs trends (if recorded)
  - Allergies and alerts
  - Insurance and billing information
- Tabbed organization:
  - Overview
  - Appointments
  - Prescriptions
  - Medical History
  - Notes & Documents

### 4. Prescription Management
#### 4.1 Digital Prescription Builder
- Structured medication entry with:
  - Medication name (with autocomplete from formulary)
  - Dosage amount and unit (mg, mL, units, etc.)
  - Frequency (daily, twice daily, etc.) with timing options
  - Duration (number of days, weeks, or "as needed")
  - Administration route (oral, topical, injection, etc.)
  - Special instructions (take with food, avoid alcohol, etc.)
- Dynamic form allowing multiple medications per prescription
- Real-time validation of medication combinations
- Integration with standard medical abbreviations and symbols

#### 4.2 Clinical Information Section
- Diagnosis entry:
  - Free-text diagnosis field
  - ICD-10 code lookup and selection
  - Primary vs. secondary diagnosis designation
- Test recommendations:
  - Laboratory tests (CBC, metabolic panel, etc.)
  - Imaging studies (X-ray, MRI, CT, etc.)
  - Specialized tests (EKG, EEG, stress test, etc.)
  - Referrals to specialists
- Ability to save/commonly used diagnosis/test combinations

#### 4.3 PDF Generation & Delivery
- Print-ready PDF generation with:
  - Professional medical formatting
  - Doctor's information and signature
  - Patient information
  - Prescription details (medications, dosage, instructions)
  - Diagnosis and test recommendations
  - Clinic information and contact details
  - Barcode/QR code for verification (optional)
  - Watermarking for security
- Multiple delivery options:
  - Immediate download
  - Email to patient (with consent)
  - SMS notification with download link
  - Portal availability for patient access
- PDF validation to ensure integrity and readability

#### 4.4 Prescription Lifecycle Management
- Automatic linking of prescriptions to source appointments
- Version control for prescription modifications
- Refill tracking and authorization
- Expired prescription flagging
- Integration with pharmacy networks (future phase)
- Audit trail of all prescription changes

### 5. Doctor Dashboard Analytics
#### 5.1 Key Performance Indicators (KPIs)
- Real-time display of:
  - Today's appointments (scheduled vs. actual)
  - Completed appointments today
  - Patients waiting/roomed
  - Today's revenue (follow-up, new, video visits)
- Comparison metrics:
  - Today vs. yesterday
  - Today vs. same day last week
  - Week-to-date vs. previous week-to-date
- Drill-down capability from KPI to detailed views

#### 5.2 Volume Chart (Line Chart)
- Daily patient volume for selected time period (7/14/30 days)
- Weekly patient volume aggregation
- Hourly distribution heatmap option
- Comparison overlays:
  - Previous period
  - Monthly average
  - Target/goal lines
- Interactive tooltips showing exact values
- Print/export functionality (PNG, SVG, CSV)

#### 5.3 Utilization Chart (Donut Chart)
- Slot utilization breakdown:
  - Booked slots (percentage and count)
  - Available slots (percentage and count) 
  - Blocked/Cancelled slots (percentage and count)
- Time-period selection (daily, weekly, monthly)
- Configurable slot definitions (working hours)
- Interactive segment highlighting
- Legend with clear labels and values

#### 5.4 Revenue Chart (Stacked Bar Chart)
- Revenue by consultation type:
  - Follow-up visits
  - New patient visits
  - Video consultations
  - Procedures (if applicable)
- Time-period selection (daily, weekly, monthly)
- Monetary formatting with currency symbol
- Interactive value display on hover
- Export capabilities for accounting integration
- Trend lines showing revenue progression

### 6. Doctor Profile Management
#### 6.1 Profile Information
- Editable professional information:
  - Bio/specialty description
  - Medical degrees and certifications
  - Specialties and subspecialties
  - Languages spoken
  - Accepted insurance plans
- Practice information:
  - Clinic address(es)
  - Contact information
  - Office hours
  - Telemedicine setup details
- Professional identification:
  - Medical license number and expiration
  - DEA number (if applicable)
  - NPI number
  - Board certifications

#### 6.2 Preferences & Settings
- Notification preferences:
  - Appointment reminders (timing and method)
  - Cancellation notifications
  - Schedule change alerts
  - Prescription renewal reminders
- Display preferences:
  - Default schedule view (day/week/month)
  - Time interval preferences
  - Chart display options
  - Theme/color preferences (light/dark)
- Integration settings:
  - Calendar sync (Google/Outlook)
  - Video conferencing preferences
  - Pharmacy network connections

#### 6.3 Statistics & Insights
- Personal performance metrics:
  - Patient satisfaction scores (if collected)
  - Average appointment duration
  - No-show rate
  - Revenue per visit
  - Patient retention rate
- Comparative benchmarks:
  - Specialty averages
  - Practice averages
  - Historical personal performance

### 7. Communication & Collaboration
#### 7.1 Global Search (Doctor Role)
- ⌘K command palette accessible from anywhere
- Doctor-scoped search results:
  - Patients by name/ID
  - Appointments by date/patient
  - Prescriptions by medication/patient
  - Medical notes by keyword
  - Schedule availability by date/time
- Keyboard navigation and ARIA labeling
- Results ranking by relevance and recency
- Quick-action buttons for common operations

#### 7.2 Notification Center
- Tabbed notifications:
  - All notifications
  - Appointment-related
  - Prescription-related
  - Schedule changes
  - System announcements
- Filtering capabilities:
  - Date range
  - Notification type
  - Read/unread status
  - Priority level
- Bulk operations:
  - Mark as read
  - Delete/archive
  - Snooze/remind later
- Real-time updates for critical notifications
- Notification preferences management

### 8. Technical & Non-Functional Requirements

#### 8.1 Performance Requirements
- Schedule generation: <30 seconds for 30-day schedule
- Appointment list loading: <500ms for 100+ appointments
- Prescription to PDF: <3 seconds
- Dashboard chart rendering: <1 second with real data
- Search responses: <300ms
- API response times: <200ms for 95% of requests

#### 8.2 Security & Privacy Requirements
- Role-based access control (DOCTOR role minimum)
- PHI protection audit logging for all patient data access
- Session timeout after 15 minutes of inactivity
- Password complexity requirements (minimum 12 characters)
- Multi-factor authentication option
- Data encryption at rest and in transit
- Regular security scanning and penetration testing

#### 8.3 Accessibility Requirements
- WCAG 2.1 AA compliance
- Keyboard navigable interface
- ARIA labels for all interactive elements
- Color contrast ratios meeting standards
- Screen reader compatibility
- Responsive design for mobile/tablet/desktop
- Focus management and visible focus indicators

#### 8.4 Reliability Requirements
- 99.9% uptime SLA
- Graceful degradation for non-critical features
- Database connection pooling and retry logic
- Circuit breaker pattern for external dependencies
- Automated failover and backup systems
- Disaster recovery plan with RTO <4 hours

#### 8.5 scalability Requirements
- Horizontal scaling capability
- Database read replicas for reporting
- Caching layer for frequently accessed data
- Asynchronous processing for non-UI tasks (PDF generation, notifications)
- Load balancing across application instances
- Efficient database indexing strategies

---
## User Stories

### As a Doctor, I want to...
1. Generate my weekly schedule quickly using a wizard so I can save time on administrative tasks
2. View my schedule in a clear calendar format so I can see my availability at a glance
3. Easily block time slots for breaks or personal time so I can maintain work-life balance
4. See my appointments organized by status so I can prioritize my work
5. Cancel or reschedule appointments with minimal clicks so I can adapt to changes
6. Check in patients when they arrive so I can track wait times and room utilization
7. Create prescriptions efficiently with structured data entry so I can reduce errors
8. Generate professional PDF prescriptions instantly so I can provide them to patients immediately
9. View analytics on my practice performance so I can make informed business decisions
10. Access patient histories quickly during consultations so I can provide better care
11. Search for patients, appointments, or prescriptions quickly so I can find information efficiently
12. Receive important notifications in a centralized location so I don't miss critical updates
13. Customize my dashboard and preferences so I can work in my preferred way
14. See my professional profile and statistics so I can track my performance
15. Have confidence that patient data is secure and private so I can trust the system

### As a Staff Member, I want to...
1. Assist with patient check-in so I can support the doctor's workflow
2. View the doctor's schedule so I can help manage appointments
3. Assist with prescription processing so I can support patient care
4. See notifications relevant to my role so I can stay informed

### As a Patient, I want to...
1. Receive my prescription quickly after my appointment so I can start treatment
2. Receive clear notifications about appointment changes so I can plan accordingly
3. Have access to my prescription history so I can manage my medications
4. Know that my health information is kept confidential so I can trust the healthcare system

---
## Acceptance Criteria

### Schedule Management
- [ ] Bulk schedule generation wizard creates correct slots based on inputs
- [ ] Schedule calendar accurately displays slot statuses with correct colors
- [ ] Drag-and-drop functionality works for moving appointments and blocking slots
- [ ] No duplicate slots can be created for the same doctor/time combination
- [ ] Slot status updates in real-time when appointments are booked/cancelled

### Appointment Management
- [ ] Appointment list correctly filters and displays appointments by status
- [ ] Cancellation workflow enforces 2-hour policy and triggers refunds when applicable
- [ ] Rescheduling prevents double-booking and maintains appointment integrity
- [ ] Patient check-in updates status and records timing accurately
- [ ] Appointment details view shows all relevant patient and appointment information

### Patient Management
- [ ] Patient directory search returns relevant results based on criteria
- [ ] Patient filters work correctly for condition, status, and date range
- [ ] Patient detail view shows complete history and current information
- [ ] Patient information is appropriately secured based on role permissions

### Prescription Management
- [ ] Prescription builder accepts structured medication data correctly
- [ ] Diagnosis and test recommendations sections capture clinical information
- [ ] PDF generation produces professional, readable prescriptions
- [ ] Prescriptions are correctly linked to source appointments
- [ ] Prescription history is accessible and accurate

### Analytics
- [ ] KPIs display accurate, real-time data
- [ ] Volume chart shows correct patient volume trends
- [ ] Utilization chart accurately represents slot usage percentages
- [ ] Revenue chart correctly breaks down revenue by consultation type
- [ ] All charts are interactive and exportable

### Technical Requirements
- [ ] All API endpoints respond within required timeframes
- [ ] System maintains WCAG 2.1 AA accessibility compliance
- [ ] All PHI access is properly audited and logged
- [ ] TypeScript code compiles with zero errors in strict mode
- [ ] ESLint passes with no warnings or errors
- [ ] Unit test coverage exceeds 80% for new code