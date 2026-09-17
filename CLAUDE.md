# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**Doctor Appointment App** — A full-stack TypeScript monorepo for a healthcare appointment management platform with four user roles (Admin, Staff, Doctor, Patient), built with Next.js 15 (App Router) frontend and Express.js backend.

**Planned Architecture** (from `specs/techstack.md`):
```
monorepo/
├── apps/
│   ├── web/          # Next.js 15 + React 19 (App Router, RSC, Server Actions)
│   └── api/          # Express.js + TypeScript (REST API, Prisma, BetterAuth)
├── packages/
│   └── shared/       # Zod schemas, TypeScript types, constants, utilities
└── specs/            # Product documentation (mission, roadmap, techstack)
```

---

## Current State

**Repository is in pre-development phase.** Only specifications exist:
- `specs.md` — Original detailed specification
- `specs/mission.md` — Vision, objectives, success metrics
- `specs/roadmap.md` — 8-phase, 24-week delivery plan
- `specs/techstack.md` — Complete technology decisions with rationale
- `client/` — Empty (planned: Next.js app)
- `server/` — Empty (planned: Express API)

---

## Commands (Planned)

Once the monorepo is scaffolded with npm workspaces:

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

# Testing
npm run test             # Vitest (unit) + Playwright (E2E)
npm run test --workspace=web
npm run test --workspace=api

# Linting & Type Checking
npm run lint             # ESLint across monorepo
npm run typecheck        # tsc --noEmit across monorepo

# Code Quality
npm run format           # Prettier
npm run check            # lint + typecheck + format:check
```

---

## Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| **Monorepo (npm workspaces)** | Shared types/schemas eliminate drift; atomic commits across FE/BE |
| **Next.js App Router + RSC** | Reduced client bundle; server-side data fetching; Server Actions for mutations |
| **Express.js (not Next.js API routes)** | Clear separation; better for long-running processes (PDF, queues); independent scaling |
| **Prisma ORM** | Type-safe DB access; migration management; relation queries without N+1 |
| **BetterAuth (not NextAuth)** | Framework-agnostic; HttpOnly cookies; extensible plugin system |
| **Zod (shared package)** | Single source of truth for API contracts; inferred TS types; runtime validation both sides |
| **TanStack Query + React Hook Form** | Server state caching/optimistic updates; performant forms with Zod resolver |
| **Recharts** | React-native, declarative, accessible, composable dashboards |

---

## Data Models (from `specs.md`)

Core tables: `Users`, `DoctorProfiles`, `PatientProfiles`, `Schedules/Slots`, `Appointments`, `Prescriptions`

Key relationships:
- User → DoctorProfile / PatientProfile (1:1, by `user_type`)
- DoctorProfile → Schedules (1:M)
- Schedule → Appointment (1:1, via `slot_id`)
- Appointment → Prescription (1:M)

Critical enums: `user_type` (ADMIN/STAFF/DOCTOR/PATIENT), `slot_status` (AVAILABLE/BOOKED/CANCELLED), `appointment_status` (SCHEDULED/COMPLETED/CANCELLED/NO_SHOW), `payment_status` (PENDING/PAID/REFUNDED)

---

## Core Modules to Implement

1. **Doctor Discovery & Booking** — Full-text search, atomic slot locking, booking flow
2. **Doctor Portal & Schedule Management** — Bulk slot creation, prescription builder (PDF), analytics
3. **Patient Portal** — History, prescriptions, appointment tracking, dashboard analytics
4. **Admin & Staff Operations** — User management, clinic setup, front-desk tools, billing support

---

## Dashboard Analytics (from specs)

| Dashboard | Charts |
|-----------|--------|
| **Patient** | Appointments by specialty (Pie), Monthly expenses (Bar), Prescription compliance, Upcoming visits |
| **Doctor** | Daily/Weekly volume (Line), Slot utilization (Donut), Revenue by consultation type (Stacked Bar) |

---

## Environment Variables (Planned)

**Frontend** (`apps/web/.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

**Backend** (`apps/api/.env`):
```
DATABASE_URL=postgresql://...
REDIS_URL=redis://localhost:6379
JWT_SECRET=...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=http://localhost:4000
FRONTEND_URL=http://localhost:3000
PORT=4000
NODE_ENV=development
```

---

## Security Requirements

- Role-based authorization on every mutation
- Rate limiting on auth endpoints
- Helmet.js security headers, CORS restricted to frontend origin
- Prisma parameterized queries (SQL injection prevention)
- HttpOnly cookies with SameSite + CSRF protection
- Audit logging for all PHI access
- Dependency scanning in CI

---

## Development Workflow

1. **Start with shared package** — Define Zod schemas and types first
2. **Backend API** — Implement REST endpoints with validation, auth middleware
3. **Frontend** — Build UI with Server Components, use Server Actions for mutations
4. **Shared types** — Keep in sync via `packages/shared`; import in both apps

---

## References

- `specs/techstack.md` — Complete stack with versions, architecture diagram, migration paths
- `specs/roadmap.md` — Phase breakdown, milestones, dependency graph, risk mitigation
- `specs/mission.md` — Vision, success metrics, guiding principles

---

## Required Skills & Tooling

### Context7 (Mandatory for Library Documentation)

**Always use Context7** when working with any library, framework, SDK, API, or CLI tool — even well-known ones like React, Next.js, Prisma, Express, Tailwind, shadcn/ui, etc. Training data may not reflect recent changes.

**Workflow:**
1. Resolve library: `npx ctx7@latest library <name> "<specific question>"`
2. Pick best match (ID format: `/org/project`) by exact name, relevance, snippet count, source reputation, benchmark score
3. Fetch docs: `npx ctx7@latest docs <libraryId> "<specific question>"`
4. Answer using fetched documentation

**Do not use for:** refactoring, writing scripts from scratch, debugging business logic, code review, general programming concepts.

**If quota error:** Inform user to run `npx ctx7@latest login` or set `CONTEXT7_API_KEY` env var.

### Shadcn/ui (Component Library)

This project uses **shadcn/ui** with Tailwind CSS. Use the `shadcn` skill for:
- Adding, searching, fixing, debugging, styling, composing components
- Chat interfaces, component registries, presets, `--preset` codes
- `shadcn init`, `create an app with --preset`, `switch to --preset`

**Before implementing any UI component:**
1. Check if shadcn/ui has a suitable component via the skill
2. Use the skill for installation, customization, composition guidance
3. Follow project's `components.json` configuration

**Component Principles:**
- Accessible by default (Radix UI primitives)
- Customizable via Tailwind + CSS variables
- Copy-paste ownership (not a dependency)
- Compose complex UIs from primitives