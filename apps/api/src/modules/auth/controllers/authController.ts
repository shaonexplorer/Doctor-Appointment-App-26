/**
 * Auth Controller
 * Handles authentication HTTP requests
 */

import type { Response, NextFunction } from 'express';
import type { AuthService } from '../services/authService';
import { buildSuccessResponse, buildErrorResponse } from '@doctor-appointment-app/shared';
import type { AuthenticatedRequest } from '../../../shared/middleware/auth';
import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyEmailInput,
  ChangePasswordInput,
} from '../types';
import { config } from '../../../shared/config';

/**
 * Set session cookie on response
 */
function setSessionCookie(res: Response, token: string) {
  const cookieOptions = {
    httpOnly: config.cookie.httpOnly,
    secure: config.cookie.secure,
    sameSite: config.cookie.sameSite,
    path: config.cookie.path,
    maxAge: config.cookie.maxAge,
  };
  res.cookie('session_token', token, cookieOptions);
}

/**
 * Clear session cookie on response
 */
function clearSessionCookie(res: Response) {
  const cookieOptions = {
    httpOnly: config.cookie.httpOnly,
    secure: config.cookie.secure,
    sameSite: config.cookie.sameSite,
    path: config.cookie.path,
  };
  res.clearCookie('session_token', cookieOptions);
}

export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Register new user
   * POST /api/auth/register
   */
  register = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // Validation is handled by middleware
      const validatedData = req.validatedData as RegisterInput;

      const result = await this.authService.register(validatedData);

      // Set session cookie
      setSessionCookie(res, result.session.token);

      res.status(201).json(
        buildSuccessResponse({
          user: result.user,
          session: { token: result.session.token },
        })
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Login user
   * POST /api/auth/login
   */
  login = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const validatedData = req.validatedData as LoginInput;

      const result = await this.authService.login(validatedData);

      // Set session cookie
      setSessionCookie(res, result.session.token);

      res.json(
        buildSuccessResponse({
          user: result.user,
          session: { token: result.session.token },
        })
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Logout user
   * POST /api/auth/logout
   */
  logout = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const sessionToken = req.cookies?.session_token;

      if (sessionToken) {
        await this.authService.logout(sessionToken);
      }

      // Clear session cookie
      clearSessionCookie(res);

      res.json(buildSuccessResponse({ message: 'Logged out successfully' }));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get current session
   * GET /api/auth/me
   */
  me = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // User and session are already attached by requireAuth middleware
      if (!req.user || !req.session) {
        return res.json(buildSuccessResponse({ user: null, session: null }));
      }

      res.json(
        buildSuccessResponse({
          user: req.user,
          session: { id: req.session.id, expiresAt: req.session.expiresAt },
        })
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Forgot password
   * POST /api/auth/forgot-password
   */
  forgotPassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const validatedData = req.validatedData as ForgotPasswordInput;

      await this.authService.forgotPassword(validatedData);

      // Always return success to prevent email enumeration
      res.json(
        buildSuccessResponse({ message: 'If the email exists, a reset link has been sent' })
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Reset password
   * POST /api/auth/reset-password
   */
  resetPassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const validatedData = req.validatedData as ResetPasswordInput;

      await this.authService.resetPassword(validatedData);

      res.json(buildSuccessResponse({ message: 'Password reset successfully' }));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Verify email
   * POST /api/auth/verify-email
   */
  verifyEmail = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const validatedData = req.validatedData as VerifyEmailInput;

      await this.authService.verifyEmail(validatedData);

      res.json(buildSuccessResponse({ message: 'Email verified successfully' }));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Resend verification email
   * POST /api/auth/resend-verification
   */
  resendVerification = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const validatedData = req.validatedData as ForgotPasswordInput; // Uses same schema as forgot password

      await this.authService.resendVerification(validatedData.email);

      res.json(
        buildSuccessResponse({ message: 'If the email exists, a verification link has been sent' })
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Change password (authenticated user)
   * POST /api/auth/change-password
   */
  changePassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const validatedData = req.validatedData as ChangePasswordInput;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json(buildErrorResponse('UNAUTHORIZED', 'Authentication required'));
      }

      await this.authService.changePassword(
        userId,
        validatedData.currentPassword,
        validatedData.newPassword
      );

      res.json(buildSuccessResponse({ message: 'Password changed successfully' }));
    } catch (error) {
      next(error);
    }
  };
}

// Factory function for dependency injection
export function createAuthController(authService: AuthService): AuthController {
  return new AuthController(authService);
}
