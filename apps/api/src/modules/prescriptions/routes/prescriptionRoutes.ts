/**
 * Prescriptions Module Routes
 * Defines all prescription endpoints
 */

import { Router } from 'express';
import type { PrescriptionController } from '../controllers/prescriptionController';
import { requireAuth, requireRole } from '../../../shared/middleware/auth';
import { UserType } from '@doctor-appointment-app/shared';
import { asyncHandler } from '../../../shared/utils';
import {
  auditPrescriptionAccess,
  auditPrescriptionCreate,
  auditPrescriptionUpdate,
  auditPrescriptionDelete,
} from '../../../shared/middleware';
import {
  validateCreatePrescription,
  validateUpdatePrescription,
  validatePagination,
} from '../validators';

export function createPrescriptionRoutes(prescriptionController: PrescriptionController): Router {
  const router = Router();

  // All prescription routes require authentication
  router.use(requireAuth);

  // Doctor/Staff/Admin middleware for read operations
  const doctorStaffAdminMiddleware = requireRole(UserType.DOCTOR, UserType.ADMIN, UserType.STAFF);
  // Doctor-only middleware for write operations
  const doctorOnlyMiddleware = requireRole(UserType.DOCTOR);

  // List prescriptions (DOCTOR, ADMIN, STAFF)
  router.get('/', validatePagination, doctorStaffAdminMiddleware, asyncHandler(prescriptionController.listPrescriptions));

  // Recent prescriptions (DOCTOR, ADMIN, STAFF)
  router.get('/recent/doctor', doctorStaffAdminMiddleware, asyncHandler(prescriptionController.getRecentByDoctor));
  router.get('/recent/patient', asyncHandler(prescriptionController.getRecentByPatient));

  // Prescriptions by appointment (accessible via audit middleware)
  router.get(
    '/appointment/:appointmentId',
    asyncHandler(prescriptionController.getPrescriptionsByAppointment)
  );

  // Doctor only - create prescription (write operation)
  router.post(
    '/',
    doctorOnlyMiddleware,
    auditPrescriptionCreate,
    validateCreatePrescription,
    asyncHandler(prescriptionController.createPrescription)
  );

  // Single prescription operations
  router.get('/:id', auditPrescriptionAccess, asyncHandler(prescriptionController.getPrescription));
  router.patch(
    '/:id',
    doctorOnlyMiddleware,
    auditPrescriptionUpdate,
    validateUpdatePrescription,
    asyncHandler(prescriptionController.updatePrescription)
  );
  router.delete(
    '/:id',
    doctorOnlyMiddleware,
    auditPrescriptionDelete,
    asyncHandler(prescriptionController.deletePrescription)
  );

  // PDF generation (accessible to doctor, patient, admin, staff)
  router.get(
    '/:id/pdf',
    auditPrescriptionAccess,
    asyncHandler(prescriptionController.generatePrescriptionPDF)
  );

  return router;
}
