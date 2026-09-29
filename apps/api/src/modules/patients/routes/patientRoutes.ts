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
} from '../validators';
import { UserType } from '@prisma/client';

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
  router.get(
    '/appointments/upcoming',
    asyncHandler(patientController.getUpcomingAppointments)
  );

  // Completed appointments with prescriptions
  router.get(
    '/appointments/completed',
    asyncHandler(patientController.getCompletedAppointments)
  );

  return router;
}