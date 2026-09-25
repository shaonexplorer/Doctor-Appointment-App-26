/**
 * Auth Controller
 * Handles authentication HTTP requests
 */

import type { Response, NextFunction } from 'express';
import type { AuthService } from '../services/authService';
import { buildSuccessResponse, buildErrorResponse } from '@doctor-appointment-app/shared';
import type { AuthenticatedRequest } from '../../../shared/middleware/auth';

export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Register new user
   * POST /api/auth/register
   */
  register = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // Validation is handled by middleware
      const validatedData = req.validatedData;

      const result = await this.authService.register(validatedData);

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
      const validatedData = req.validatedData;

      const result = await this.authService.login(validatedData);

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
      const validatedData = req.validatedData;

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
      const validatedData = req.validatedData;

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
      const validatedData = req.validatedData;

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
      const validatedData = req.validatedData;

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
      const validatedData = req.validatedData;
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
