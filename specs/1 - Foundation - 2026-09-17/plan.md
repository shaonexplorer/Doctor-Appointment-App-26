# Phase 1: Foundation — Implementation Plan

**Duration:** Weeks 1–4  
**Goal:** Core infrastructure, authentication, and base data models

---

## Overview

This phase establishes the monorepo foundation, database schema, authentication system, and basic UI layout. All subsequent phases depend on this infrastructure.

---

## Week-by-Week Breakdown

### Week 1: Monorepo Scaffolding & Database Setup

#### Tasks
- [ ] Initialize npm workspace monorepo structure
- [ ] Create `apps/web` (Next.js 15 + React 19 + App Router)
- [ ] Create `apps/api` (Express.js + TypeScript)
- [ ] Create `packages/shared` (Zod schemas, types, constants)
- [ ] Configure TypeScript project references
- [ ] Set up ESLint, Prettier, Husky pre-commit hooks
- [ ] Configure Prisma with PostgreSQL
- [ ] Define core Prisma schema (Users, DoctorProfiles, PatientProfiles, Schedules, Appointments, Prescriptions)
- [ ] Run initial migration and verify database connection

#### Deliverables
- Working monorepo with `npm install` and `npm run dev` commands
- Prisma schema deployed to PostgreSQL
- Shared package exporting types and Zod schemas

---

### Week 2: Authentication System

#### Tasks
- [ ] Install and configure BetterAuth in `apps/api`
- [ ] Implement JWT token generation with HttpOnly cookies
- [ ] Create authentication endpoints:
  - `POST /api/auth/register` — User registration with role selection
  - `POST /api/auth/login` — Email/password login
  - `POST /api/auth/logout` — Session termination
  - `POST /api/auth/forgot-password` — Password reset request
  - `POST /api/auth/reset-password` — Password reset confirmation
  - `GET /api/auth/me` — Current session user
- [ ] Implement email verification flow
- [ ] Add rate limiting on auth endpoints (5 req/min for login, 3 req/hour for register)
- [ ] Configure CORS for frontend origin only
- [ ] Add Helmet.js security headers

#### Deliverables
- Functional auth API with secure cookie-based sessions
- Password hashing (bcrypt, cost factor 12)
- Rate-limited auth endpoints

---

### Week 3: Role-Based Access Control & Protected Routes

#### Tasks
- [ ] Define role enum: `ADMIN`, `STAFF`, `DOCTOR`, `PATIENT`
- [ ] Implement role middleware for Express (`requireRole`, `requireAnyRole`)
- [ ] Create role-based route protection on API
- [ ] Implement BetterAuth plugins for session management
- [ ] Add audit logging middleware for PHI access
- [ ] Create user profile endpoints:
  - `GET /api/users/me` — Current user profile
  - `PATCH /api/users/me` — Update profile
  - `GET /api/users/:id` — Admin/Staff view any user

#### Deliverables
- RBAC enforced on all API routes
- Role context available in request handlers
- Audit logs for sensitive operations

---

### Week 4: Frontend Foundation & CI/CD

#### Tasks
- [ ] Set up Next.js 15 App Router in `apps/web`
- [ ] Install and configure shadcn/ui with Tailwind CSS
- [ ] Create base layout components:
  - Root layout with providers (Auth, Query, Theme)
  - Header/Navigation with role-aware links
  - Sidebar for authenticated layouts
  - Footer
- [ ] Implement authentication pages:
  - `/login` — Login form with validation
  - `/register` — Multi-step registration (role selection → details)
  - `/forgot-password` — Password reset request
  - `/reset-password` — Password reset form
  - `/verify-email` — Email verification page
- [ ] Create protected route wrapper (client-side role checks)
- [ ] Set up TanStack Query for server state
- [ ] Configure GitHub Actions CI/CD pipeline:
  - Lint + typecheck on PR
  - Unit tests on PR
  - Build verification
  - Deploy to staging on merge to main
- [ ] Add environment variable validation (Zod schema for env)

#### Deliverables
- Running dev environment with hot reload (web:3000, api:4000)
- Complete auth UI flows
- CI/CD pipeline operational
- Protected frontend routes with role context

---

## Technical Architecture

### Monorepo Structure
```
monorepo/
├── apps/
│   ├── web/          # Next.js 15 (port 3000)
│   └── api/          # Express.js (port 4000)
├── packages/
│   └── shared/       # Zod schemas, TS types, constants
├── specs/            # Documentation (this folder)
└── turbo.json        # Turborepo config (optional)
```

### Database Schema (Core Tables)

```prisma
// Core models from specs/techstack.md
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  passwordHash  String
  firstName     String
  lastName      String
  phone         String?
  userType      UserType @default(PATIENT)
  emailVerified Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  doctorProfile DoctorProfile?
  patientProfile PatientProfile?
  appointments  Appointment[] @relation("PatientAppointments")
  doctorAppointments Appointment[] @relation("DoctorAppointments")
  prescriptions Prescription[]
}

model DoctorProfile {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  specialty   String
  designation String
  licenseNo   String   @unique
  bio         String?
  fee         Decimal  @db.Decimal(10, 2)
  schedules   Schedule[]
}

model PatientProfile {
  id        String   @id @default(cuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  dob       DateTime?
  gender    Gender?
  address   String?
  emergencyContact String?
  appointments Appointment[]
}

model Schedule {
  id          String   @id @default(cuid())
  doctorId    String
  doctor      DoctorProfile @relation(fields: [doctorId], references: [id], onDelete: Cascade)
  startTime   DateTime
  endTime     DateTime
  status      SlotStatus @default(AVAILABLE)
  appointment Appointment?
}

model Appointment {
  id              String           @id @default(cuid())
  patientId       String
  patient         User             @relation("PatientAppointments", fields: [patientId], references: [id])
  doctorId        String
  doctor          User             @relation("DoctorAppointments", fields: [doctorId], references: [id])
  slotId          String           @unique
  slot            Schedule         @relation(fields: [slotId], references: [id])
  status          AppointmentStatus @default(SCHEDULED)
  symptoms        String?
  notes           String?
  paymentStatus   PaymentStatus    @default(PENDING)
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
  prescriptions   Prescription[]
}

model Prescription {
  id            String   @id @default(cuid())
  appointmentId String
  appointment   Appointment @relation(fields: [appointmentId], references: [id], onDelete: Cascade)
  doctorId      String
  patientId     String
  diagnosis     String
  medications   Json     // Structured medication array
  tests         String?
  notes         String?
  pdfUrl        String?
  createdAt     DateTime @default(now())
}
```

### Shared Package Exports
```typescript
// packages/shared/src/index.ts
export * from './schemas'      // Zod schemas for API contracts
export * from './types'        // Inferred TypeScript types
export * from './constants'    // Enums, config constants
export * from './utils'        // Shared utilities
```

---

## Dependencies & Prerequisites

| Dependency | Version | Purpose |
|------------|---------|---------|
| Node.js | 20.x LTS | Runtime |
| PostgreSQL | 16+ | Primary database |
| Redis | 7+ | Session cache, rate limiting |
| pnpm | 9+ | Package manager (workspaces) |

### Required Environment Variables

**Backend** (`apps/api/.env`)
```
DATABASE_URL=postgresql://user:pass@localhost:5432/doctor_app
REDIS_URL=redis://localhost:6379
JWT_SECRET=<32-char-random>
BETTER_AUTH_SECRET=<32-char-random>
BETTER_AUTH_URL=http://localhost:4000
FRONTEND_URL=http://localhost:3000
PORT=4000
NODE_ENV=development
```

**Frontend** (`apps/web/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Monorepo tooling complexity | Start with npm workspaces (native), migrate to Turborepo if needed |
| Auth cookie domain issues | Use `localhost` for dev, configure proper domain in production |
| Prisma migration conflicts | Single developer owns schema; use `db push` for dev, migrations for prod |
| CORS misconfiguration | Explicit allowlist: only `FRONTEND_URL` origin |

---

## Definition of Done (Phase 1)

- [ ] `npm install` succeeds in root and all workspaces
- [ ] `npm run dev` starts both web (3000) and api (4000) with hot reload
- [ ] User can register, verify email, login, logout
- [ ] JWT stored in HttpOnly cookie, not localStorage
- [ ] Role middleware protects API routes correctly
- [ ] Frontend shows role-appropriate navigation
- [ ] CI pipeline passes on main branch
- [ ] All core tables exist in PostgreSQL with correct relations
- [ ] Prisma Studio accessible (`npm run db:studio`)
- [ ] TypeScript compiles with zero errors (`npm run typecheck`)
- [ ] ESLint passes with zero warnings (`npm run lint`)
- [ ] Prettier formats code consistently (`npm run format:check`)

---

## Next Phase Dependencies

Phase 2 (Doctor Discovery & Patient Portal) requires:
- User authentication with role context
- DoctorProfile and PatientProfile models
- Protected API routes with role middleware
- Base UI layout with navigation

Phase 3 (Doctor Portal) requires:
- DoctorProfile CRUD endpoints
- Schedule/Slot models
- Doctor role authentication

Phase 5 (Admin/Staff) requires:
- Admin/Staff role middleware
- User management endpoints
- Audit logging infrastructure