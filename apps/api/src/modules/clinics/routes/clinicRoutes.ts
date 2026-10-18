/**
 * Clinics Module Routes
 * Defines all clinic endpoints
 */

import { Router } from 'express';
import type { ClinicController } from '../controllers/clinicController';
import { requireAuth } from '../../../shared/middleware/auth';
import { asyncHandler } from '../../../shared/utils';
import {
  validateClinicCreate,
  validateClinicUpdate,
  validateClinicFilters,
} from '../validators';

export function createClinicRoutes(clinicController: ClinicController): Router {
  const router = Router();

  // All clinic routes require authentication
  router.use(requireAuth);

  // Clinic stats (Admin/Staff only)
  const adminStaffMiddleware = clinicController.getRequireRoleMiddleware();
  router.get('/stats', adminStaffMiddleware, asyncHandler(clinicController.getClinicStats));

  // List clinics (Admin/Staff only)
  router.get('/', adminStaffMiddleware, validateClinicFilters, asyncHandler(clinicController.listClinics));

  // Get clinic by ID (Admin/Staff only)
  router.get(
    '/:id',
    adminStaffMiddleware,
    asyncHandler(clinicController.getClinic)
  );

  // Admin only routes
  const adminMiddleware = clinicController.getRequireAdminMiddleware();
  router.post(
    '/',
    adminMiddleware,
    validateClinicCreate,
    asyncHandler(clinicController.createClinic)
  );
  router.patch(
    '/:id',
    adminMiddleware,
    validateClinicUpdate,
    asyncHandler(clinicController.updateClinic)
  );
  router.delete(
    '/:id',
    adminMiddleware,
    asyncHandler(clinicController.deleteClinic)
  );

  return router;
}
