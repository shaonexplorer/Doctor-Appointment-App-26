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
└── docker-compose.yml
```

---

## Current State (Week 1 Complete ✅)

**Phase 1: Foundation — Week 1 Deliverables Complete:**

- [x] **Monorepo Scaffolding**: npm workspaces with 3 packages (`apps/web`, `apps/api`, `packages/shared`)
- [x] **Next.js 15 App Router**: Configured with TypeScript, Tailwind CSS, Turbopack
- [x] **Express.js API**: TypeScript server with Prisma, BetterAuth, structured routes
- [x] **Shared Package**: Zod schemas, TypeScript types, constants, utilities with project references
- [x] **TypeScript Config**: Root + workspace configs with project references for type safety
- [x] **Code Quality**: ESLint, Prettier, Husky pre-commit hooks, lint-staged
- [x] **Prisma Schema**: Complete database schema with all core models
- [x] **Docker Compose**: PostgreSQL 16, Redis 7, Prisma Studio
- [x] **CI/CD Pipeline**: GitHub Actions workflow (lint, typecheck, test, build, deploy)

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
npm run test --workspace=web
npm run test --workspace=api

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
| **Express.js (not Next.js API routes)** | Clear separation; better for long-running processes (PDF, queues); independent scaling |
| **Prisma ORM** | Type-safe DB access; migration management; relation queries without N+1 |
| **BetterAuth (not NextAuth)** | Framework-agnostic; HttpOnly cookies; extensible plugin system |
| **Zod (shared package)** | Single source of truth for API contracts; inferred TS types; runtime validation both sides |
| **TanStack Query + React Hook Form** | Server state caching/optimistic updates; performant forms with Zod resolver |
| **Recharts** | React-native, declarative, accessible, composable dashboards |
| **Clinical Precision Design System** (`design.md`) | Clinical Cobalt/Emerald/Amber/Red semantic palette; Manrope+Inter typography; 12/8/4-col responsive grid; 4-level elevation; shadcn/ui components mapped to design tokens |

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

**Components**: Buttons (Primary/Secondary/Ghost/Destructive), Chips (Available/Pending/Cancelled/Neutral), Form Fields (40px/44px, focus/error rings), Selection Controls (18px, 1.5px border), Medical Cards (1.25rem padding, avatar + status tag), Time Slot Pickers (36px, 6px radius, selected=Primary fill)

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
2. **Backend API** — Implement REST endpoints with validation, auth middleware
3. **Frontend** — Build UI with Server Components, use Server Actions for mutations
4. **Shared types** — Keep in sync via `packages/shared`; import in both apps

---

## References

- `specs/techstack.md` — Complete stack with versions, architecture diagram, migration paths
- `specs/roadmap.md` — Phase breakdown, milestones, dependency graph, risk mitigation
- `specs/mission.md` — Vision, success metrics, guiding principles
- `design.md` — **Clinical Precision** design system (colors, typography, layout, elevation, components)
- `specs/1 - Foundation - 2026-09-17/plan.md` — Phase 1 implementation plan

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

This project uses **shadcn/ui** with Tailwind CSS, customized to the **Clinical Precision** design system (`design.md`). Use the `shadcn` skill for:
- Adding, searching, fixing, debugging, styling, composing components
- Chat interfaces, component registries, presets, `--preset` codes
- `shadcn init`, `create an app with --preset`, `switch to --preset`

**Before implementing any UI component:**
1. Check if shadcn/ui has a suitable component via the skill
2. Use the skill for installation, customization, composition guidance
3. Follow project's `components.json` configuration
4. **Map design tokens from `design.md`** — colors, typography, spacing, radius, elevation to Tailwind config

**Component Principles:**
- Accessible by default (Radix UI primitives)
- Customizable via Tailwind + CSS variables
- Copy-paste ownership (not a dependency)
- Compose complex UIs from primitives

**Design Token Mapping (from `design.md`):**
| Design Token | Tailwind Config |
|--------------|-----------------|
| Colors (primary, secondary, tertiary, error, surfaces) | `theme.extend.colors` + CSS variables |
| Typography (Manrope/Inter, scale, weights) | `theme.extend.fontFamily`, `fontSize`, `fontWeight` |
| Spacing (gutter, margin, space-*) | `theme.extend.spacing` |
| Radius (sm, DEFAULT, md, lg, xl, full) | `theme.extend.borderRadius` |
| Elevation (Level 0-3 shadows) | `theme.extend.boxShadow` |