/**
 * Doctors Module Routes
 * Defines all doctor endpoints
 */

import { Router } from 'express';
import type { DoctorController } from '../controllers/doctorController';
import { requireAuth } from '../../../shared/middleware/auth';
import { asyncHandler } from '../../../shared/utils';
import { auditDoctorProfileAccess, auditDoctorProfileUpdate } from '../../../shared/middleware';
import { validateDoctorSearch, validateCreateProfile, validateUpdateProfile } from '../validators';

export function createDoctorRoutes(doctorController: DoctorController): Router {
  const router = Router();

  // Public routes (no auth required)
  router.get('/', validateDoctorSearch, asyncHandler(doctorController.searchDoctors));
  router.get('/:id', auditDoctorProfileAccess, asyncHandler(doctorController.getDoctorById));
  router.get('/:id/schedule', asyncHandler(doctorController.getDoctorSchedule));

  // Protected routes (auth required)
  router.use(requireAuth);

  // Doctor only routes
  const doctorMiddleware = doctorController.getRequireDoctorMiddleware();
  router.post(
    '/profile',
    doctorMiddleware,
    auditDoctorProfileUpdate,
    validateCreateProfile,
    asyncHandler(doctorController.createProfile)
  );
  router.get(
    '/profile/me',
    doctorMiddleware,
    auditDoctorProfileAccess,
    asyncHandler(doctorController.getMyProfile)
  );
  router.patch(
    '/profile/me',
    doctorMiddleware,
    auditDoctorProfileUpdate,
    validateUpdateProfile,
    asyncHandler(doctorController.updateMyProfile)
  );

  return router;
}
