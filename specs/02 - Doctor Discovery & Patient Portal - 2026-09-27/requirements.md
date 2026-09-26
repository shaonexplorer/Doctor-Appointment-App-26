# Phase 2: Doctor Discovery & Patient Portal — Requirements Specification

**Version:** 1.0  
**Date:** 2026-09-27  
**Status:** Draft

---

## Functional Requirements

### FR-01: Doctor Profile Management

| ID | Requirement | Priority | Actor |
|----|-------------|----------|-------|
| FR-01.1 | Admin/Staff can create doctor profiles with: full name, specialty, designation, years of experience, consultation fee, bio, education, languages, clinic address, profile photo | Must | Admin/Staff |
| FR-01.2 | Doctors can update their own profile (except specialty which requires admin approval) | Must | Doctor |
| FR-01.3 | Doctor profiles are publicly viewable with schedule preview | Must | Patient |
| FR-01.4 | Profile photo upload with validation (max 5MB, JPEG/PNG/WebP) | Should | Doctor |
| FR-01.5 | Specialty must be selected from predefined enum list | Must | System |

### FR-02: Doctor Search & Discovery

| ID | Requirement | Priority | Actor |
|----|-------------|----------|-------|
| FR-02.1 | Full-text search across: doctor name, specialty, designation, bio, symptoms treated | Must | Patient |
| FR-02.2 | Filter by: specialty (multi-select), consultation fee range (min/max), availability (next 7 days), language, rating | Must | Patient |
| FR-02.3 | Sort by: relevance (default), fee (low/high), rating, experience, next available slot | Must | Patient |
| FR-02.4 | Paginated results (20 per page) with infinite scroll | Must | Patient |
| FR-02.5 | Search results display: photo, name, designation, specialty, rating, fee, next available slot, clinic location | Must | Patient |
| FR-02.6 | Search latency <300ms (p95) for 10k doctor records | Must | System |
| FR-02.7 | Empty state with suggestions when no results | Should | Patient |

### FR-03: Doctor Detail View

| ID | Requirement | Priority | Actor |
|----|-------------|----------|-------|
| FR-03.1 | Display: photo, full name, designation, specialty badges, rating, review count, years experience, consultation fee, clinic address, languages, education, bio | Must | Patient |
| FR-03.2 | Weekly schedule calendar showing available slots (Mon-Sun, 7-day view) | Must | Patient |
| FR-03.3 | Slot display: date, start/end time, status (Available/Booked), consultation type (In-person/Video) | Must | Patient |
| FR-03.4 | Click available slot → initiates booking flow | Must | Patient |
| FR-03.5 | Show doctor's other clinic locations (if multiple) | Could | Patient |

### FR-04: Slot Management & Availability

| ID | Requirement | Priority | Actor |
|----|-------------|----------|-------|
| FR-04.1 | Doctors create schedules via bulk wizard (date range, recurring days, time blocks, interval) — Phase 3 | N/A | Doctor |
| FR-04.2 | Slots have status: AVAILABLE, LOCKED, BOOKED, CANCELLED | Must | System |
| FR-04.3 | Real-time slot availability API with 30-second cache TTL | Must | System |
| FR-04.4 | Slot locking on booking initiation (2-minute TTL) | Must | System |
| FR-04.5 | Automatic lock release on timeout or user navigation away | Must | System |
| FR-04.6 | Slot conflict prevention at database level | Must | System |

### FR-05: Booking Flow

| ID | Requirement | Priority | Actor |
|----|-------------|----------|-------|
| FR-05.1 | Step 1: Slot selection from calendar/time grid | Must | Patient |
| FR-05.2 | Step 2: Symptom notes (optional, max 1000 chars, plain text) | Must | Patient |
| FR-05.3 | Step 3: Confirmation summary (doctor, date/time, fee, symptoms, clinic) | Must | Patient |
| FR-05.4 | Step 4: Success screen with appointment ID, calendar download (.ics), next steps | Must | Patient |
| FR-05.5 | Atomic transaction: lock slot → create appointment → confirm | Must | System |
| FR-05.6 | Double-booking prevention: DB row-level lock (SELECT FOR UPDATE) | Must | System |
| FR-05.7 | Booking confirmation email/SMS stub (queue-ready) | Must | System |
| FR-05.8 | Patient can only book one slot per time window | Should | System |

### FR-06: Appointment Management

| ID | Requirement | Priority | Actor |
|----|-------------|----------|-------|
| FR-06.1 | Patient views appointments in tabs: Upcoming, Completed, Cancelled | Must | Patient |
| FR-06.2 | Upcoming appointments show: doctor, date/time, status, clinic, actions (Cancel, Reschedule) | Must | Patient |
| FR-06.3 | Completed appointments show: doctor, date/time, prescription link, rating option | Must | Patient |
| FR-06.4 | Cancel appointment with 2-hour threshold policy | Must | Patient |
| FR-06.5 | Cancellation within 2 hours → fee forfeit (configurable) | Should | System |
| FR-06.6 | Cancellation >2 hours → full refund (stub) | Should | System |
| FR-06.7 | Reschedule flow: cancel current → search same doctor → book new | Could | Patient |
| FR-06.8 | Appointment detail view with full information | Must | Patient |

### FR-07: Patient Dashboard

| ID | Requirement | Priority | Actor |
|----|-------------|----------|-------|
| FR-07.1 | KPI Cards: Upcoming count, Completed count, Total spent, Next appointment | Must | Patient |
| FR-07.2 | Upcoming visits timeline (vertical, next 30 days) | Must | Patient |
| FR-07.3 | Quick actions: Book appointment, View prescriptions, Edit profile | Must | Patient |
| FR-07.4 | Recent activity feed (last 10 actions) | Should | Patient |
| FR-07.5 | Prescription compliance indicator (upcoming doses) | Could | Patient |

### FR-08: Notifications (Stubs)

| ID | Requirement | Priority | Actor |
|----|-------------|----------|-------|
| FR-08.1 | Booking confirmation notification (email/SMS stub) | Must | System |
| FR-08.2 | Cancellation notification (email/SMS stub) | Must | System |
| FR-08.3 | 24-hour reminder notification (stub) | Should | System |
| FR-08.4 | 2-hour reminder notification (stub) | Should | System |
| FR-08.5 | Notification queue architecture (BullMQ ready) | Must | System |

---

## Non-Functional Requirements

### Performance

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-01 | Doctor search response time (p95) | <300ms |
| NFR-02 | Slot availability API response time (p95) | <200ms |
| NFR-03 | Booking transaction completion | <500ms |
| NFR-04 | Dashboard load time (p95) | <1s |
| NFR-05 | Concurrent booking attempts on same slot | Zero double-bookings |
| NFR-06 | Support 1000 concurrent users (Phase 6 target) | Architecture ready |

### Security

| ID | Requirement | Implementation |
|----|-------------|----------------|
| NFR-07 | Role-based access on all endpoints | RBAC middleware from Phase 1 |
| NFR-08 | Rate limiting on booking endpoints | 10 req/min per user |
| NFR-09 | Input sanitization on symptom notes | Zod validation + DOMPurify |
| NFR-10 | Audit logging for PHI access | Audit middleware from Phase 1 |
| NFR-11 | CSRF protection on mutations | BetterAuth + SameSite cookies |

### Accessibility

| ID | Requirement | Standard |
|----|-------------|----------|
| NFR-12 | Semantic HTML for all pages | WCAG 2.1 AA |
| NFR-13 | Keyboard navigation for booking flow | WCAG 2.1 AA |
| NFR-14 | ARIA labels on interactive elements | WCAG 2.1 AA |
| NFR-15 | Color contrast ratios | WCAG 2.1 AA (design.md tokens) |
| NFR-16 | Focus management in modals/steps | WCAG 2.1 AA |

### Reliability

| ID | Requirement | Implementation |
|----|-------------|----------------|
| NFR-17 | Database transaction atomicity | Prisma transactions |
| NFR-18 | Idempotent booking confirmation | Idempotency keys |
| NFR-19 | Graceful degradation on notification failure | Queue with retry |
| NFR-20 | Cache invalidation on data changes | Event-driven invalidation |

---

## Data Requirements

### DoctorProfile Model (Existing - Enhanced)

```prisma
model DoctorProfile {
  id              String       @id @default(cuid())
  userId          String       @unique
  user            User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  specialty       Specialty
  designation     String
  experienceYears Int
  consultationFee Decimal      @db.Decimal(10, 2)
  bio             String?
  education       String?
  languages       String[]     // Array of language codes
  clinicAddress   String
  clinicCity      String
  clinicState     String
  clinicPincode   String
  profilePhoto    String?
  searchVector    Unsupported("tsvector")?  // For full-text search
  isVerified      Boolean      @default(false)
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
  
  schedules       Schedule[]
  appointments    Appointment[]
  
  @@index([specialty])
  @@index([clinicCity])
  @@index([consultationFee])
}
```

### Schedule/Slot Model (Existing)

```prisma
model Schedule {
  id        String        @id @default(cuid())
  doctorId  String
  doctor    DoctorProfile @relation(fields: [doctorId], references: [id], onDelete: Cascade)
  date      DateTime      @db.Date
  startTime DateTime      @db.Time
  endTime   DateTime      @db.Time
  interval  Int           @default(15)  // minutes
  type      ConsultationType @default(IN_PERSON)
  status    SlotStatus    @default(AVAILABLE)
  patientId String?
  patient   User?         @relation(fields: [patientId], references: [id], onDelete: SetNull)
  appointment Appointment?
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
  
  @@unique([doctorId, date, startTime])
  @@index([doctorId, date])
  @@index([status])
  @@index([date, status])
}
```

### Appointment Model (Existing)

```prisma
model Appointment {
  id            String            @id @default(cuid())
  slotId        String            @unique
  slot          Schedule          @relation(fields: [slotId], references: [id], onDelete: Cascade)
  patientId     String
  patient       User              @relation(fields: [patientId], references: [id], onDelete: Cascade)
  doctorId      String
  doctor        User              @relation(fields: [doctorId], references: [id], onDelete: Cascade)
  symptoms      String?
  status        AppointmentStatus @default(SCHEDULED)
  paymentStatus PaymentStatus     @default(PENDING)
  consultationFee Decimal         @db.Decimal(10, 2)
  paidAmount    Decimal           @default(0) @db.Decimal(10, 2)
  cancelledAt   DateTime?
  cancellationReason String?
  completedAt   DateTime?
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt
  
  prescriptions Prescription[]
  
  @@index([patientId, status])
  @@index([doctorId, status])
  @@index([createdAt])
}
```

### Enums

```prisma
enum Specialty {
  CARDIOLOGY
  DERMATOLOGY
  ENDOCRINOLOGY
  GASTROENTEROLOGY
  GENERAL_MEDICINE
  GYNECOLOGY
  NEUROLOGY
  ONCOLOGY
  OPHTHALMOLOGY
  ORTHOPEDICS
  PEDIATRICS
  PSYCHIATRY
  PULMONOLOGY
  UROLOGY
  OTHER
}

enum SlotStatus {
  AVAILABLE
  LOCKED
  BOOKED
  CANCELLED
}

enum AppointmentStatus {
  SCHEDULED
  COMPLETED
  CANCELLED
  NO_SHOW
}

enum PaymentStatus {
  PENDING
  PAID
  REFUNDED
  PARTIAL
}

enum ConsultationType {
  IN_PERSON
  VIDEO
  PHONE
}
```

---

## API Contracts

### Doctor Search

**GET** `/api/doctors/search`

**Query Parameters:**
```typescript
interface DoctorSearchParams {
  q?: string;                    // Full-text search query
  specialty?: Specialty[];       // Multi-select
  minFee?: number;
  maxFee?: number;
  availableFrom?: string;        // ISO date
  availableTo?: string;          // ISO date
  language?: string[];
  sortBy?: 'relevance' | 'fee_asc' | 'fee_desc' | 'rating' | 'experience' | 'availability';
  page?: number;                 // Default: 1
  limit?: number;                // Default: 20, max: 50
}
```

**Response:**
```typescript
interface DoctorSearchResponse {
  data: DoctorSearchResult[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface DoctorSearchResult {
  id: string;
  name: string;
  designation: string;
  specialty: Specialty;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  consultationFee: number;
  clinicCity: string;
  clinicState: string;
  profilePhoto?: string;
  nextAvailableSlot?: {
    date: string;
    startTime: string;
    type: ConsultationType;
  };
}
```

### Slot Availability

**GET** `/api/schedules/availability`

**Query Parameters:**
```typescript
interface AvailabilityParams {
  doctorId: string;
  from: string;    // ISO date (inclusive)
  to: string;      // ISO date (inclusive)
  type?: ConsultationType;
}
```

**Response:**
```typescript
interface SlotAvailabilityResponse {
  data: DaySlots[];
}

interface DaySlots {
  date: string;           // ISO date
  slots: TimeSlot[];
}

interface TimeSlot {
  id: string;
  startTime: string;      // HH:mm
  endTime: string;        // HH:mm
  type: ConsultationType;
  status: SlotStatus;
}
```

### Create Appointment

**POST** `/api/appointments`

**Request Body:**
```typescript
interface CreateAppointmentRequest {
  slotId: string;
  symptoms?: string;      // Max 1000 chars
}
```

**Response:**
```typescript
interface AppointmentResponse {
  id: string;
  slot: TimeSlot;
  doctor: DoctorSummary;
  patient: PatientSummary;
  symptoms?: string;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  consultationFee: number;
  createdAt: string;
  confirmationCode: string;
}
```

---

## UI/UX Requirements

### Design System Compliance

All components must use **Clinical Precision** design tokens from `design.md`:

| Component | Token Reference |
|-----------|-----------------|
| Primary Actions (Book, Confirm) | Primary: `#1E40AF` (Clinical Cobalt) |
| Available Slots | Secondary: `#059669` (Vital Emerald) |
| Pending/Locked Slots | Tertiary: `#D97706` (Triage Amber) |
| Cancelled/No-show | Destructive: `#DC2626` (Critical Red) |
| Typography - Headlines | Manrope, 600 weight |
| Typography - Clinical Data | Inter, 400/500 weight, tabular nums |
| Card Elevation | Level 1 (1px outline + ambient shadow) |
| Modal Elevation | Level 3 (backdrop blur + elevated shadow) |
| Border Radius | 6px (slots), 8px (cards), 12px (modals) |
| Spacing | 8pt rhythm, 4pt increments |

### Responsive Breakpoints

| Breakpoint | Columns | Gutter | Margin |
|------------|---------|--------|--------|
| Mobile (<768px) | 4 | 1rem | 1rem |
| Tablet (768-1199px) | 8 | 1.5rem | 1.5rem |
| Desktop (1200px+) | 12 | 2rem | 2.5rem |

### Component Specifications

#### DoctorCard
- Aspect ratio: 16:10 for photo area
- Elevation: Level 1
- Hover: Level 2 elevation
- Status chip: Available (Emerald), Booked (Amber), Unavailable (Neutral)

#### TimeSlotPicker
- Dimensions: 36px height, min-width 80px
- Border radius: 6px
- States: Default (outline), Hover (bg: primary-50), Selected (bg: primary, text: white), Disabled (opacity-50)
- Touch target: 44px minimum

#### Booking Flow Steps
- Step indicator: 4 steps, current highlighted
- Progress bar: Primary color
- Back navigation preserved state
- Confirmation: Modal with summary, not new page

---

## Acceptance Criteria

### AC-01: Doctor Search
- [ ] Search returns results in <300ms for 10k records
- [ ] Filters work independently and in combination
- [ ] Pagination loads next page without full reload
- [ ] Empty state shows helpful message
- [ ] Results sortable by all specified fields

### AC-02: Booking Flow
- [ ] User can complete booking in 4 steps
- [ ] Slot locked during booking (2 min TTL)
- [ ] Concurrent booking on same slot → only one succeeds
- [ ] Confirmation shows all details + calendar download
- [ ] Email/SMS stub triggered on success

### AC-03: Appointment Management
- [ ] Tabs filter correctly by status
- [ ] Cancel within 2 hours shows warning
- [ ] Cancel >2 hours processes immediately
- [ ] Reschedule preserves doctor selection
- [ ] Completed appointments link to prescriptions

### AC-04: Dashboard
- [ ] KPIs display correct counts
- [ ] Timeline shows next 30 days
- [ ] Quick actions navigate correctly
- [ ] Loads in <1s

### AC-05: Accessibility
- [ ] All pages pass axe-core audit
- [ ] Keyboard navigation works end-to-end
- [ ] Screen reader announces status changes
- [ ] Focus visible on all interactive elements

---

## Test Scenarios

### Unit Tests (Target: >80% coverage)
- Doctor search service with various filter combinations
- Slot locking/unlocking logic
- Appointment creation transaction
- Cancellation threshold calculation
- Dashboard stats aggregation

### Integration Tests
- Doctor search API with database
- Booking flow API (full transaction)
- Appointment CRUD with auth
- Notification queue publishing

### E2E Tests (Playwright)
1. **Happy Path**: Search → Filter → Select Doctor → Select Slot → Enter Symptoms → Confirm → Success
2. **Double Booking**: Two users attempt same slot simultaneously
3. **Cancel Within 2hrs**: Book → Cancel within 2 hours → Fee forfeit warning
4. **Cancel Outside 2hrs**: Book → Cancel next day → Full refund
5. **Dashboard**: Login → Dashboard shows correct KPIs → Navigate to appointments

---

## Migration Notes

### Database Migrations Required
1. Add `searchVector` column to `DoctorProfile` with GIN index
2. Create materialized view `doctor_search_view`
3. Add trigger function for `searchVector` auto-update
4. Verify existing indexes on `Schedule` and `Appointment` tables

### Seed Data
- 50+ doctor profiles across specialties
- 30 days of schedules per doctor
- Sample appointments for testing

---

## Future Considerations (Out of Scope)

- [ ] Advanced search: symptom-based doctor matching (Phase 7 AI)
- [ ] Video consultation integration (Phase 7)
- [ ] Waitlist for booked slots
- [ ] Recurring appointments
- [ ] Multi-clinic doctor profiles
- [ ] Doctor reviews and ratings
- [ ] Insurance verification during booking
- [ ] Payment integration (Phase 7)