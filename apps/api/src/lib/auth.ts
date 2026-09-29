/**
 * BetterAuth Configuration
 * Framework-agnostic authentication with HttpOnly cookies
 */

import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { multiSession, emailOTP } from 'better-auth/plugins';
import { dash } from '@better-auth/infra';
import type { PrismaClient } from '@prisma/client';
import { UserType } from '@doctor-appointment-app/shared';
import bcrypt from 'bcryptjs';
import { sendVerificationOTP, sendPasswordResetEmail } from './email';

export function createBetterAuth(prisma: PrismaClient) {
  return betterAuth({
    database: prismaAdapter(prisma, {
      provider: 'postgresql',
    }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      password: {
        hash: async (password: string) => {
          return bcrypt.hash(password, 12);
        },
        verify: async ({ password, hash }: { password: string; hash: string }) => {
          return bcrypt.compare(password, hash);
        },
      },
      // Password reset email configuration (link-based)
      sendResetPassword: async ({ user, url, token }) => {
        await sendPasswordResetEmail({ user, url, token });
      },
    },
    // Use email-otp plugin for 6-digit code verification
    // This overrides the default link-based email verification
    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      expiresIn: 3600, // 1 hour
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
      cookiePrefix: '', // Use empty prefix so cookie name is 'session_token' instead of 'better-auth.session_token'
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
      // Email OTP plugin for 6-digit code verification
      emailOTP({
        overrideDefaultEmailVerification: true,
        async sendVerificationOTP({ email, otp, type }) {
          await sendVerificationOTP({ email, otp, type });
        },
        expiresIn: 300, // 5 minutes
        allowedAttempts: 3,
      }),
      dash(),
    ],
  });
}

export type Auth = ReturnType<typeof createBetterAuth>;
