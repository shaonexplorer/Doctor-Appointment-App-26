/**
 * Patients Module Routes
 * Defines all patient-specific endpoints
 */

import { Router } from 'express';
import type { PatientController } from '../controllers/patientController';
import { requireAuth, requireRole } from '../../../shared/middleware/auth';
import { asyncHandler } from '../../../shared/utils';
import { auditPatientProfileAccess } from '../../../shared/middleware/auditLogger';
import {
  validateTimelineQuery,
  validateDashboardStatsQuery,
  validateDoctorPatientListQuery,
} from '../validators';
import { UserType } from '@doctor-appointment-app/shared';

export function createPatientRoutes(patientController: PatientController): Router {
  const router = Router();

  // All patient routes require authentication
  router.use(requireAuth);

  // Patient can only access their own data
  // Admin/Staff can access any patient's data

  // Dashboard stats
  router.get(
    '/dashboard/stats',
    validateDashboardStatsQuery,
    asyncHandler(patientController.getDashboardStats)
  );

  // Medical timeline
  router.get(
    '/timeline',
    validateTimelineQuery,
    asyncHandler(patientController.getMedicalTimeline)
  );

  // Upcoming appointments
  router.get('/appointments/upcoming', asyncHandler(patientController.getUpcomingAppointments));

  // Completed appointments with prescriptions
  router.get('/appointments/completed', asyncHandler(patientController.getCompletedAppointments));

  // Doctor Portal endpoints (doctor only)
  const doctorMiddleware = requireRole(UserType.DOCTOR);
  router.get(
    '/doctor',
    doctorMiddleware,
    validateDoctorPatientListQuery,
    asyncHandler(patientController.getDoctorPatientList)
  );
  router.get(
    '/doctor/:id',
    doctorMiddleware,
    auditPatientProfileAccess,
    asyncHandler(patientController.getDoctorPatientDetail)
  );

  return router;
}
