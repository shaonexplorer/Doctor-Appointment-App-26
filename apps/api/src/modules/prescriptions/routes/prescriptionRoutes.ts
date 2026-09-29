/**
 * Prescriptions Module Routes
 * Defines all prescription endpoints
 */

import { Router } from 'express';
import type { PrescriptionController } from '../controllers/prescriptionController';
import { requireAuth } from '../../../shared/middleware/auth';
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

  // List prescriptions
  router.get('/', validatePagination, asyncHandler(prescriptionController.listPrescriptions));

  // Recent prescriptions
  router.get('/recent/doctor', asyncHandler(prescriptionController.getRecentByDoctor));
  router.get('/recent/patient', asyncHandler(prescriptionController.getRecentByPatient));

  // Prescriptions by appointment
  router.get(
    '/appointment/:appointmentId',
    asyncHandler(prescriptionController.getPrescriptionsByAppointment)
  );

  // Doctor only - create prescription
  const doctorMiddleware = prescriptionController.getRequireDoctorMiddleware();
  router.post(
    '/',
    doctorMiddleware,
    auditPrescriptionCreate,
    validateCreatePrescription,
    asyncHandler(prescriptionController.createPrescription)
  );

  // Single prescription operations
  router.get('/:id', auditPrescriptionAccess, asyncHandler(prescriptionController.getPrescription));
  router.patch(
    '/:id',
    doctorMiddleware,
    auditPrescriptionUpdate,
    validateUpdatePrescription,
    asyncHandler(prescriptionController.updatePrescription)
  );
  router.delete(
    '/:id',
    doctorMiddleware,
    auditPrescriptionDelete,
    asyncHandler(prescriptionController.deletePrescription)
  );

  return router;
}
