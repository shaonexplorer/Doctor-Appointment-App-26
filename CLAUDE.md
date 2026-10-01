# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**Doctor Appointment App** — A full-stack TypeScript monorepo for a healthcare appointment management platform with four user roles (Admin, Staff, Doctor, Patient), built with Next.js 15 (App Router) frontend and Express.js backend.

**Architecture**:
```
monorepo/
├── apps/
│   ├── web/          # Next.js 15 + React 18 (App Router, RSC, Server Actions)
│   └── api/          # Express.js + TypeScript (REST API, Prisma, BetterAuth)
├── packages/
│   └── shared/       # Zod schemas, TypeScript types, constants, utilities
├── specs/            # Product documentation (mission, roadmap, techstack)
```

**Backend Architecture (Modular MVC)**:
```
apps/api/src/
├── modules/                    # Feature-based modules (self-contained)
│   ├── auth/                   # Authentication
│   ├── users/                  # User profiles & admin management
│   ├── doctors/                # Doctor discovery, profiles, schedules
│   ├── schedules/              # Slot management (CRUD, bulk, availability)
│   ├── appointments/           # Booking, cancellation, stats
│   ├── prescriptions/          # Prescription CRUD, recent lists
│   ├── patients/               # Patient dashboard, medical timeline, appointments
│   └── index.ts                # Module factory (createAllModules)
├── repositories/               # Data access layer (shared Prisma repositories)
├── lib/                        # Core infrastructure (BetterAuth, Redis, Rate Limiter, Prisma Adapter)
├── shared/                     # Shared utilities (middleware, utils, types, config)
└── index.ts                    # Application entry point
```

---

## Current State (as of 2026-10-01)

**✅ Phase 1: Foundation (Weeks 1-3) — Complete**
- Monorepo scaffolding, Next.js 15, Express.js, Prisma, BetterAuth, CI/CD
- Authentication: register, login, logout, password reset, email verification
- RBAC middleware, rate limiting, audit logging, PHI access tracking
- User profile endpoints with role-based access

**✅ Phase 2: Doctor Discovery & Patient Portal (Weeks 5-7) — Complete**
- Doctor search with ILIKE filters, infinite scroll, TanStack Query v5
- Patient dashboard, appointments, medical records, profile/settings
- All 10 Patient Portal design screens extracted to reusable components
- API endpoints for patients, appointments, doctors, schedules

**✅ Phase 3: Doctor Portal (Week 8-9) — Complete**
- Doctor Portal Shell (Sidebar, Header, MobileNav, MobileSidebar)
- 10 Dashboard components extracted from `doctor-dashboard.tsx`
- Appointments, Patients, Schedule, Prescriptions, Consultation, Profile components extracted
- Routing structure at `/doctor/*` with DOCTOR role protection

**🔄 Phase 3: Doctor Portal (Week 10-11) — In Progress**
- Backend API integration for doctor endpoints
- TanStack Query hooks for doctor data
- Real data wiring, tests, accessibility audit

---

## Commands

```bash
# Install dependencies
npm install

# Development (run both apps)
npm run dev              # Starts web (port 3000) + api (port 4000)

# Individual apps
npm run dev --workspace=web
npm run dev --workspace=api

# Build
npm run build            # Builds all packages
npm run build --workspace=web
npm run build --workspace=api

# Database
npm run db:generate --workspace=api   # Prisma generate
npm run db:push --workspace=api       # Push schema to DB
npm run db:migrate --workspace=api    # Run migrations
npm run db:studio --workspace=api     # Prisma Studio
npm run db:seed --workspace=api       # Seed development data

# Testing
npm run test             # Vitest (unit) + Playwright (E2E)

# Linting & Type Checking
npm run lint             # ESLint across monorepo
npm run typecheck        # tsc --noEmit across monorepo

# Code Quality
npm run format           # Prettier
npm run format:check     # Check formatting
npm run check            # lint + typecheck + format:check
```

---

## Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| **Monorepo (npm workspaces)** | Shared types/schemas eliminate drift; atomic commits across FE/BE |
| **Next.js App Router + RSC** | Reduced client bundle; server-side data fetching; Server Actions for mutations |
| **Express.js (not Next.js API routes)** | Clear separation; better for long-running processes; independent scaling |
| **Prisma ORM** | Type-safe DB access; migration management; relation queries without N+1 |
| **BetterAuth (not NextAuth)** | Framework-agnostic; HttpOnly cookies; extensible plugin system |
| **Zod (shared package)** | Single source of truth for API contracts; inferred TS types; runtime validation both sides |
| **TanStack Query + React Hook Form** | Server state caching/optimistic updates; performant forms with Zod resolver |
| **Recharts** | React-native, declarative, accessible, composable dashboards |
| **Clinical Precision Design System** (`design.md`) | Clinical Cobalt/Emerald/Amber/Red semantic palette; Manrope+Inter typography; 12/8/4-col responsive grid; 4-level elevation |
| **Modular MVC (Feature-based)** | Self-contained modules with controllers, services, routes, validators |
| **Module Factory Pattern** | Dependency injection via `createAllModules(repositories, prisma)`; decoupled, testable |

---

## Data Models

Core tables: `Users`, `DoctorProfiles`, `PatientProfiles`, `Schedules/Slots`, `Appointments`, `Prescriptions`

Key relationships:
- User → DoctorProfile / PatientProfile (1:1, by `user_type`)
- DoctorProfile → Schedules (1:M)
- Schedule → Appointment (1:1, via `slot_id`)
- Appointment → Prescription (1:M)

Critical enums: `user_type` (ADMIN/STAFF/DOCTOR/PATIENT), `slot_status` (AVAILABLE/BOOKED/CANCELLED), `appointment_status` (SCHEDULED/COMPLETED/CANCELLED/NO_SHOW), `payment_status` (PENDING/PAID/REFUNDED)

---

## Dashboard Analytics

| Dashboard | Charts |
|-----------|--------|
| **Patient** | Appointments by specialty (Pie), Monthly expenses (Bar), Prescription compliance, Upcoming visits |
| **Doctor** | Daily/Weekly volume (Line), Slot utilization (Donut), Revenue by consultation type (Stacked Bar) |

---

## Environment Variables

**Backend** (`apps/api/.env`):
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/doctor_appointment
REDIS_URL=redis://localhost:6379
JWT_SECRET=<32-char-random>
BETTER_AUTH_SECRET=<32-char-random>
BETTER_AUTH_URL=http://localhost:4000
FRONTEND_URL=http://localhost:3000
PORT=4000
NODE_ENV=development
```

**Frontend** (`apps/web/.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

> **Note**: PostgreSQL 16+ and Redis 7+ must be running locally. Update `DATABASE_URL` and `REDIS_URL` if using different hosts/ports.

---

## Design System (`design.md` — Clinical Precision)

**Color Palette** (WCAG 2.1 AA compliant):
- **Primary**: `#1E40AF` (Clinical Cobalt) — core actions, navigation, booking triggers
- **Secondary**: `#059669` (Vital Emerald) — confirmed bookings, available slots, positive states
- **Tertiary**: `#D97706` (Triage Amber) — pending slots, holds, unconfirmed records
- **Destructive**: `#DC2626` (Critical Red) — cancellations, no-shows, emergency alerts
- **Neutral**: `#0F172A` (Deep Navy) — primary typography, icons, table headers
- **Surfaces**: `#F8FAFC` (canvas), `#F1F5F9` (panels), `#FFFFFF` (cards), `#E2E8F0`/`#CBD5E1` (borders)

**Typography**:
- **Manrope** — display/headlines (page titles, modals, KPIs)
- **Inter** — clinical data, forms, tables, schedules (tabular nums: `tnum`, `zero`)

**Layout**: 12-col desktop (1200px+, 2rem gutters, 2.5rem margins), 8-col tablet (768-1199px), 4-col mobile (<768px); 8pt rhythm

**Elevation**: 4 levels — Level 0 (canvas), Level 1 (cards/rows, 1px outline + ambient shadow), Level 2 (active slots/popovers), Level 3 (modals/drawers with backdrop blur)

**CSS Variables Configured**: All semantic color tokens (`--primary`, `--secondary`, `--tertiary`, `--destructive`, `--background`, `--card`, `--muted`, `--border`, etc.) properly defined for both light and dark modes.

---

## Security Requirements

- Role-based authorization on every mutation
- Rate limiting on auth endpoints (5 req/min login, 3 req/hour register)
- Helmet.js security headers, CORS restricted to frontend origin
- Prisma parameterized queries (SQL injection prevention)
- HttpOnly cookies with SameSite + CSRF protection
- Audit logging for all PHI access
- Dependency scanning in CI
- Bcrypt password hashing (cost factor 12)

---

## Development Workflow

1. **Start with shared package** — Define Zod schemas and types first
2. **Backend API (Modular MVC)**:
   - Add feature module under `apps/api/src/modules/{feature}/`
   - Define types in `types/`, validators in `validators/`
   - Implement service in `services/`, controller in `controllers/`
   - Define routes in `routes/`, export from module `index.ts`
   - Register in `modules/index.ts` factory
3. **Frontend** — Build UI with Server Components, use Server Actions for mutations
4. **Shared types** — Keep in sync via `packages/shared`; import in both apps

**Patient Portal Navigation**: `PatientPortalShell` handles navigation internally via `routeMap` (no `onNavigate` prop). Active page auto-detected from `pathname`. Pages use `<PatientPortalShell active="Label">`.

**Doctor Portal Navigation**: `DoctorPortalShell` mirrors PatientPortalShell pattern with `routeMap` for 9 navigation items.

---

## ⚠️ STRICT: Component Extraction from Design Screens

**When implementing features, you MUST extract and reuse components from `screens/Patient Portal/` and `screens/Doctor Portal/` instead of creating new ones from scratch.**

### Patient Portal Screens (10 files)
- `patient-dashboard.tsx`, `patient-appointments.tsx`, `patient-portal-shell.tsx`
- `patient-records.tsx`, `patient-profile-settings.tsx`, `booking-flow.tsx`
- `doctor-profile.tsx`, `find-doctors.tsx`, `global-search.tsx`, `notification-center.tsx`

### Doctor Portal Screens (10 files)
- `doctor-dashboard.tsx`, `doctor-appointments.tsx`, `doctor-patients.tsx`
- `doctor-schedule.tsx`, `doctor-prescription.tsx`, `doctor-consultation.tsx`
- `doctor-profile.tsx`, `doctor-portal-shell.tsx`, `global-search.tsx`, `notification-center.tsx`

### Extraction Rules (MANDATORY)
1. **Before creating ANY new component**, check the relevant `screens/` directory
2. **Extract to `apps/web/src/components/`** — Create reusable components in the web app
3. **Map to Design System** — Use Clinical Precision tokens from `design.md`
4. **Remove hardcoded values** — Replace mock data with props, use TypeScript interfaces
5. **Add proper accessibility** — ARIA labels, keyboard navigation, focus management
6. **Make responsive** — Use 4/8/12 column breakpoints per design.md

**DO NOT create duplicate components. DO NOT ignore the design system tokens. ALWAYS extract first, then adapt.**

---

## Active Routes

### Patient Portal
| Route | Page | Shell Active Label |
|-------|------|-------------------|
| `/patient/dashboard` | Patient Dashboard | `Dashboard` |
| `/patient/appointments` | Appointments | `Appointments` |
| `/patient/records` | Medical Records | `Medical Records` |
| `/patient/profile` | Profile | `Profile` |
| `/patient/settings` | Settings | `Settings` |
| `/patient/notifications` | Notification Center | `Notifications` |
| `/doctors/search` | Find Doctors | `Find Doctors` |
| `/doctors/[id]` | Doctor Profile | `Doctor Profile` |
| `/doctors/[id]/book` | Booking Flow | `Book Appointment` |

### Doctor Portal
| Route | Page | Shell Active Label |
|-------|------|-------------------|
| `/doctor/dashboard` | Doctor Dashboard | `Dashboard` |
| `/doctor/schedule` | Schedule | `Schedule` |
| `/doctor/patients` | Patients | `Patients` |
| `/doctor/appointments` | Appointments | `Appointments` |
| `/doctor/prescriptions` | Prescriptions | `Prescriptions` |
| `/doctor/consultation` | Consultation | `Consultation` |
| `/doctor/profile` | Profile | `Profile` |
| `/doctor/notifications` | Notifications | `Notifications` |
| `/doctor/settings` | Settings | `Settings` |

---

## Key API Endpoints (Current)

### Doctor Search
- `GET /api/doctors` — Search with filters (search, specialty, fee range, availability, sort, pagination)
- `GET /api/doctors/:id` — Single doctor profile with schedules
- `GET /api/doctors/:id/schedule` — Available slots for booking

### Patient Module
- `GET /api/patients/dashboard/stats` — Dashboard KPIs, charts data
- `GET /api/patients/timeline` — Medical timeline (appointments + prescriptions)
- `GET /api/patients/appointments/upcoming` — Upcoming appointments with details
- `GET /api/patients/appointments/completed` — Completed appointments with prescriptions

### Doctor Portal (Week 10 - To Implement)
- `GET /api/appointments/stats/doctor` — Doctor dashboard KPIs
- `GET /api/appointments/doctor` — Doctor's appointments with filters
- `GET /api/patients/doctor` — Doctor's patient list with filters
- `GET /api/schedules/doctor` — Doctor's full schedule with slots
- `POST /api/schedules/doctor/bulk` — Bulk create slots
- `GET /api/prescriptions/doctor/recent` — Doctor's recent prescriptions
- `GET /api/users/me/doctor-profile` — Doctor's own profile with stats

---

## Backend Module Structure

```
modules/{feature}/
├── types/index.ts        # Module-specific TypeScript interfaces
├── validators/index.ts   # Zod schemas + typed validation middleware
├── services/{Feature}Service.ts  # Business logic (depends on repositories)
├── controllers/{Feature}Controller.ts  # HTTP handlers (depends on services)
├── routes/{feature}Routes.ts         # Express router (depends on controller)
└── index.ts              # Module factory + exports
```

**Dependency Flow**: `Repository → Service → Controller → Routes`

---

## Required Skills & Tooling

### Context7 (Mandatory for Library Documentation)

**Always use Context7** when working with any library, framework, SDK, API, or CLI tool.

**Workflow:**
1. Resolve library: `npx ctx7@latest library <name> "<specific question>"`
2. Pick best match (ID format: `/org/project`) by exact name, relevance, snippet count, source reputation, benchmark score
3. Fetch docs: `npx ctx7@latest docs <libraryId> "<specific question>"`
4. Answer using fetched documentation

**If quota error:** Run `npx ctx7@latest login` or set `CONTEXT7_API_KEY` env var.

### Shadcn/ui (Component Library)

This project uses **shadcn/ui** with Tailwind CSS, customized to the **Clinical Precision** design system (`design.md`). Use the `shadcn` skill for component installation, customization, composition.

**Before implementing any UI component:**
1. Check if shadcn/ui has a suitable component via the skill
2. Use the skill for installation, customization, composition guidance
3. Follow project's `components.json` configuration
4. **Map design tokens from `design.md`** — colors, typography, spacing, radius, elevation to Tailwind config