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
   * Set auth cookies
   */
  private setAuthCookies(res: Response, token: string) {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? ('strict' as const) : ('lax' as const),
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };
    res.cookie('session_token', token, cookieOptions);
  }

  /**
   * Clear auth cookies
   */
  private clearAuthCookies(res: Response) {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? ('strict' as const) : ('lax' as const),
      path: '/',
      maxAge: 0,
    };
    res.clearCookie('session_token', cookieOptions);
  }

  /**
   * Register new user
   * POST /api/auth/register
   */
  register = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // Validation is handled by middleware
      const validatedData = req.validatedData;

      const result = await this.authService.register(validatedData);
      this.setAuthCookies(res, result.session.token);

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
      this.setAuthCookies(res, result.session.token);

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

      this.clearAuthCookies(res);

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
      const sessionToken = req.cookies?.session_token;

      if (!sessionToken) {
        return res.json(buildSuccessResponse({ user: null, session: null }));
      }

      const result = await this.authService.getSession(sessionToken);

      if (!result) {
        return res.json(buildSuccessResponse({ user: null, session: null }));
      }

      res.json(
        buildSuccessResponse({
          user: result.user,
          session: { id: result.session.id, expiresAt: result.session.expiresAt },
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
