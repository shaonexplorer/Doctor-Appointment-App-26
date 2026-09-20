/**
 * Appointments Module Routes
 * Defines all appointment endpoints
 */

import { Router } from 'express';
import type { AppointmentController } from '../controllers/appointmentController';
import { requireAuth } from '../../../shared/middleware/auth';
import { asyncHandler } from '../../../shared/utils';
import {
  auditAppointmentAccess,
  auditAppointmentCreate,
  auditAppointmentUpdate,
  auditAppointmentDelete,
} from '../../../shared/middleware';
import {
  validateCreateAppointment,
  validateUpdateAppointment,
  validateAppointmentFilters,
} from '../validators';

export function createAppointmentRoutes(appointmentController: AppointmentController): Router {
  const router = Router();

  // All appointment routes require authentication
  router.use(requireAuth);

  // Patient only - book appointment
  router.post(
    '/',
    auditAppointmentCreate,
    validateCreateAppointment,
    asyncHandler(appointmentController.bookAppointment)
  );

  // Get upcoming appointments (both patient and doctor)
  router.get('/upcoming', asyncHandler(appointmentController.getUpcomingAppointments));

  // Stats
  router.get('/stats/doctor', asyncHandler(appointmentController.getDoctorStats));
  router.get('/stats/patient', asyncHandler(appointmentController.getPatientStats));

  // List appointments with filters
  router.get('/', validateAppointmentFilters, asyncHandler(appointmentController.listAppointments));

  // Single appointment operations
  router.get('/:id', auditAppointmentAccess, asyncHandler(appointmentController.getAppointment));
  router.patch(
    '/:id',
    auditAppointmentUpdate,
    validateUpdateAppointment,
    asyncHandler(appointmentController.updateAppointment)
  );
  router.delete(
    '/:id',
    auditAppointmentDelete,
    asyncHandler(appointmentController.cancelAppointment)
  );

  return router;
}
