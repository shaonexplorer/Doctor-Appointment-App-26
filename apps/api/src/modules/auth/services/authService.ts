/**
 * Auth Service
 * Business logic for authentication operations
 */

import { auth, prisma } from '../../../index';
import type { UserRepository } from '../../../repositories';
import { UserType } from '@doctor-appointment-app/shared';
import { AppError } from '../../../shared/middleware/errorHandler';
import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyEmailInput,
  AuthResult,
  BetterAuthSignUpResult,
  BetterAuthSignInResult,
  BetterAuthSessionResult,
} from '../types';

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  /**
   * Register a new user
   */
  async register(data: RegisterInput): Promise<AuthResult> {
    const {
      userType,
      specialty,
      designation,
      licenseNo,
      bio,
      fee,
      dob,
      gender,
      address,
      emergencyContact,
      ...userData
    } = data;

    // Check if email already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new AppError('EMAIL_EXISTS', 'Email already registered', 409);
    }

    // Create user via BetterAuth
    const result = await auth.api.signUpEmail({
      body: {
        email: userData.email,
        password: userData.password,
        name: `${userData.firstName} ${userData.lastName}`,
        userType,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
      },
    });

    // BetterAuth signUpEmail returns { user, session: null, token: null } initially
    // The session is created separately, we need to fetch it from DB by userId
    const signUpResult = result as {
      user: { id: string; email: string; emailVerified: boolean; firstName: string; lastName: string; userType: string };
      token: string | null;
    };

    // Create profile based on user type
    if (userType === UserType.DOCTOR) {
      await prisma.doctorProfile.create({
        data: {
          userId: signUpResult.user.id,
          specialty: specialty!,
          designation: designation!,
          licenseNo: licenseNo!,
          bio,
          fee: fee!,
        },
      });
    } else if (userType === UserType.PATIENT) {
      await prisma.patientProfile.create({
        data: {
          userId: signUpResult.user.id,
          dob: dob ? new Date(dob) : null,
          gender: (gender as import('@doctor-appointment-app/shared').Gender) || null,
          address,
          emergencyContact,
        },
      });
    }

    // Get session details from database by userId (since token is null in signUpEmail response)
    // The session was just created, so get the most recent one for this user
    const session = await prisma.session.findFirst({
      where: { userId: signUpResult.user.id },
      orderBy: { createdAt: 'desc' },
    });

    // Use input data for response (more reliable than BetterAuth response for additional fields)
    return {
      user: {
        id: signUpResult.user.id,
        email: signUpResult.user.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        userType,
        emailVerified: signUpResult.user.emailVerified,
      },
      session: {
        id: session?.id || '',
        token: session?.token || '',
        expiresAt: session?.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    };
  }

  /**
   * Login user
   */
  async login(data: LoginInput): Promise<AuthResult> {
    const result = await auth.api.signInEmail({
      body: { email: data.email, password: data.password },
    });

    // BetterAuth signInEmail returns { user, token, redirect, url }
    // Token is at the top level, not in session
    const signInResult = result as {
      user: { id: string; email: string; emailVerified: boolean };
      token: string;
      redirect: boolean;
      url?: string;
    };

    // Get session details from database using the token
    const session = await prisma.session.findUnique({
      where: { token: signInResult.token },
    });

    // Fetch full user data from database to get additional fields
    const user = await prisma.user.findUnique({
      where: { id: signInResult.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        userType: true,
        emailVerified: true,
      },
    });

    if (!user) {
      throw new AppError('NOT_FOUND', 'User not found', 404);
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType as UserType,
        emailVerified: user.emailVerified,
      },
      session: {
        id: session?.id || '',
        token: signInResult.token,
        expiresAt: session?.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    };
  }

  /**
   * Logout user
   */
  async logout(sessionToken: string): Promise<void> {
    try {
      await auth.api.signOut({
        headers: new Headers({
          cookie: `session_token=${sessionToken}`,
        }),
      });
    } catch {
      // Ignore errors
    }
  }

  /**
   * Get current session
   */
  async getSession(sessionToken: string): Promise<AuthResult | null> {
    try {
      const result = (await auth.api.getSession({
        headers: new Headers({
          cookie: `session_token=${sessionToken}`,
        }),
      })) as { user: { id: string }; session: { id: string; expiresAt: Date } } | null;

      if (!result) return null;

      // Fetch full user data from database
      const user = await prisma.user.findUnique({
        where: { id: result.user.id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          userType: true,
          emailVerified: true,
        },
      });

      if (!user) return null;

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType as UserType,
          emailVerified: user.emailVerified,
        },
        session: {
          id: result.session.id,
          token: sessionToken,
          expiresAt: result.session.expiresAt,
        },
      };
    } catch {
      return null;
    }
  }

  /**
   * Request password reset
   */
  async forgotPassword(data: ForgotPasswordInput): Promise<void> {
    try {
      await (auth.api as any).forgetPassword({
        body: { email: data.email, redirectTo: `${process.env.FRONTEND_URL}/reset-password` },
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      // Always succeed to prevent email enumeration
    }
  }

  /**
   * Reset password
   */
  async resetPassword(data: ResetPasswordInput): Promise<void> {
    try {
      await auth.api.resetPassword({
        body: { token: data.token, newPassword: data.password },
      });
    } catch (error) {
      console.error('Reset password error:', error);
      throw new AppError('INVALID_TOKEN', 'Invalid or expired reset token', 400);
    }
  }

  /**
   * Verify email with OTP (6-digit code) or legacy token
   * POST /api/auth/verify-email
   * Body: { method: 'token', token: string } | { method: 'otp', email: string, otp: string }
   */
  async verifyEmail(data: VerifyEmailInput): Promise<void> {
    try {
      const rawData = data as Record<string, unknown>;

      // Check for discriminated union format with 'method' field
      if ('method' in rawData) {
        const method = rawData.method;
        if (method === 'token' && 'token' in rawData && typeof rawData.token === 'string') {
          // Legacy token-based verification
          console.log('Using legacy token verification');
          await (auth.api as any).verifyEmail({
            body: { token: rawData.token },
          });
          return;
        }
        if (method === 'otp' && 'email' in rawData && 'otp' in rawData) {
          // New OTP-based verification - use email-otp plugin endpoint
          console.log('Using OTP verification for email:', rawData.email);
          try {
            // Try email-otp plugin method first
            console.log('Trying auth.api.emailOtp.verifyEmail...');
            await (auth.api as any).emailOtp?.verifyEmail?.({
              body: { email: rawData.email, otp: rawData.otp },
            });
            console.log('emailOtp.verifyEmail succeeded');
          } catch (emailOtpError) {
            console.log('emailOtp.verifyEmail failed, trying auth.api.verifyEmail with OTP...', emailOtpError);
            // Fallback: try the standard verifyEmail with OTP (when overrideDefaultEmailVerification=true)
            await (auth.api as any).verifyEmail({
              body: { email: rawData.email, otp: rawData.otp },
            });
          }
          return;
        }
      }

      // Backward compatibility: handle legacy format without 'method' field
      if ('token' in rawData && typeof rawData.token === 'string') {
        await (auth.api as any).verifyEmail({
          body: { token: rawData.token },
        });
        return;
      }
      if ('email' in rawData && 'otp' in rawData && typeof rawData.email === 'string' && typeof rawData.otp === 'string') {
        // New OTP-based verification
        console.log('Using OTP verification (no method field) for email:', rawData.email);
        try {
          await (auth.api as any).emailOtp?.verifyEmail?.({
            body: { email: rawData.email, otp: rawData.otp },
          });
        } catch {
          await (auth.api as any).verifyEmail({
            body: { email: rawData.email, otp: rawData.otp },
          });
        }
        return;
      }

      throw new AppError('INVALID_INPUT', 'Invalid verification data', 400);
    } catch (error) {
      console.error('Verify email error:', error);
      // Log the actual error for debugging
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
      }
      // Check if it's a BetterAuth API error
      if (error && typeof error === 'object' && 'body' in error) {
        console.error('BetterAuth error body:', (error as any).body);
      }
      throw new AppError('INVALID_TOKEN', 'Invalid or expired verification code', 400);
    }
  }

  /**
   * Call the email-otp plugin's verify-email endpoint directly
   */
  private async callEmailOtpVerifyEndpoint(email: string, otp: string): Promise<void> {
    const baseUrl = process.env.BETTER_AUTH_URL || 'http://localhost:4000';
    const response = await fetch(`${baseUrl}/api/auth/email-otp/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Email-otp verify endpoint error:', errorData);
      throw new AppError('INVALID_TOKEN', 'Invalid or expired verification code', 400);
    }
  }

  /**
   * Resend verification OTP
   * POST /api/auth/resend-verification
   * Body: { email: string }
   */
  async resendVerification(email: string): Promise<void> {
    try {
      await (auth.api as any).sendVerificationOTP({
        body: { email, type: 'email-verification' },
      });
    } catch (error) {
      console.error('Resend verification error:', error);
      // Always succeed to prevent email enumeration
    }
  }

  /**
   * Change password (for authenticated user)
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    // Get user with password hash
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true },
    });

    if (!user) {
      throw new AppError('NOT_FOUND', 'User not found', 404);
    }

    // Verify current password using BetterAuth
    try {
      await auth.api.changePassword({
        body: { currentPassword, newPassword },
        headers: new Headers({
          cookie: `session_token=${userId}`, // This would need actual session
        }),
      });
    } catch {
      throw new AppError('INVALID_PASSWORD', 'Current password is incorrect', 400);
    }
  }
}

// Factory function for dependency injection
export function createAuthService(userRepository: UserRepository): AuthService {
  return new AuthService(userRepository);
}
