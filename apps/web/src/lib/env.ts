/**
 * Client-side Environment Variable Validation
 * Validates NEXT_PUBLIC_ environment variables at build time using Zod
 */

import { z } from 'zod';

const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().min(1, 'NEXT_PUBLIC_API_URL is required'),
  NEXT_PUBLIC_APP_URL: z.string().url().min(1, 'NEXT_PUBLIC_APP_URL is required'),
  NEXT_PUBLIC_BETTER_AUTH_URL: z.string().url().min(1, 'NEXT_PUBLIC_BETTER_AUTH_URL is required'),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;

let validatedClientEnv: ClientEnv | null = null;

/**
 * Validate client environment variables
 * This runs at build time in Next.js
 */
export function validateClientEnv(): ClientEnv {
  if (validatedClientEnv) {
    return validatedClientEnv;
  }

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
  console.log('✅ Client environment variables validated successfully');
  return validatedClientEnv;
}

/**
 * Get validated client environment (throws if not validated)
 */
export function getClientEnv(): ClientEnv {
  if (!validatedClientEnv) {
    return validateClientEnv();
  }
  return validatedClientEnv;
}

// Validate at module load time (build time in Next.js)
validateClientEnv();

// Export validated env for use in components
export const env = getClientEnv();