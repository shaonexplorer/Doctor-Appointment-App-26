/**
 * Shared Configuration
 * Centralized configuration for the application
 */

export const config = {
  // Server
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // Frontend URL for CORS
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Database
  databaseUrl:
    process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/doctor_appointment',

  // Redis
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',

  // BetterAuth
  betterAuthSecret:
    process.env.BETTER_AUTH_SECRET || 'your-better-auth-secret-change-in-production',
  betterAuthUrl: process.env.BETTER_AUTH_URL || 'http://localhost:4000',

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
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? ('strict' as const) : ('lax' as const),
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
};
