/**
 * Schedules Module Routes
 * Defines all schedule/slot endpoints
 */

import { Router } from 'express';
import type { ScheduleController } from '../controllers/scheduleController';
import { requireAuth } from '../../../shared/middleware/auth';
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

  // Doctor only routes
  const doctorMiddleware = scheduleController.getRequireDoctorMiddleware();
  router.post(
    '/',
    doctorMiddleware,
    validateCreateSlot,
    asyncHandler(scheduleController.createSlot)
  );
  router.post(
    '/doctor/bulk',
    doctorMiddleware,
    validateCreateBulkSlots,
    asyncHandler(scheduleController.createBulkSlots)
  );
  router.get('/doctor', doctorMiddleware, asyncHandler(scheduleController.getWeeklySchedule));
  router.patch(
    '/doctor/bulk',
    doctorMiddleware,
    validateUpdateBulkSlots,
    asyncHandler(scheduleController.bulkUpdateSlots)
  );
  router.get(
    '/doctor/:doctorId',
    doctorMiddleware,
    asyncHandler(scheduleController.getDoctorSlots)
  );
  router.patch(
    '/:id',
    doctorMiddleware,
    validateUpdateSlot,
    asyncHandler(scheduleController.updateSlot)
  );
  router.delete('/:id', doctorMiddleware, asyncHandler(scheduleController.deleteSlot));

  // Generic slot by ID route - MUST be LAST to avoid catching other routes
  router.get('/:id', asyncHandler(scheduleController.getSlotById));

  return router;
}
