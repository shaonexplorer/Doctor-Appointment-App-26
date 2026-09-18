# Doctor Appointment App

A full-stack TypeScript monorepo for a healthcare appointment management platform with four user roles (Admin, Staff, Doctor, Patient), built with Next.js 15 (App Router) frontend and Express.js backend.

## 🏗️ Architecture

```
monorepo/
├── apps/
│   ├── web/          # Next.js 15 + React 19 (App Router, RSC, Server Actions)
│   └── api/          # Express.js + TypeScript (REST API, Prisma, BetterAuth)
├── packages/
│   └── shared/       # Zod schemas, TypeScript types, constants, utilities
├── specs/            # Product documentation (mission, roadmap, techstack)
└── turbo.json        # Turborepo config (optional)
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x LTS
- PostgreSQL 16+
- Redis 7+
- pnpm 9+ (or npm 10+)

### Installation

```bash
# Install dependencies
npm install

# Ensure PostgreSQL and Redis are running locally
# (or update DATABASE_URL and REDIS_URL in .env files)

# Copy environment files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# Update environment variables as needed
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Start development servers
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Prisma Studio**: http://localhost:5555 (optional)

## 📦 Available Scripts

```bash
# Development
npm run dev              # Starts both web (3000) and api (4000)
npm run dev:web          # Frontend only
npm run dev:api          # Backend only

# Building
npm run build            # Build all packages
npm run build:web        # Build frontend
npm run build:api        # Build backend

# Database
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema to DB (dev)
npm run db:migrate       # Run migrations
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database

# Code Quality
npm run lint             # ESLint across monorepo
npm run typecheck        # TypeScript check across monorepo
npm run format           # Prettier format
npm run format:check     # Check formatting
npm run check            # lint + typecheck + format:check

# Testing
npm run test             # All tests
npm run test:web         # Frontend tests
npm run test:api         # Backend tests
```

## 🔧 Environment Variables

### Backend (`apps/api/.env`)

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/doctor_app
REDIS_URL=redis://localhost:6379
JWT_SECRET=<32-char-random>
BETTER_AUTH_SECRET=<32-char-random>
BETTER_AUTH_URL=http://localhost:4000
FRONTEND_URL=http://localhost:3000
PORT=4000
NODE_ENV=development
```

### Frontend (`apps/web/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, TypeScript, Prisma ORM, BetterAuth
- **Database**: PostgreSQL 16+
- **Cache**: Redis 7+
- **Validation**: Zod (shared schemas)
- **State Management**: TanStack Query
- **Forms**: React Hook Form + Zod resolver
- **Charts**: Recharts
- **Design System**: Clinical Precision (custom)

## 📚 Documentation

- [Mission & Vision](specs/mission.md)
- [Roadmap](specs/roadmap.md)
- [Tech Stack Decisions](specs/techstack.md)
- [Design System](design.md)
- [Phase 1 Plan](specs/1%20-%20Foundation%20-%202026-09-17/plan.md)

## 🔐 Security Features

- Role-based access control (RBAC)
- HttpOnly cookies with SameSite + CSRF protection
- Rate limiting on auth endpoints
- Helmet.js security headers
- CORS restricted to frontend origin
- Prisma parameterized queries (SQL injection prevention)
- Audit logging for all PHI access
- Bcrypt password hashing (cost factor 12)

## 👥 User Roles

| Role | Description |
|------|-------------|
| **Admin** | Full system access, user management, clinic setup |
| **Staff** | Front-desk operations, patient management, scheduling |
| **Doctor** | Schedule management, prescriptions, patient records |
| **Patient** | Appointment booking, history, prescriptions |

## 📝 License

MIT License - see LICENSE file for details.