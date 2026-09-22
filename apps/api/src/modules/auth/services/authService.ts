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

    try {
      // Create user via BetterAuth
      const result = (await auth.api.signUpEmail({
        body: {
          email: userData.email,
          password: userData.password,
          name: `${userData.firstName} ${userData.lastName}`,
          userType,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
        },
      })) as { token: string; user: BetterAuthSignUpResult['user'] };

      // Create profile based on user type
      if (userType === UserType.DOCTOR) {
        await prisma.doctorProfile.create({
          data: {
            userId: result.user.id,
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
            userId: result.user.id,
            dob: dob ? new Date(dob) : null,
            gender: gender || null,
            address,
            emergencyContact,
          },
        });
      }

      // Get session details from database using the token
      const session = await prisma.session.findUnique({
        where: { token: result.token },
      });

      return {
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          userType: result.user.userType as UserType,
          emailVerified: result.user.emailVerified,
        },
        session: {
          id: session?.id || result.token,
          token: result.token,
          expiresAt: session?.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      };
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof AppError) throw error;
      throw new AppError('REGISTRATION_FAILED', 'Registration failed', 500);
    }
  }

  /**
   * Login user
   */
  async login(data: LoginInput): Promise<AuthResult> {
    try {
      const result = (await auth.api.signInEmail({
        body: { email: data.email, password: data.password },
      })) as { token: string; user: BetterAuthSignInResult['user'] };

      // Get session details from database using the token
      const session = await prisma.session.findUnique({
        where: { token: result.token },
      });

      return {
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          userType: result.user.userType as UserType,
          emailVerified: result.user.emailVerified,
        },
        session: {
          id: session?.id || result.token,
          token: result.token,
          expiresAt: session?.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new AppError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
    }
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
      })) as BetterAuthSessionResult | null;

      if (!result) return null;

      return {
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          userType: result.user.userType as UserType,
          emailVerified: result.user.emailVerified,
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
   * Verify email
   */
  async verifyEmail(data: VerifyEmailInput): Promise<void> {
    try {
      await (auth.api as any).verifyEmail({
        body: { token: data.token },
      });
    } catch (error) {
      console.error('Verify email error:', error);
      throw new AppError('INVALID_TOKEN', 'Invalid or expired verification token', 400);
    }
  }

  /**
   * Resend verification email
   */
  async resendVerification(email: string): Promise<void> {
    try {
      await (auth.api as any).sendVerificationEmail({
        body: { email, callbackURL: `${process.env.FRONTEND_URL}/verify-email` },
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
