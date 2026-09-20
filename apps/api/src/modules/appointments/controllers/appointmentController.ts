/**
 * Appointment Controller
 * Handles appointment HTTP requests
 */

import type { Response, NextFunction } from 'express';
import type { AppointmentService } from '../services/appointmentService';
import { buildSuccessResponse, buildPaginatedResponse } from '@doctor-appointment-app/shared';
import type { AuthenticatedRequest } from '../../../shared/middleware/auth';

export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  /**
   * Book an appointment (Patient only)
   * POST /api/appointments
   */
  bookAppointment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // Validation is handled by middleware
      const validatedData = req.validatedData;

      const appointment = await this.appointmentService.bookAppointment(
        req.user!.id,
        validatedData
      );
      res.status(201).json(buildSuccessResponse(appointment));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get appointment by ID
   * GET /api/appointments/:id
   */
  getAppointment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const appointment = await this.appointmentService.getAppointment(
        req.params.id,
        req.user!.id,
        req.user!.userType
      );
      res.json(buildSuccessResponse(appointment));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update appointment
   * PATCH /api/appointments/:id
   */
  updateAppointment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // Validation is handled by middleware
      const validatedData = req.validatedData;

      const appointment = await this.appointmentService.updateAppointment(
        req.params.id,
        req.user!.id,
        req.user!.userType,
        validatedData
      );
      res.json(buildSuccessResponse(appointment));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Cancel appointment
   * DELETE /api/appointments/:id
   */
  cancelAppointment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const appointment = await this.appointmentService.cancelAppointment(
        req.params.id,
        req.user!.id,
        req.user!.userType
      );
      res.json(buildSuccessResponse(appointment));
    } catch (error) {
      next(error);
    }
  };

  /**
   * List appointments with filters
   * GET /api/appointments
   */
  listAppointments = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // Validation is handled by middleware
      const validatedQuery = req.validatedQuery;

      const result = await this.appointmentService.listAppointments(
        validatedQuery,
        req.user!.id,
        req.user!.userType
      );
      res.json(
        buildSuccessResponse(buildPaginatedResponse(result.data, validatedQuery, result.meta.total))
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get upcoming appointments
   * GET /api/appointments/upcoming
   */
  getUpcomingAppointments = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
      const appointments = await this.appointmentService.getUpcomingAppointments(
        req.user!.id,
        req.user!.userType,
        limit
      );
      res.json(buildSuccessResponse(appointments));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get doctor appointment stats
   * GET /api/appointments/stats/doctor
   */
  getDoctorStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const stats = await this.appointmentService.getDoctorStats(req.user!.id);
      res.json(buildSuccessResponse(stats));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get patient appointment stats
   * GET /api/appointments/stats/patient
   */
  getPatientStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const stats = await this.appointmentService.getPatientStats(req.user!.id);
      res.json(buildSuccessResponse(stats));
    } catch (error) {
      next(error);
    }
  };
}

// Factory function for dependency injection
export function createAppointmentController(
  appointmentService: AppointmentService
): AppointmentController {
  return new AppointmentController(appointmentService);
}
