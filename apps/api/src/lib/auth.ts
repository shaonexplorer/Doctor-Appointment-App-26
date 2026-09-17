/**
 * BetterAuth Configuration
 * Framework-agnostic authentication with HttpOnly cookies
 */

import { betterAuth } from 'better-auth';
import type { PrismaClient } from '@prisma/client';
import { betterAuthPrismaAdapter } from './adapters/prismaAdapter';
import { UserType } from '@doctor-appointment-app/shared';

export function createBetterAuth(prisma: PrismaClient) {
  return betterAuth({
    database: betterAuthPrismaAdapter(prisma),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      passwordHash: {
        algorithm: 'bcrypt',
        cost: 12,
      },
    },
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5, // 5 minutes
      },
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
    },
    user: {
      additionalFields: {
        userType: {
          type: 'string',
          required: true,
          defaultValue: UserType.PATIENT,
          input: true,
        },
        firstName: {
          type: 'string',
          required: true,
          input: true,
        },
        lastName: {
          type: 'string',
          required: true,
          input: true,
        },
        phone: {
          type: 'string',
          required: false,
          input: true,
        },
      },
    },
    advanced: {
      crossSubDomainCookies: {
        enabled: false,
      },
      useSecureCookies: process.env.NODE_ENV === 'production',
      defaultCookieAttributes: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      },
    },
    trustedOrigins: [process.env.FRONTEND_URL || 'http://localhost:3000'],
    plugins: [],
    hooks: {
      after: [
        {
          matcher: (context) => context.path === '/sign-up/email',
          handler: async (context) => {
            // Log user registration
            console.log(`New user registered: ${context.body.email} (${context.body.userType})`);
          },
        },
      ],
    },
  });
}

export type Auth = ReturnType<typeof createBetterAuth>;
