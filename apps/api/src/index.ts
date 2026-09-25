/**
 * Doctor Appointment App - API Server
 * Express.js + TypeScript + Prisma + BetterAuth
 * Modular MVC Architecture
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';

// Core infrastructure
import { createBetterAuth } from './lib/auth';
import { errorHandler, notFoundHandler, requestLogger } from './shared/middleware';
import { connectRedis, disconnectRedis } from './lib/redis';
import { authRateLimiters } from './lib/rateLimiter';
import { config } from './shared/config';
import { getServerEnv } from './shared/config/env';

// Repositories (data access layer)
import { createRepositories, type Repositories } from './repositories';

// Modules (feature-based MVC)
import { createAllModules, type AllModules } from './modules';

// Health check
import { router as healthRouter } from './routes/health';

// Validate environment variables at startup
getServerEnv();

const app = express();
const prisma = new PrismaClient();

// Connect to Redis
await connectRedis();

// Initialize repositories (data access layer)
const repositories: Repositories = createRepositories(prisma);

// Initialize all feature modules
const modules: AllModules = createAllModules(repositories, prisma);

// Initialize BetterAuth
export const auth = createBetterAuth(prisma);

// Make prisma available globally (for legacy code compatibility)
export { prisma };

// Global middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP for API
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);

// Rate limiting - Redis-backed
app.use('/api', authRateLimiters.api);

// Stricter rate limiting for auth endpoints
app.use('/api/auth/login', authRateLimiters.login);
app.use('/api/auth/register', authRateLimiters.register);
app.use('/api/auth/forgot-password', authRateLimiters.passwordReset);
app.use('/api/auth/reset-password', authRateLimiters.passwordReset);
app.use('/api/auth/verify-email', authRateLimiters.emailVerification);
app.use('/api/auth/resend-verification', authRateLimiters.emailVerification);

// API Routes
app.use('/api/health', healthRouter);
app.use('/api/auth', modules.auth.routes);
app.use('/api/users', modules.users.routes);
app.use('/api/doctors', modules.doctors.routes);
app.use('/api/schedules', modules.schedules.routes);
app.use('/api/appointments', modules.appointments.routes);
app.use('/api/prescriptions', modules.prescriptions.routes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${config.nodeEnv}`);
  console.log(`🏗️  Architecture: Modular MVC (modules/ + shared/)`);
  console.log(`📦 Modules loaded: auth, users, doctors, schedules, appointments, prescriptions`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  void (async () => {
    console.log('SIGTERM received, shutting down gracefully...');
    await prisma.$disconnect();
    await disconnectRedis();
    process.exit(0);
  })();
});

process.on('SIGINT', () => {
  void (async () => {
    console.log('SIGINT received, shutting down gracefully...');
    await prisma.$disconnect();
    await disconnectRedis();
    process.exit(0);
  })();
});

export default app;
