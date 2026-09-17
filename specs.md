## Detailed Spec

## System Architecture & Technical Specification

**Core User Roles & Permissions**

- **Admin:** System-wide management, user role assignment, platform analytics, clinic/department setup.
- **Staff:** Front-desk booking, patient check-in, doctor slot management on behalf of doctors, billing support.
- **Doctor:** Profile management, availability schedule setting, consultation dashboard, prescription generation, appointment handling.
- **Patient:** Profile management, doctor search, appointment booking, medical history access, personal dashboard.

---

### Data Models & Schemas

```
Users Table
  ├── id (UUID, PK)
  ├── email (String, Unique)
  ├── password_hash (String)
  ├── user_type (Enum: ADMIN, STAFF, DOCTOR, PATIENT)
  ├── phone (String)
  └── created_at / updated_at (Timestamp)

DoctorProfiles Table
  ├── id (UUID, PK)
  ├── user_id (FK -> Users.id)
  ├── full_name (String)
  ├── designation (String) - e.g., Senior Consultant
  ├── genres/specialties (Array[String]) - e.g., ["Cardiology", "Internal Medicine"]
  ├── symptoms_handled (Array[String]) - e.g., ["Chest Pain", "Arrhythmia"]
  ├── consultation_fee (Decimal)
  └── bio / qualifications (Text)

PatientProfiles Table
  ├── id (UUID, PK)
  ├── user_id (FK -> Users.id)
  ├── full_name (String)
  ├── dob (Date)
  ├── blood_group (Enum)
  ├── emergency_contact (String)
  └── medical_history_summary (Text)

Schedules / Slots Table
  ├── id (UUID, PK)
  ├── doctor_id (FK -> DoctorProfiles.id)
  ├── date (Date)
  ├── start_time (Time)
  ├── end_time (Time)
  └── status (Enum: AVAILABLE, BOOKED, CANCELLED)

Appointments Table
  ├── id (UUID, PK)
  ├── patient_id (FK -> PatientProfiles.id)
  ├── doctor_id (FK -> DoctorProfiles.id)
  ├── slot_id (FK -> Schedules.id)
  ├── appointment_status (Enum: SCHEDULED, COMPLETED, CANCELLED, NO_SHOW)
  ├── payment_status (Enum: PENDING, PAID, REFUNDED)
  └── symptom_notes (Text)

Prescriptions Table
  ├── id (UUID, PK)
  ├── appointment_id (FK -> Appointments.id)
  ├── doctor_id (FK -> DoctorProfiles.id)
  ├── patient_id (FK -> PatientProfiles.id)
  ├── diagnosis (Text)
  ├── medications (JSONB: [{ name, dosage, frequency, duration_days, instructions }])
  └── test_recommendations (Array[String])

```

---

### Core Module Specifications

#### 1. Doctor Discovery & Booking Engine

- **Search Filters:** Full-text search across `name`, `genre` (specialty), `designation`, and `symptoms`.
- **Booking Flow:**

1. Patient selects doctor $\rightarrow$ Views available slots on target dates.
2. Selects open time slot $\rightarrow$ Enters symptom description.
3. Confirms booking $\rightarrow$ System atomically locks slot (prevents double-booking via database-level transaction lock).
4. Status sets to `SCHEDULED`.

#### 2. Doctor Portal & Schedule Management

- **Bulk Slot Creation:** Endpoint/UI to generate recurring daily slots across date ranges (e.g., _Date A_ to _Date B_, recurring _07:00 PM – 09:00 PM_ in 20-minute intervals).
- **Appointment Operations:** Cancel appointment (triggers notification + opens slot/refund workflow), update time/date (triggers patient notification).
- **Digital Prescription Builder:** Integrated form to issue structured prescriptions attached directly to the `AppointmentID`. Auto-exports to downloadable PDF.

#### 3. Patient Portal

- **Prescriptions & Reports:** Downloadable list of past diagnostic reports and digitized prescriptions.
- **Appointment Tracking:** List view of Upcoming, Completed, and Cancelled visits with cancellation triggers according to time thresholds (e.g., allowed up to 2 hours prior).

---

### Dashboard Analytics Metrics

| Dashboard             | Key Visual Analytics Charts         | Metric Description                                                                                                                                                     |
| --------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| **Patient Dashboard** | **Health & Visit Trends**           | • Appointments count by specialty (Pie Chart)<br> • Monthly medical expense trends (Bar Chart)<br>• Prescription compliance & upcoming visit timelines                 |
| **Doctor Dashboard**  | **Clinical & Financial Operations** | • Daily/Weekly patient volume (Line Graph) <br>• Slot utilization rate: Booked vs. Available (Donut Chart) <br>• Revenue breakdown by consultation types (Stacked Bar) | <br> |

### Tech Stack

- next.js, typrescript, tailwindcss, shadcn ui, zsap
- node.js/express.js, jwt, postgreSQL, prisma
- react-hook-form, zod
- jwt, betterauth, cookies
- tanstack table
- recharts
