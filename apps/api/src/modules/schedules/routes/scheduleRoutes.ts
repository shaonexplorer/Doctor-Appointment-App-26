/**
 * Schedules Module Routes
 * Defines all schedule/slot endpoints
 */

import { Router } from 'express';
import type { ScheduleController } from '../controllers/scheduleController';
import { requireAuth, requireRole } from '../../../shared/middleware/auth';
import { UserType } from '@doctor-appointment-app/shared';
import { asyncHandler } from '../../../shared/utils';
import {
  validateCreateSlot,
  validateCreateBulkSlots,
  validateUpdateSlot,
  validateUpdateBulkSlots,
} from '../validators';

export function createScheduleRoutes(scheduleController: ScheduleController): Router {
  const router = Router();

  // Public routes (no auth required)
  // IMPORTANT: Specific routes MUST come before generic /:id route
  router.get('/doctor/:doctorId/available', asyncHandler(scheduleController.getAvailableSlots));
  router.get('/availability', asyncHandler(scheduleController.getAvailability));

  // Protected routes (auth required)
  router.use(requireAuth);

  // Doctor/Staff/Admin middleware for read operations
  const doctorStaffAdminMiddleware = requireRole(UserType.DOCTOR, UserType.ADMIN, UserType.STAFF);
  // Doctor-only middleware for write operations
  const doctorOnlyMiddleware = requireRole(UserType.DOCTOR);

  router.post(
    '/',
    doctorOnlyMiddleware,
    validateCreateSlot,
    asyncHandler(scheduleController.createSlot)
  );
  router.post(
    '/doctor/bulk',
    doctorOnlyMiddleware,
    validateCreateBulkSlots,
    asyncHandler(scheduleController.createBulkSlots)
  );
  router.get('/doctor', doctorStaffAdminMiddleware, asyncHandler(scheduleController.getWeeklySchedule));
  router.patch(
    '/doctor/bulk',
    doctorOnlyMiddleware,
    validateUpdateBulkSlots,
    asyncHandler(scheduleController.bulkUpdateSlots)
  );
  router.get(
    '/doctor/:doctorId',
    doctorStaffAdminMiddleware,
    asyncHandler(scheduleController.getDoctorSlots)
  );
  router.patch(
    '/:id',
    doctorOnlyMiddleware,
    validateUpdateSlot,
    asyncHandler(scheduleController.updateSlot)
  );
  router.delete('/:id', doctorOnlyMiddleware, asyncHandler(scheduleController.deleteSlot));

  // Generic slot by ID route - MUST be LAST to avoid catching other routes
  router.get('/:id', asyncHandler(scheduleController.getSlotById));

  return router;
}
