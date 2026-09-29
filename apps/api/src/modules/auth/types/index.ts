/**
 * Auth Module Types
 * Type definitions for authentication module
 */

import type { UserType } from '@doctor-appointment-app/shared';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: UserType;
  emailVerified: boolean;
}

export interface AuthResult {
  user: SessionUser;
  session: {
    id: string;
    token: string;
    expiresAt: Date;
  };
}

// BetterAuth response types
export interface BetterAuthSignUpResult {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    userType: string;
    emailVerified: boolean;
  };
  session: {
    id: string;
    expiresAt: Date;
  };
  token: string;
}

export interface BetterAuthSignInResult {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    userType: string;
    emailVerified: boolean;
  };
  session: {
    id: string;
    expiresAt: Date;
  };
  token: string;
}

export interface BetterAuthSessionResult {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    userType: string;
    emailVerified: boolean;
  };
  session: {
    id: string;
    expiresAt: Date;
  };
}

// Input types (re-exported from shared for convenience)
export type RegisterInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  userType: UserType;
  specialty?: string;
  designation?: string;
  licenseNo?: string;
  bio?: string | null;
  fee?: number;
  dob?: string | null;
  gender?: string | null;
  address?: string | null;
  emergencyContact?: string | null;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type ForgotPasswordInput = {
  email: string;
};

export type ResetPasswordInput = {
  token: string;
  password: string;
  confirmPassword: string;
};

export type VerifyEmailInput = {
  token: string;
};

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};
