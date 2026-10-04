/**
 * Appointments Module Routes
 * Defines all appointment endpoints
 */

import { Router } from 'express';
import type { AppointmentController } from '../controllers/appointmentController';
import { requireAuth, requireRole } from '../../../shared/middleware/auth';
import { UserType } from '@doctor-appointment-app/shared';
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
  validateDoctorAppointmentFilters,
  validateTimelineQuery,
  validateDashboardStatsQuery,
  validateDoctorCancelAppointment,
  validateDoctorRescheduleAppointment,
  validateDoctorCheckIn,
  validateDoctorCompleteAppointment,
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
  router.get(
    '/stats/dashboard',
    validateDashboardStatsQuery,
    asyncHandler(appointmentController.getDashboardStats)
  );
  router.get(
    '/stats/doctor-dashboard',
    asyncHandler(appointmentController.getDoctorDashboardStats)
  );

  // Timeline endpoints
  router.get('/timeline/upcoming', asyncHandler(appointmentController.getUpcomingWithDetails));
  router.get(
    '/timeline/completed',
    asyncHandler(appointmentController.getCompletedWithPrescriptions)
  );
  router.get(
    '/timeline/medical',
    validateTimelineQuery,
    asyncHandler(appointmentController.getMedicalTimeline)
  );

  // List appointments with filters (patient/admin view)
  router.get('/', validateAppointmentFilters, asyncHandler(appointmentController.listAppointments));

  // Doctor Portal endpoints (doctor only)
  const doctorMiddleware = requireRole(UserType.DOCTOR);
  router.get(
    '/doctor',
    doctorMiddleware,
    validateDoctorAppointmentFilters,
    asyncHandler(appointmentController.getDoctorAppointments)
  );
  router.get(
    '/doctor/:id',
    doctorMiddleware,
    auditAppointmentAccess,
    asyncHandler(appointmentController.getDoctorAppointmentDetail)
  );

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
  // Alternative cancel endpoint
  router.patch(
    '/:id/cancel',
    auditAppointmentDelete,
    asyncHandler(appointmentController.cancelAppointmentAlt)
  );

  // Doctor-specific appointment actions
  router.patch(
    '/doctor/:id/cancel',
    doctorMiddleware,
    auditAppointmentDelete,
    validateDoctorCancelAppointment,
    asyncHandler(appointmentController.cancelAppointmentAsDoctor)
  );
  router.patch(
    '/doctor/:id/reschedule',
    doctorMiddleware,
    auditAppointmentUpdate,
    validateDoctorRescheduleAppointment,
    asyncHandler(appointmentController.rescheduleAppointmentAsDoctor)
  );
  router.patch(
    '/doctor/:id/check-in',
    doctorMiddleware,
    auditAppointmentUpdate,
    validateDoctorCheckIn,
    asyncHandler(appointmentController.checkInPatient)
  );
  router.patch(
    '/doctor/:id/complete',
    doctorMiddleware,
    auditAppointmentUpdate,
    validateDoctorCompleteAppointment,
    asyncHandler(appointmentController.completeAppointmentAsDoctor)
  );

  return router;
}
