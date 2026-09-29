/**
 * Auth Module Routes
 * Defines all authentication endpoints
 */

import { Router } from 'express';
import type { AuthController } from '../controllers/authController';
import { asyncHandler } from '../../../shared/utils';
import {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateVerifyEmail,
  validateChangePassword,
} from '../validators';
import { requireAuth } from '../../../shared/middleware/auth';

export function createAuthRoutes(authController: AuthController): Router {
  const router = Router();

  // Public routes (no auth required)
  router.post('/register', validateRegister, asyncHandler(authController.register));
  router.post('/login', validateLogin, asyncHandler(authController.login));
  router.post(
    '/forgot-password',
    validateForgotPassword,
    asyncHandler(authController.forgotPassword)
  );
  router.post('/reset-password', validateResetPassword, asyncHandler(authController.resetPassword));
  router.post('/verify-email', validateVerifyEmail, asyncHandler(authController.verifyEmail));
  router.post(
    '/resend-verification',
    validateForgotPassword,
    asyncHandler(authController.resendVerification)
  );

  // Protected routes (auth required)
  router.post('/logout', requireAuth, asyncHandler(authController.logout));
  router.get('/me', requireAuth, asyncHandler(authController.me));
  router.post(
    '/change-password',
    requireAuth,
    validateChangePassword,
    asyncHandler(authController.changePassword)
  );

  return router;
}
