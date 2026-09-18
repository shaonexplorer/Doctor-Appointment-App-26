/**
 * Doctor Appointment App - API Server
 * Express.js + TypeScript + Prisma + BetterAuth
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import { createBetterAuth } from './lib/auth';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { authMiddleware } from './middleware/auth';
import { healthRouter } from './routes/health';
import { authRouter } from './routes/auth';
import { userRouter } from './routes/users';
import { doctorRouter } from './routes/doctors';
import { appointmentRouter } from './routes/appointments';
import { prescriptionRouter } from './routes/prescriptions';
import { scheduleRouter } from './routes/schedules';
import { connectRedis, disconnectRedis } from './lib/redis';
import { authRateLimiters } from './lib/rateLimiter';

const app = express();
const prisma = new PrismaClient();

// Connect to Redis
await connectRedis();

// Global middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP for API
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
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

// Initialize BetterAuth
export const auth = createBetterAuth(prisma);

// Make prisma available globally
export { prisma };

// API Routes
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', authMiddleware, userRouter);
app.use('/api/doctors', authMiddleware, doctorRouter);
app.use('/api/appointments', authMiddleware, appointmentRouter);
app.use('/api/prescriptions', authMiddleware, prescriptionRouter);
app.use('/api/schedules', authMiddleware, scheduleRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await prisma.$disconnect();
  await disconnectRedis();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await prisma.$disconnect();
  await disconnectRedis();
  process.exit(0);
});

export default app;
