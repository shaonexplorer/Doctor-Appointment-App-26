# Phase 1: Foundation — Requirements Specification

**Version:** 1.0  
**Date:** 2026-09-17  
**Status:** Draft

---

## 1. Functional Requirements

### 1.1 Monorepo Infrastructure

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-1.1.1 | Monorepo uses npm workspaces with three packages: `apps/web`, `apps/api`, `packages/shared` | P0 | Native npm workspaces; no Turborepo initially |
| FR-1.1.2 | `apps/web` runs on Next.js 15 with App Router, React 19, TypeScript | P0 | Server Components by default |
| FR-1.1.3 | `apps/api` runs on Express.js with TypeScript, Prisma ORM | P0 | REST API only; no GraphQL |
| FR-1.1.4 | `packages/shared` exports Zod schemas, inferred TS types, constants, utilities | P0 | Single source of truth for API contracts |
| FR-1.1.5 | TypeScript project references configured for cross-package type checking | P0 | `tsc --noEmit` passes in all workspaces |
| FR-1.1.6 | ESLint, Prettier, Husky pre-commit hooks configured at root | P0 | Shared configs in root |

### 1.2 Database & Prisma

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-1.2.1 | PostgreSQL 16+ database with Prisma ORM | P0 | Primary data store |
| FR-1.2.2 | Core models: User, DoctorProfile, PatientProfile, Schedule, Appointment, Prescription | P0 | Per `specs/techstack.md` data models |
| FR-1.2.3 | Enums: UserType (ADMIN/STAFF/DOCTOR/PATIENT), SlotStatus, AppointmentStatus, PaymentStatus, Gender | P0 | Critical for RBAC and workflow |
| FR-1.2.4 | Proper indexes on foreign keys and query fields (email, userType, slotId, status) | P0 | Performance |
| FR-1.2.5 | Cascade deletes: User → Profiles, Schedule → Appointment, Appointment → Prescription | P0 | Data integrity |
| FR-1.2.6 | Prisma migration history tracked in version control | P0 | `prisma migrate dev` workflow |

### 1.3 Authentication System

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-1.3.1 | BetterAuth integration with Express.js | P0 | Framework-agnostic auth |
| FR-1.3.2 | JWT tokens stored in HttpOnly, Secure, SameSite=Strict cookies | P0 | No localStorage tokens |
| FR-1.3.3 | Password hashing with bcrypt (cost factor 12) | P0 | Industry standard |
| FR-1.3.4 | User registration endpoint with role selection (PATIENT default, DOCTOR requires verification) | P0 | Role determines profile creation |
| FR-1.3.5 | Email/password login endpoint | P0 | Rate limited |
| FR-1.3.6 | Logout endpoint invalidates session cookie | P0 | Server-side session revocation |
| FR-1.3.7 | Forgot password → reset password flow with time-limited tokens (1 hour) | P0 | Secure token generation |
| FR-1.3.8 | Email verification on registration with time-limited token (24 hours) | P0 | Required for DOCTOR role |
| FR-1.3.9 | `/auth/me` endpoint returns current user with role and profile data | P0 | Used for session hydration |
| FR-1.3.10 | Rate limiting: 5 req/min login, 3 req/hour register, 10 req/min password reset | P0 | Redis-backed |
| FR-1.3.11 | Helmet.js security headers (CSP, HSTS, X-Frame-Options, etc.) | P0 | Production hardening |
| FR-1.3.12 | CORS restricted to `FRONTEND_URL` only | P0 | No wildcard origins |

### 1.4 Role-Based Access Control (RBAC)

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-1.4.1 | Four roles: ADMIN, STAFF, DOCTOR, PATIENT | P0 | Enum in shared package |
| FR-1.4.2 | Role assigned at registration (PATIENT default), DOCTOR requires admin approval | P0 | Admin can promote users |
| FR-1.4.3 | Express middleware: `requireAuth`, `requireRole(...roles)`, `requireAnyRole(...roles)` | P0 | Reusable across routes |
| FR-1.4.4 | Role context attached to `req.user` after authentication | P0 | Includes profile relations |
| FR-1.4.5 | API route protection matrix enforced (see Section 3) | P0 | Critical for security |

### 1.5 Frontend Foundation

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-1.5.1 | Next.js 15 App Router with Server Components by default | P0 | Reduced client bundle |
| FR-1.5.2 | shadcn/ui + Tailwind CSS for component library | P0 | Accessible, customizable |
| FR-1.5.3 | Base layout: RootLayout, AuthLayout, DashboardLayout (role-aware) | P0 | Consistent structure |
| FR-1.5.4 | Navigation header with role-appropriate links | P0 | Conditional rendering |
| FR-1.5.5 | TanStack Query v5 for server state management | P0 | Caching, optimistic updates |
| FR-1.5.6 | React Hook Form + Zod resolver for form validation | P0 | Shared schemas from `packages/shared` |

### 1.6 Authentication UI Pages

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-1.6.1 | `/login` — Email/password form, validation, error handling, "Remember me" | P0 | Server Action for submission |
| FR-1.6.2 | `/register` — Multi-step: role selection → personal details → (doctor: license/specialty) | P0 | Conditional fields by role |
| FR-1.6.3 | `/forgot-password` — Email input, sends reset link | P0 | Rate limited |
| FR-1.6.4 | `/reset-password` — Token validation, new password confirmation | P0 | Token from URL param |
| FR-1.6.5 | `/verify-email` — Token validation, success/error states | P0 | Token from URL param |
| FR-1.6.6 | Protected route wrapper redirects unauthenticated users to `/login` | P0 | Client-side guard |
| FR-1.6.7 | Role-based redirect after login: PATIENT→/dashboard, DOCTOR→/doctor, STAFF→/staff, ADMIN→/admin | P0 | Server-side preferred |

### 1.7 CI/CD Pipeline

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-1.7.1 | GitHub Actions workflow on PR: lint, typecheck, unit tests, build | P0 | Blocks merge on failure |
| FR-1.7.2 | GitHub Actions workflow on merge to main: build, deploy to staging | P1 | Staging environment |
| FR-1.7.3 | Environment variable validation at build time (Zod schema) | P0 | Fail fast on missing vars |
| FR-1.7.4 | Dependency audit (npm audit) in CI | P1 | Security |

---

## 2. Non-Functional Requirements

### 2.1 Performance

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-1.1 | API response time (p95) for auth endpoints | < 200ms |
| NFR-1.2 | Frontend First Contentful Paint (FCP) | < 1.5s |
| NFR-1.3 | Database query time (p95) for user lookup | < 50ms |
| NFR-1.4 | Monorepo install time (clean) | < 60s |

### 2.2 Security

| ID | Requirement | Standard |
|----|-------------|----------|
| NFR-2.1 | Password storage | bcrypt cost 12 |
| NFR-2.2 | Session cookies | HttpOnly, Secure, SameSite=Strict |
| NFR-2.3 | Transport security | TLS 1.2+ in production |
| NFR-2.4 | Rate limiting | Redis-backed, sliding window |
| NFR-2.5 | SQL injection prevention | Prisma parameterized queries only |
| NFR-2.6 | XSS prevention | CSP headers, React auto-escaping |
| NFR-2.7 | CSRF protection | SameSite cookies + double-submit for mutations |
| NFR-2.8 | Audit logging | All PHI access, auth events, role changes |

### 2.3 Reliability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-3.1 | API uptime (dev) | 99% |
| NFR-3.2 | Database migration rollback capability | All migrations reversible |
| NFR-3.3 | Health check endpoints | `/health` on API, `/api/health` on web |

### 2.4 Maintainability

| ID | Requirement | Standard |
|----|-------------|----------|
| NFR-4.1 | TypeScript strict mode enabled | Zero `any` in production code |
| NFR-4.2 | Test coverage (unit) | >80% for auth, RBAC modules |
| NFR-4.3 | Documentation | OpenAPI spec for API, README per package |
| NFR-4.4 | Code review | Required for all PRs (2 approvals) |

---

## 3. API Route Protection Matrix

| Route Pattern | ADMIN | STAFF | DOCTOR | PATIENT | Public |
|---------------|-------|-------|--------|---------|--------|
| `POST /auth/register` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `POST /auth/login` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `POST /auth/logout` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `POST /auth/forgot-password` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `POST /auth/reset-password` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `GET /auth/me` | ✓ | ✓ | ✓ | ✓ | ✗ |
| `GET /auth/verify-email` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `GET /users/me` | ✓ | ✓ | ✓ | ✓ | ✗ |
| `PATCH /users/me` | ✓ | ✓ | ✓ | ✓ | ✗ |
| `GET /users/:id` | ✓ | ✓ | ✗ | ✗ | ✗ |
| `PATCH /users/:id` | ✓ | ✓ | ✗ | ✗ | ✗ |
| `GET /doctors` | ✓ | ✓ | ✓ | ✓ | ✗ |
| `POST /doctors` | ✓ | ✓ | ✗ | ✗ | ✗ |
| `GET /doctors/:id` | ✓ | ✓ | ✓ | ✓ | ✗ |
| `PATCH /doctors/:id` | ✓ | ✓ | Own only | ✗ | ✗ |
| `GET /patients` | ✓ | ✓ | ✗ | ✗ | ✗ |
| `GET /patients/:id` | ✓ | ✓ | Own appointments | Own only | ✗ |
| `GET /schedules` | ✓ | ✓ | Own | ✗ | ✗ |
| `POST /schedules` | ✓ | ✓ | Own | ✗ | ✗ |
| `GET /appointments` | ✓ | ✓ | Own | Own | ✗ |
| `POST /appointments` | ✓ | ✓ | ✗ | ✓ | ✗ |
| `PATCH /appointments/:id` | ✓ | ✓ | Own | Own (cancel) | ✗ |
| `GET /prescriptions` | ✓ | ✓ | Own | Own | ✗ |
| `POST /prescriptions` | ✓ | ✓ | Own | ✗ | ✗ |

---

## 4. Data Validation Rules (Zod Schemas)

### 4.1 User Registration
```typescript
// packages/shared/src/schemas/auth.ts
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),
  confirmPassword: z.string(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
  userType: z.enum(['PATIENT', 'DOCTOR']).default('PATIENT'),
  // Doctor-only fields (required if userType === 'DOCTOR')
  licenseNo: z.string().optional(),
  specialty: z.string().optional(),
  designation: z.string().optional(),
  fee: z.number().positive().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
}).refine(data => {
  if (data.userType === 'DOCTOR') {
    return data.licenseNo && data.specialty && data.designation && data.fee;
  }
  return true;
}, {
  message: 'Doctor registration requires license, specialty, designation, and fee',
  path: ['userType']
});
```

### 4.2 Login
```typescript
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean().default(false),
});
```

### 4.3 Password Reset
```typescript
export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(128).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});
```

### 4.4 Profile Update
```typescript
export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
  // Role-specific fields handled separately
});
```

---

## 5. Environment Configuration

### 5.1 Required Variables (Validated at Startup)

**Backend (`apps/api/.env`)**
| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | `postgresql://user:pass@localhost:5432/doctor_app` |
| `REDIS_URL` | Redis connection string | Yes | `redis://localhost:6379` |
| `JWT_SECRET` | 32+ char random string for JWT signing | Yes | `openssl rand -base64 32` |
| `BETTER_AUTH_SECRET` | 32+ char random for BetterAuth | Yes | `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | Backend auth callback URL | Yes | `http://localhost:4000` |
| `FRONTEND_URL` | Frontend origin for CORS | Yes | `http://localhost:3000` |
| `PORT` | API server port | Yes | `4000` |
| `NODE_ENV` | Environment mode | Yes | `development` |

**Frontend (`apps/web/.env.local`)**
| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | Yes | `http://localhost:4000` |
| `NEXT_PUBLIC_APP_URL` | Frontend app URL | Yes | `http://localhost:3000` |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | BetterAuth client URL | Yes | `http://localhost:3000` |

### 5.2 Validation Schema
```typescript
// packages/shared/src/schemas/env.ts
export const backendEnvSchema = z.object({
  DATABASE_URL: z.string().url().startsWith('postgresql://'),
  REDIS_URL: z.string().url().startsWith('redis://'),
  JWT_SECRET: z.string().min(32),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
  FRONTEND_URL: z.string().url(),
  PORT: z.coerce.number().int().positive(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

export const frontendEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_BETTER_AUTH_URL: z.string().url(),
});
```

---

## 6. Error Handling Standards

### 6.1 API Error Response Format
```typescript
// All error responses follow this structure
interface ApiError {
  success: false;
  error: {
    code: string;           // Machine-readable code (e.g., 'AUTH_INVALID_CREDENTIALS')
    message: string;        // Human-readable message
    details?: Record<string, unknown>; // Optional field-specific errors
    requestId: string;      // Correlation ID for tracing
  };
}
```

### 6.2 Standard Error Codes
| Code | HTTP Status | Description |
|------|-------------|-------------|
| `AUTH_INVALID_CREDENTIALS` | 401 | Invalid email/password |
| `AUTH_TOKEN_EXPIRED` | 401 | JWT expired |
| `AUTH_TOKEN_INVALID` | 401 | JWT malformed/tampered |
| `AUTH_INSUFFICIENT_ROLE` | 403 | Role not authorized for endpoint |
| `AUTH_EMAIL_UNVERIFIED` | 403 | Email not verified |
| `AUTH_RATE_LIMITED` | 429 | Too many requests |
| `VALIDATION_ERROR` | 400 | Zod schema validation failed |
| `RESOURCE_NOT_FOUND` | 404 | Entity not found |
| `RESOURCE_CONFLICT` | 409 | Duplicate key, double-booking |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## 7. Acceptance Criteria

### 7.1 Monorepo Setup
- [ ] `npm install` completes without errors in root and all workspaces
- [ ] `npm run dev` starts both applications concurrently
- [ ] `npm run build` produces production builds for both apps
- [ ] `npm run typecheck` passes with zero errors
- [ ] `npm run lint` passes with zero warnings
- [ ] `npm run format:check` passes

### 7.2 Database
- [ ] `npx prisma migrate dev` creates all tables successfully
- [ ] `npx prisma db seed` (if implemented) runs without errors
- [ ] `npx prisma studio` opens and shows all models
- [ ] Foreign key constraints enforced
- [ ] Indexes created on query fields

### 7.3 Authentication
- [ ] Register → email verification → login → `/auth/me` works end-to-end
- [ ] Password reset flow works (request → email → reset → login)
- [ ] HttpOnly cookie set on login, cleared on logout
- [ ] Rate limiting blocks excess requests (tested)
- [ ] CORS blocks requests from non-whitelisted origins
- [ ] Helmet headers present in responses

### 7.4 RBAC
- [ ] `requireRole('ADMIN')` blocks non-admin users (403)
- [ ] `requireAnyRole('DOCTOR', 'STAFF')` allows both, blocks others
- [ ] Role context available in route handlers
- [ ] Doctor registration requires admin approval (or email verification + license)

### 7.5 Frontend
- [ ] All auth pages render without console errors
- [ ] Form validation shows inline errors
- [ ] Successful login redirects to role-appropriate dashboard
- [ ] Protected routes redirect unauthenticated users to `/login`
- [ ] Navigation shows role-appropriate links
- [ ] TanStack Query devtools show cached data

### 7.6 CI/CD
- [ ] PR workflow runs on every push
- [ ] Workflow fails on lint/typecheck/test failures
- [ ] Main branch merge triggers staging deploy
- [ ] Environment validation fails build on missing vars

---

## 8. Out of Scope (Phase 1)

The following are explicitly **not** part of Phase 1:
- Doctor search and discovery (Phase 2)
- Appointment booking flow (Phase 2)
- Schedule management UI (Phase 3)
- Prescription builder (Phase 3)
- Patient history timeline (Phase 4)
- Admin dashboard metrics (Phase 5)
- Payment integration (Phase 7)
- Notification services (Phase 7)
- Telemedicine (Phase 7)
- AI features (Phase 8)

---

## 9. Traceability Matrix

| Requirement ID | Plan Task | Validation Test |
|----------------|-----------|-----------------|
| FR-1.1.1–1.1.6 | Week 1 Tasks 1–6 | 7.1 Monorepo Setup |
| FR-1.2.1–1.2.6 | Week 1 Tasks 7–9 | 7.2 Database |
| FR-1.3.1–1.3.12 | Week 2 Tasks 1–9 | 7.3 Authentication |
| FR-1.4.1–1.4.5 | Week 3 Tasks 1–5 | 7.4 RBAC |
| FR-1.5.1–1.5.6 | Week 4 Tasks 1–4 | 7.5 Frontend |
| FR-1.6.1–1.6.7 | Week 4 Tasks 5–7 | 7.5 Frontend |
| FR-1.7.1–1.7.4 | Week 4 Tasks 8–9 | 7.6 CI/CD |

---

## 10. Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | | | |
| Tech Lead | | | |
| Security Review | | | |