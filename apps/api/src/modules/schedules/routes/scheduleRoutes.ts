/**
 * Schedules Module Routes
 * Defines all schedule/slot endpoints
 */

import { Router } from 'express';
import type { ScheduleController } from '../controllers/scheduleController';
import { requireAuth } from '../../../shared/middleware/auth';
import { asyncHandler } from '../../../shared/utils';
import { validateCreateSlot, validateCreateBulkSlots, validateUpdateSlot } from '../validators';

export function createScheduleRoutes(scheduleController: ScheduleController): Router {
  const router = Router();

  // Public routes (no auth required)
  router.get('/doctor/:doctorId/available', asyncHandler(scheduleController.getAvailableSlots));

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
    '/bulk',
    doctorMiddleware,
    validateCreateBulkSlots,
    asyncHandler(scheduleController.createBulkSlots)
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

  return router;
}
