/**
 * Users Module Routes
 * Defines all user endpoints
 */

import { Router } from 'express';
import type { UserController } from '../controllers/userController';
import { requireAuth } from '../../../shared/middleware/auth';
import { asyncHandler } from '../../../shared/utils';
import {
  auditUserProfileAccess,
  auditUserProfileUpdate,
  auditUserProfileDelete,
} from '../../../shared/middleware';
import { validateUpdateProfile, validatePagination } from '../validators';

export function createUserRoutes(userController: UserController): Router {
  const router = Router();

  // All user routes require authentication
  router.use(requireAuth);

  // Current user profile
  router.get('/me', auditUserProfileAccess, asyncHandler(userController.getProfile));
  router.patch(
    '/me',
    auditUserProfileUpdate,
    validateUpdateProfile,
    asyncHandler(userController.updateProfile)
  );

  // Doctor profile with stats (Doctor only)
  const doctorMiddleware = userController.getRequireDoctorMiddleware();
  router.get(
    '/me/doctor-profile',
    doctorMiddleware,
    auditUserProfileAccess,
    asyncHandler(userController.getDoctorProfile)
  );

  // Admin/Staff only routes
  const adminStaffMiddleware = userController.getRequireRoleMiddleware();
  router.get('/', adminStaffMiddleware, validatePagination, asyncHandler(userController.listUsers));
  router.get(
    '/:id',
    adminStaffMiddleware,
    auditUserProfileAccess,
    asyncHandler(userController.getUserById)
  );

  // Admin only routes
  const adminMiddleware = userController.getRequireAdminMiddleware();
  router.delete(
    '/:id',
    adminMiddleware,
    auditUserProfileDelete,
    asyncHandler(userController.deleteUser)
  );

  return router;
}
