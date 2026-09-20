/**
 * BetterAuth Configuration
 * Framework-agnostic authentication with HttpOnly cookies
 */

import { betterAuth } from 'better-auth';
import { multiSession } from 'better-auth/plugins';
import { dash } from '@better-auth/infra';
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
      password: {
        hash: async (password: string) => {
          const bcrypt = await import('bcryptjs');
          return bcrypt.hash(password, 12);
        },
        verify: async ({ password, hash }: { password: string; hash: string }) => {
          const bcrypt = await import('bcryptjs');
          return bcrypt.compare(password, hash);
        },
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
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        path: '/',
      },
    },
    trustedOrigins: [process.env.FRONTEND_URL || 'http://localhost:3000'],
    plugins: [
      multiSession({
        maximumSessions: 5,
      }),
      dash(),
    ],
  });
}

export type Auth = ReturnType<typeof createBetterAuth>;
