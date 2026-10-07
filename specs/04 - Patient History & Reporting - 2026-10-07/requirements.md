# Phase 4: Patient History & Reporting — Requirements

**Last Updated:** 2026-10-07  
**Status:** ✅ Defined

---

## Functional Requirements

### 1. Medical History Timeline
#### 1.1 Timeline View
- Patient must be able to view complete chronological medical history timeline
- Timeline must include:
  - All appointments (scheduled, completed, cancelled, no-show)
  - All prescriptions with medication details and status
  - All diagnoses with dates and clinical notes
- Timeline entries must be ordered by date (most recent first)
- Each entry must display relevant contextual information (date, type, status, related entities)

#### 1.2 Timeline Filtering
- Filter by date range (custom range, last 30 days, last 90 days, this year, last year, all time)
- Filter by entry type (appointments only, prescriptions only, diagnoses only)
- Filter by status (active, completed, cancelled, no-show)
- Search functionality by patient name, doctor name, or condition tags

#### 1.3 Timeline Navigation
- Pagination for long timelines (loading more as user scrolls)
- Jump to specific date range
- Expandable entries to show detailed view

### 2. Prescription Management
#### 2.1 Prescription List
- Patient must be able to view their complete prescription list
- List must include:
  - Medication name and dosage
  - Prescription date and refills remaining
  - Status (active, completed, expired, cancelled)
  - Linked appointment information
- Filterable by:
  - Status (active, completed, expired, cancelled)
  - Date range
  - Medication name search
- Search by medication name, dosage, or instructions

#### 2.2 PDF Download
- Patient must be able to download PDF version of each prescription
- PDF must include:
  - Professional medical formatting
  - Doctor's information and signature (or clinic info)
  - Patient information
  - Prescription details (medications, dosage, instructions)
  - Diagnosis and test recommendations (if any)
  - Clinic information and contact details
- Download must be authenticated and authorized (PATIENT role)
- Each PDF must be uniquely generated (not cached static file)

#### 2.3 Prescription Details View
- Comprehensive view showing:
  - Complete medication breakdown (all medications in prescription)
  - Dosage and frequency for each medication
  - Administration route and special instructions
  - Diagnosis associated with prescription
  - Test recommendations from the prescribing doctor
  - Prescription creation and expiry dates
  - Refill history and remaining refills
- Print-friendly format available

### 3. Diagnostic Reports
#### 3.1 Report Upload
- Authorized staff (Doctor/Staff) must be able to upload diagnostic reports
- Supported formats: PDF, JPEG, PNG, DICOM
- Upload must include:
  - Report metadata (type, date, description, ordering physician)
  - Patient association
  - Encryption/secure storage
- Virus scanning on upload (future: integration)
- Maximum file size configuration (e.g., 25MB per report)

#### 3.2 Report Viewing
- Patient must be able to view their diagnostic reports
- Viewer must support:
  - Scrollable PDF viewing with zoom
  - Image viewing (JPEG/PNG) with zoom and pan
  - Report metadata display (date, type, description, physician)
  - Download option for original file
- Viewing must be authenticated and authorized (PATIENT role)

#### 3.3 Report Filtering and Search
- Filter reports by type (lab, imaging, pathology, other)
- Filter by date range
- Search by report description or date

### 4. Patient Dashboard Analytics
#### 4.1 KPI Cards
- Total appointments (lifetime and recent period)
- Appointment completion rate (percentage)
- Active prescriptions count
- Upcoming visits count (within next 30 days)

#### 4.2 Specialty Breakdown (Pie Chart)
- Pie chart showing appointments distribution by medical specialty
- Each slice must label specialty name and appointment count
- Must include "Other" category for specialties below threshold
- Hover tooltips showing exact percentage and count

#### 4.3 Monthly Expenses (Bar Chart)
- Bar chart showing monthly medical expenses
- X-axis: Months (rolling 6-12 months or calendar year)
- Y-axis: Expense amount
- Each bar may show breakdown by appointment type, prescription cost, etc.
- Tooltip showing exact monthly total

#### 4.4 Prescription Compliance Tracking
- Compliance rate percentage (medications taken as prescribed)
- Tracked metrics:
  - On-time fill rate
  - Completed course duration
  - Missed doses count
  - Refill compliance
- Visual indicator (progress bar or donut) showing overall compliance
- Per-medication compliance details on hover

#### 4.5 Upcoming Visit Timeline
- Timeline of upcoming appointments sorted by date
- Each entry shows: date, doctor/specialty, appointment type, reason/ reason code
- Visual indicator for priority (urgent vs. routine)
- Ability to navigate to booking/rescheduling from timeline

### 5. Data Export
#### 5.1 PDF Export (Complete Patient Health Portfolio)
- Export must generate comprehensive PDF containing:
  - Complete medical history timeline
  - All prescriptions with detailed information
  - All diagnostic reports
  - Analytics summary (KPIs, charts data)
  - Patient demographic information
  - Clinic/contact information
- Professional medical document formatting
- Include watermarking or security features for PHI protection
- Generation must not block UI (async with progress indicator)

#### 5.2 CSV Export
- Export patient data as CSV file containing:
  - Appointment history (dates, types, statuses, doctors)
  - Prescription history (medications, dosages, dates, statuses)
  - Diagnostic reports (types, dates, descriptions)
  - Basic patient demographics (name, ID, contact - limited fields)
- CSV must be well-structured with proper headers
- Data must be exportable in patient-chosen subsets (by date range, by type)

#### 5.3 Export Format Specification
- Both PDF and CSV exports must be HIPAA-compliant
- No unencrypted sensitive data in export metadata
- Export must be auditable (log who exported what and when)
- Patient must receive confirmation of export completion

---

## Non-Functional Requirements

### 5.1 Performance Requirements
- Timeline loading: <500ms for 2 years of data (100+ entries)
- Prescription list loading: <300ms for 50+ prescriptions
- Dashboard KPIs: <200ms
- Chart rendering: <1 second with real data
- PDF generation: <5 seconds per document
- Data export: <10 seconds for complete portfolio
- API response times: <200ms for 95% of requests

### 5.2 Security & Privacy Requirements
- Role-based access control (PATIENT role minimum for patient data)
- PHI protection audit logging for all patient data access queries
- Session timeout after 15 minutes of inactivity
- Data encryption at rest and in transit
- Input validation and sanitization on all new endpoints
- No PHI in export file names or URLs
- Audit trail of all export operations

### 5.3 Accessibility Requirements
- WCAG 2.1 AA compliance for all new components
- Keyboard navigable interface throughout all patient history flows
- ARIA labels for all interactive elements (timeline entries, filters, charts)
- Color contrast ratios meeting WCAG AA standards
- Screen reader compatibility for timeline, prescription lists, and charts
- Responsive design for mobile/tablet/desktop (4/8/12 column grid per design.md)

### 5.4 Reliability Requirements
- 99.9% uptime SLA for patient data endpoints
- Graceful degradation for non-critical features (charts optional)
- Database connection pooling and retry logic
- Circuit breaker pattern for external services (PDF generation)
- Automated failover and backup systems for patient data

### 5.5 Scalability Requirements
- Horizontal scaling capability for patient data volume
- Database read replicas for reporting queries
- Caching layer for frequently accessed timeline data (7/30/90 day caches)
- Asynchronous processing for PDF generation and data export
- Efficient database indexing strategies for aggregation queries

---

## User Stories

### As a Patient, I want to...

1. **View my complete medical history** so I can understand my health journey
   - As a patient, I want to see a chronological timeline of all my appointments, prescriptions, and diagnoses so I can understand my complete health history and track my health progress over time.

2. **View my prescription list** so I can manage my medications
   - As a patient, I want to view a list of all my prescriptions with medication names, dosages, and status so I can manage my medications effectively and know when I need refills.

3. **Download my prescriptions as PDF** so I can keep records
   - As a patient, I want to download each prescription as a professionally formatted PDF so I can maintain personal health records and share with other healthcare providers.

4. **Upload and view diagnostic reports** so I can access my test results
   - As a patient, I want to be able to view my diagnostic reports (lab results, imaging, etc.) in the portal so I can review my test results and share them with doctors.

5. **View dashboard analytics** so I can understand my health patterns
   - As a patient, I want to see KPI cards and charts summarizing my health data (appointments by specialty, monthly expenses, prescription compliance, upcoming visits) so I can understand my health patterns and make informed decisions.

6. **Export my complete health portfolio** so I can have personal records
   - As a patient, I want to export my complete medical history as a PDF or CSV file so I can have a portable record of my health data for personal records or to share with new healthcare providers.

### As a Doctor, I want to...

7. **Upload diagnostic reports** on behalf of patients so I can maintain complete medical records
   - As a doctor, I want to be able to upload diagnostic reports for my patients so I can maintain comprehensive medical records and ensure all test results are documented in the patient's profile.

8. **View patient timeline** so I can review patient history
   - As a doctor, I want to view a patient's complete medical timeline so I can quickly understand their health history before or during consultations.

### As a Staff Member, I want to...

9. **Assist with report management** so I can support the doctor's workflow
   - As staff, I want to assist with uploading and managing diagnostic reports so I can support the clinical workflow and ensure all patient documentation is complete.

---

## Acceptance Criteria

### Medical History Timeline
- [ ] Timeline displays chronological history of appointments, prescriptions, and diagnoses
- [ ] Filtering by date range, entry type, and status works correctly
- [ ] Search functionality returns relevant results
- [ ] Timeline entries are ordered by date (most recent first)
- [ ] Pagination works for long timelines

### Prescription Management
- [ ] Prescription list displays all patient prescriptions with correct information
- [ ] Status filters (active, completed, expired, cancelled) work correctly
- [ ] Search by medication name works
- [ ] PDF download generates professional, readable prescription PDF
- [ ] PDF includes all required information (medications, dosage, instructions, diagnosis, clinic info)
- [ ] PDF download is authenticated and authorized

### Diagnostic Reports
- [ ] Reports can be uploaded by authorized staff (Doctor/Staff role)
- [ ] Supported formats (PDF, JPEG, PNG) upload successfully
- [ ] Reports viewable by patient with correct formatting
- [ ] Report metadata displays correctly (date, type, description, physician)
- [ ] Download option works for original report files

### Patient Dashboard Analytics
- [ ] KPI cards display accurate, real-time data
- [ ] Specialty pie chart renders correct data with labels and tooltips
- [ ] Monthly expenses bar chart renders correct data with tooltips
- [ ] Prescription compliance tracker shows correct compliance rate
- [ ] Upcoming visit timeline displays correct upcoming appointments

### Data Export
- [ ] PDF export generates complete patient health portfolio with all sections
- [ ] CSV export produces well-structured file with proper headers
- [ ] Export operations are auditable (logged who exported what and when)
- [ ] Exported PDF/CSV contains accurate patient data
- [ ] Export completes within acceptable timeframes (<10 seconds)

### Technical Requirements
- [ ] All API endpoints respond within required timeframes
- [ ] System maintains WCAG 2.1 AA accessibility compliance
- [ ] All PHI access is properly audited and logged
- [ ] TypeScript code compiles with zero errors in strict mode
- [ ] ESLint passes with no warnings/errors
- [ ] Unit test coverage >80% for new code
- [ ] Deploy to staging with smoke tests passing