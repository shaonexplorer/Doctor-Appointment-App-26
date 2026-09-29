/**
 * Environment Variable Validation
 * Validates all required environment variables at startup using Zod
 */

import { z } from 'zod';

// Server-side environment schema
const serverEnvSchema = z.object({
  // Database
  DATABASE_URL: z.string().url().min(1, 'DATABASE_URL is required'),

  // Redis
  REDIS_URL: z.string().url().min(1, 'REDIS_URL is required'),

  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),

  // BetterAuth
  BETTER_AUTH_SECRET: z.string().min(32, 'BETTER_AUTH_SECRET must be at least 32 characters'),
  BETTER_AUTH_URL: z.string().url().min(1, 'BETTER_AUTH_URL is required'),

  // Frontend URL (for CORS)
  FRONTEND_URL: z.string().url().min(1, 'FRONTEND_URL is required'),

  // Server
  PORT: z.coerce.number().int().positive().default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Email (optional but recommended)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),

  // File Storage (optional)
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_S3_BUCKET: z.string().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let validatedEnv: ServerEnv | null = null;

/**
 * Validate and get server environment variables
 * Call this once at application startup
 */
export function validateServerEnv(): ServerEnv {
  if (validatedEnv) {
    return validatedEnv;
  }

  const result = serverEnvSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => {
      const path = issue.path.join('.');
      return `${path}: ${issue.message}`;
    });

    const errorMessage = [
      '❌ Invalid environment variables:',
      ...errors.map((e) => `  - ${e}`),
      '',
      'Please check your .env file and ensure all required variables are set.',
    ].join('\n');

    console.error(errorMessage);
    throw new Error('Environment validation failed');
  }

  validatedEnv = result.data;
  console.log('✅ Environment variables validated successfully');
  return validatedEnv;
}

/**
 * Get validated environment (throws if not validated yet)
 */
export function getServerEnv(): ServerEnv {
  if (!validatedEnv) {
    return validateServerEnv();
  }
  return validatedEnv;
}

// Client-side environment schema (for NEXT_PUBLIC_ variables)
const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().min(1, 'NEXT_PUBLIC_API_URL is required'),
  NEXT_PUBLIC_APP_URL: z.string().url().min(1, 'NEXT_PUBLIC_APP_URL is required'),
  NEXT_PUBLIC_BETTER_AUTH_URL: z.string().url().min(1, 'NEXT_PUBLIC_BETTER_AUTH_URL is required'),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;

let validatedClientEnv: ClientEnv | null = null;

/**
 * Validate client environment variables
 */
export function validateClientEnv(): ClientEnv {
  if (validatedClientEnv) {
    return validatedClientEnv;
  }

  // In Next.js, client env vars are available at build time
  const clientEnv = {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  };

  const result = clientEnvSchema.safeParse(clientEnv);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => {
      const path = issue.path.join('.');
      return `${path}: ${issue.message}`;
    });

    const errorMessage = [
      '❌ Invalid client environment variables:',
      ...errors.map((e) => `  - ${e}`),
      '',
      'Please check your .env.local file and ensure all required NEXT_PUBLIC_ variables are set.',
    ].join('\n');

    console.error(errorMessage);
    throw new Error('Client environment validation failed');
  }

  validatedClientEnv = result.data;
  return validatedClientEnv;
}

/**
 * Get validated client environment
 */
export function getClientEnv(): ClientEnv {
  if (!validatedClientEnv) {
    return validateClientEnv();
  }
  return validatedClientEnv;
}