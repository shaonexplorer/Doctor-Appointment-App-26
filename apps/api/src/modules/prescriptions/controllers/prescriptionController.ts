/**
 * Prescription Controller
 * Handles prescription HTTP requests
 */

import type { Response, NextFunction } from 'express';
import type { PrescriptionService } from '../services/prescriptionService';
import { requireRole } from '../../../shared/middleware/auth';
import { UserType } from '@doctor-appointment-app/shared';
import { buildSuccessResponse, buildPaginatedResponse } from '@doctor-appointment-app/shared';
import type { AuthenticatedRequest } from '../../../shared/middleware/auth';

export class PrescriptionController {
  constructor(private prescriptionService: PrescriptionService) {}

  /**
   * Create prescription (Doctor only)
   * POST /api/prescriptions
   */
  createPrescription = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // Validation is handled by middleware
      const validatedData = req.validatedData;

      const prescription = await this.prescriptionService.createPrescription(
        req.user!.id,
        validatedData
      );
      res.status(201).json(buildSuccessResponse(prescription));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get prescription by ID
   * GET /api/prescriptions/:id
   */
  getPrescription = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const prescription = await this.prescriptionService.getPrescription(
        req.params.id,
        req.user!.id,
        req.user!.userType
      );
      res.json(buildSuccessResponse(prescription));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update prescription (Doctor only)
   * PATCH /api/prescriptions/:id
   */
  updatePrescription = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // Validation is handled by middleware
      const validatedData = req.validatedData;

      const prescription = await this.prescriptionService.updatePrescription(
        req.params.id,
        req.user!.id,
        validatedData
      );
      res.json(buildSuccessResponse(prescription));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete prescription (Doctor only)
   * DELETE /api/prescriptions/:id
   */
  deletePrescription = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const result = await this.prescriptionService.deletePrescription(req.params.id, req.user!.id);
      res.json(buildSuccessResponse(result));
    } catch (error) {
      next(error);
    }
  };

  /**
   * List prescriptions with filters
   * GET /api/prescriptions
   */
  listPrescriptions = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // Validation is handled by middleware
      const validatedQuery = req.validatedQuery;

      const { doctorId, patientId, appointmentId } = req.query;
      const filters: { doctorId?: string; patientId?: string; appointmentId?: string } = {};

      if (doctorId) filters.doctorId = doctorId as string;
      if (patientId) filters.patientId = patientId as string;
      if (appointmentId) filters.appointmentId = appointmentId as string;

      const result = await this.prescriptionService.listPrescriptions(filters, validatedQuery);
      res.json(
        buildSuccessResponse(buildPaginatedResponse(result.data, validatedQuery, result.meta.total))
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get prescriptions by appointment
   * GET /api/prescriptions/appointment/:appointmentId
   */
  getPrescriptionsByAppointment = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const prescriptions = await this.prescriptionService.getPrescriptionsByAppointment(
        req.params.appointmentId,
        req.user!.id,
        req.user!.userType
      );
      res.json(buildSuccessResponse(prescriptions));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get recent prescriptions for doctor
   * GET /api/prescriptions/recent/doctor
   */
  getRecentByDoctor = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
      const prescriptions = await this.prescriptionService.getRecentByDoctor(req.user!.id, limit);
      res.json(buildSuccessResponse(prescriptions));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get recent prescriptions for patient
   * GET /api/prescriptions/recent/patient
   */
  getRecentByPatient = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
      const prescriptions = await this.prescriptionService.getRecentByPatient(req.user!.id, limit);
      res.json(buildSuccessResponse(prescriptions));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get middleware for doctor role
   */
  getRequireDoctorMiddleware = () => requireRole(UserType.DOCTOR);
}

// Factory function for dependency injection
export function createPrescriptionController(
  prescriptionService: PrescriptionService
): PrescriptionController {
  return new PrescriptionController(prescriptionService);
}
