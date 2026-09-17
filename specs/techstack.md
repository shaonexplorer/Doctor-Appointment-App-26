# Technology Stack

## Overview
Full-stack TypeScript monorepo with Next.js (App Router) frontend and Express.js backend, sharing types and validation schemas via a common package.

---

## Frontend

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Framework** | Next.js | 15.x (App Router) | React framework with SSR, RSC, Server Actions |
| **Language** | TypeScript | 5.x | Type-safe development |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS framework |
| **UI Components** | shadcn/ui | Latest | Accessible, customizable component library |
| **Animations** | GSAP (zsap) | 3.x | High-performance animations & transitions |
| **Forms** | React Hook Form | 7.x | Performant form state management |
| **Validation** | Zod | 3.x | Schema validation (shared with backend) |
| **Tables** | TanStack Table | 8.x | Headless table with sorting, filtering, pagination |
| **Charts** | Recharts | 2.x | React charting library for dashboards |
| **State** | React Context + Server State | — | Minimal client state; TanStack Query for server state |
| **Auth Client** | BetterAuth | Latest | Authentication client with React hooks |

---

## Backend

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Runtime** | Node.js | 20.x LTS | JavaScript runtime |
| **Framework** | Express.js | 4.x / 5.x | REST API server |
| **Language** | TypeScript | 5.x | Type-safe backend development |
| **Database** | PostgreSQL | 16.x | Primary relational database |
| **ORM** | Prisma | 5.x | Type-safe database access & migrations |
| **Auth** | BetterAuth | Latest | Authentication core (JWT, sessions, cookies) |
| **Tokens** | JWT (jsonwebtoken) | 9.x | Access/refresh token management |
| **Cookies** | cookie / iron-session | — | Secure HttpOnly cookie handling |
| **Validation** | Zod | 3.x | Request body/query validation (shared schemas) |
| **Logging** | Pino | 9.x | Structured JSON logging |
| **Queue** | BullMQ | 5.x | Background jobs (PDF generation, notifications) |
| **PDF** | PDFKit / Puppeteer | — | Prescription PDF generation |

---

## Shared Package (`@doctor-appointment/shared`)

| Content | Purpose |
|---------|---------|
| Zod schemas | Single source of truth for request/response validation |
| TypeScript types | Shared DTOs, enums, and domain models |
| Constants | Error codes, status enums, configuration defaults |
| Utilities | Date helpers, formatting, validation helpers |

---

## Infrastructure & DevOps

| Category | Technology | Purpose |
|----------|------------|---------|
| **Containerization** | Docker + Docker Compose | Local dev & production containers |
| **Database Hosting** | PostgreSQL (managed: Neon/Supabase/RDS) | Production database |
| **Deployment** | Vercel (Frontend) + Railway/Render/Fly.io (Backend) | Serverless + container hosting |
| **CI/CD** | GitHub Actions | Automated testing, linting, deployment |
| **Monitoring** | Sentry (errors) + Pino (logs) | Observability |
| **Secrets** | 1Password / GitHub Secrets / Vercel Env | Secret management |
| **Email** | Resend / SendGrid | Transactional emails |
| **SMS/WhatsApp** | Twilio / Gupshup | Notifications |
| **File Storage** | S3-compatible (R2/Tigris/AWS S3) | Report/prescription uploads |

---

## Development Tooling

| Tool | Purpose |
|------|---------|
| **Package Manager** | pnpm (workspaces) |
| **Linting** | ESLint (Airbnb/Next.js config) + Prettier |
| **Type Checking** | TypeScript strict mode + tsc --noEmit |
| **Testing** | Vitest (unit) + Playwright (E2E) |
| **Git Hooks** | Husky + lint-staged |
| **API Docs** | OpenAPI/Swagger (auto-generated from Zod) |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
                        MONOREPO                                 │
├─────────────────────┬─────────────────────┬──────────────────┤
│    apps/web         │   apps/api          │ packages/shared  │
│  (Next.js 15)       │  (Express + TS)     │  (Zod, Types)    │
│                     │                     │                  │
│  - App Router       │  - REST Routes      │  - Schemas       │
│  - RSC + Actions    │  - Middleware       │  - Types         │
│  - Shadcn/UI        │  - Prisma Client    │  - Constants     │
│  - TanStack Query   │  - BetterAuth       │  - Utilities     │
│  - Recharts         │  - BullMQ Workers   │                  │
└──────────┬──────────┴──────────┬───────────┴────────┬─────────┘
           │                      │                   │
           ▼                      ▼                   ▼
    ┌─────────────┐        ┌─────────────┐    ┌─────────────┐
    │   Vercel    │        │  Railway/   │    │   npm/      │
    │  (Edge SSR) │        │  Fly.io     │    │  GitHub     │
    └─────────────┘        │  (Container)│    │  Packages   │
                           └──────┬──────┘    └─────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
             ┌─────────────┐             ┌─────────────┐
             │ PostgreSQL  │             │   Redis     │
             │  (Prisma)   │             │  (BullMQ)   │
             └─────────────┘             └─────────────┘
```

---

## Key Architectural Decisions

### 1. Monorepo with pnpm Workspaces
- Shared types/schemas eliminate drift between frontend/backend
- Atomic commits across FE/BE for schema changes
- Independent deployment pipelines per app

### 2. Next.js App Router + Server Components
- Reduced client bundle size
- Server-side data fetching for SEO and performance
- Server Actions for mutations (progressive enhancement)

### 3. Express.js Backend (Not Next.js API Routes)
- Clear separation of concerns
- Better suited for long-running processes (PDF, queues)
- Familiar middleware ecosystem
- Independent scaling of API workers

### 4. Prisma ORM
- Type-safe database access with auto-generated types
- Migration management with rollback support
- Relation queries without N+1 via `include`/`select`

### 5. BetterAuth over NextAuth
- Framework-agnostic (works with Express + Next.js)
- Built-in session management with HttpOnly cookies
- Extensible plugin system (2FA, passkeys, organizations)

### 6. Zod for Validation (Shared)
- Single source of truth for API contracts
- Inferred TypeScript types from schemas
- Runtime validation on both client and server

### 7. TanStack Query + React Hook Form
- Server state caching, deduplication, optimistic updates
- Performant form handling with minimal re-renders
- Zod resolver integration for seamless validation

### 8. Recharts for Dashboards
- React-native, declarative API
- Responsive, accessible charts
- Composable chart components matching design system

---

## Version Constraints & Compatibility

```json
{
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=9.0.0"
  },
  "peerDependencies": {
    "react": "^18.3.0 || ^19.0.0",
    "next": "^15.0.0",
    "express": "^4.19.0 || ^5.0.0",
    "prisma": "^5.15.0",
    "zod": "^3.23.0"
  }
}
```

---

## Environment Variables

### Frontend (`apps/web/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

### Backend (`apps/api/.env`)
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/doctor_app
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-key-min-32-chars
BETTER_AUTH_SECRET=your-better-auth-secret
BETTER_AUTH_URL=http://localhost:4000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
PORT=4000

# Optional: External services
SENDGRID_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
S3_ENDPOINT=
S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_BUCKET=
```

---

## Migration Path (Future Considerations)

| Current | Potential Future | Trigger |
|---------|------------------|---------|
| Express REST | tRPC / GraphQL | Complex nested queries, real-time needs |
| BullMQ | Temporal / Inngest | Long-running workflows, durability requirements |
| PostgreSQL | PostgreSQL + TimescaleDB | Time-series analytics at scale |
| Vercel | Kubernetes (EKS/GKE) | Multi-region, compliance requirements |
| BetterAuth | Auth.js v5 / Clerk | Enterprise SSO, SCIM provisioning |

---

## Security Checklist

- [ ] All API routes protected with authentication middleware
- [ ] Role-based authorization on every mutation
- [ ] Rate limiting on auth endpoints (login, register, reset)
- [ ] Helmet.js for security headers
- [ ] CORS configured for frontend origin only
- [ ] SQL injection prevention via Prisma parameterized queries
- [ ] XSS prevention via React auto-escaping + CSP
- [ ] CSRF protection via SameSite cookies + double-submit pattern
- [ ] Secrets never committed (verified by git-secrets/truffleHog)
- [ ] Dependency scanning in CI (npm audit, Snyk)
- [ ] Audit logging for all PHI access