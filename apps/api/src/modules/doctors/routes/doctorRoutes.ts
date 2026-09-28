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
  router.get(
    '/',
    validateDoctorSearch,
    asyncHandler((req, res, next) => {
      void doctorController.searchDoctors(req, res, next);
    })
  );
  router.get(
    '/search',
    validateDoctorSearch,
    asyncHandler((req, res, next) => {
      void doctorController.searchDoctors(req, res, next);
    })
  );
  router.get(
    '/:id',
    auditDoctorProfileAccess,
    asyncHandler((req, res, next) => {
      void doctorController.getDoctorById(req, res, next);
    })
  );
  router.get(
    '/:id/schedule',
    asyncHandler((req, res, next) => {
      void doctorController.getDoctorSchedule(req, res, next);
    })
  );

  // Protected routes (auth required)
  router.use(requireAuth);

  // Doctor only routes
  const doctorMiddleware = doctorController.getRequireDoctorMiddleware();
  router.post(
    '/profile',
    doctorMiddleware,
    auditDoctorProfileUpdate,
    validateCreateProfile,
    asyncHandler((req, res, next) => {
      void doctorController.createProfile(req, res, next);
    })
  );
  router.get(
    '/profile/me',
    doctorMiddleware,
    auditDoctorProfileAccess,
    asyncHandler((req, res, next) => {
      void doctorController.getMyProfile(req, res, next);
    })
  );
  router.patch(
    '/profile/me',
    doctorMiddleware,
    auditDoctorProfileUpdate,
    validateUpdateProfile,
    asyncHandler((req, res, next) => {
      void doctorController.updateMyProfile(req, res, next);
    })
  );

  return router;
}
