/**
 * Patient Controller
 * Handles patient-specific HTTP requests
 */

import type { Response, NextFunction } from 'express';
import type { PatientService } from '../services/patientService';
import { buildSuccessResponse } from '@doctor-appointment-app/shared';
import type { AuthenticatedRequest } from '../../../shared/middleware/auth';
import type { TimelineQuery, DoctorPatientListQuery } from '../validators';

export class PatientController {
  constructor(private patientService: PatientService) {}

  /**
   * Get patient dashboard statistics
   * GET /api/patients/dashboard/stats
   */
  getDashboardStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const stats = await this.patientService.getDashboardStats(req.user!.id);
      res.json(buildSuccessResponse(stats));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get patient medical timeline
   * GET /api/patients/timeline
   */
  getMedicalTimeline = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const validatedQuery = req.validatedQuery as TimelineQuery;
      const timeline = await this.patientService.getMedicalTimeline(req.user!.id, validatedQuery);
      res.json(buildSuccessResponse(timeline));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get upcoming appointments with details
   * GET /api/patients/appointments/upcoming
   */
  getUpcomingAppointments = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const appointments = await this.patientService.getUpcomingWithDetails(req.user!.id, limit);
      res.json(buildSuccessResponse(appointments));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get completed appointments with prescriptions
   * GET /api/patients/appointments/completed
   */
  getCompletedAppointments = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const appointments = await this.patientService.getCompletedWithPrescriptions(
        req.user!.id,
        limit
      );
      res.json(buildSuccessResponse(appointments));
    } catch (error) {
      next(error);
    }
  };

  // ==================== DOCTOR PORTAL ENDPOINTS ====================

  /**
   * Get doctor's patient list (Doctor Portal)
   * GET /api/patients/doctor
   */
  getDoctorPatientList = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const validatedQuery = req.validatedQuery as DoctorPatientListQuery;
      const { page, limit, ...filters } = validatedQuery;

      const result = await this.patientService.getDoctorPatientList(req.user!.id, {
        page: page || 1,
        limit: limit || 20,
        ...filters,
      });
      res.json(buildSuccessResponse(result));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get doctor's patient detail (for Patient Drawer)
   * GET /api/patients/doctor/:id
   */
  getDoctorPatientDetail = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const detail = await this.patientService.getDoctorPatientDetail(req.user!.id, req.params.id);
      res.json(buildSuccessResponse(detail));
    } catch (error) {
      next(error);
    }
  };
}

// Factory function for dependency injection
export function createPatientController(patientService: PatientService): PatientController {
  return new PatientController(patientService);
}
