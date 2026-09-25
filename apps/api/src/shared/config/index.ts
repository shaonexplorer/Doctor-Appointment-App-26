/**
 * Shared Configuration
 * Centralized configuration for the application
 * Uses validated environment variables
 */

import { getServerEnv } from './env';

const env = getServerEnv();

export const config = {
  // Server
  port: env.PORT,
  nodeEnv: env.NODE_ENV,

  // Frontend URL for CORS
  frontendUrl: env.FRONTEND_URL,

  // Database
  databaseUrl: env.DATABASE_URL,

  // Redis
  redisUrl: env.REDIS_URL,

  // JWT
  jwtSecret: env.JWT_SECRET,

  // BetterAuth
  betterAuthSecret: env.BETTER_AUTH_SECRET,
  betterAuthUrl: env.BETTER_AUTH_URL,

  // Rate limiting
  rateLimits: {
    api: { max: 100, windowMs: 60 * 1000 }, // 100 req/min
    login: { max: 5, windowMs: 60 * 1000 }, // 5 req/min
    register: { max: 3, windowMs: 60 * 60 * 1000 }, // 3 req/hour
    passwordReset: { max: 10, windowMs: 60 * 1000 }, // 10 req/min
    emailVerification: { max: 3, windowMs: 60 * 60 * 1000 }, // 3 req/hour
  },

  // Cookie settings
  cookie: {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? ('strict' as const) : ('lax' as const),
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
};
