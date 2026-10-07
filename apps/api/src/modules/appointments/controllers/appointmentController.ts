/**
 * Appointment Controller
 * Handles appointment HTTP requests
 */

import type { Response, NextFunction } from 'express';
import type { AppointmentService } from '../services/appointmentService';
import { buildSuccessResponse, buildPaginatedResponse } from '@doctor-appointment-app/shared';
import type { AuthenticatedRequest } from '../../../shared/middleware/auth';
import type {
  AppointmentFilters,
  AppointmentCreateInput,
  AppointmentUpdateInput,
  TimelineQuery,
  DoctorCancelAppointmentInput,
  DoctorRescheduleAppointmentInput,
  DoctorCheckInInput,
} from '../validators';
import type { DoctorAppointmentFilters, DoctorCompleteAppointmentInput } from '../types';

export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  /**
   * Book an appointment (Patient only)
   * POST /api/appointments
   */
  bookAppointment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // Validation is handled by middleware
      const validatedData = req.validatedData as AppointmentCreateInput;

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
      const validatedData = req.validatedData as AppointmentUpdateInput;

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
   * Cancel appointment (alternative endpoint)
   * PATCH /api/appointments/:id/cancel
   */
  cancelAppointmentAlt = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
      const validatedQuery = req.validatedQuery as AppointmentFilters;

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

  /**
   * Get dashboard statistics for patient
   * GET /api/appointments/stats/dashboard
   */
  getDashboardStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const stats = await this.appointmentService.getDashboardStats(req.user!.id);
      res.json(buildSuccessResponse(stats));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get upcoming appointments with full details
   * GET /api/appointments/timeline/upcoming
   */
  getUpcomingWithDetails = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const appointments = await this.appointmentService.getUpcomingWithDetails(
        req.user!.id,
        limit
      );
      res.json(buildSuccessResponse(appointments));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get completed appointments with prescription links
   * GET /api/appointments/timeline/completed
   */
  getCompletedWithPrescriptions = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const appointments = await this.appointmentService.getCompletedWithPrescriptions(
        req.user!.id,
        limit
      );
      res.json(buildSuccessResponse(appointments));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get medical timeline combining appointments and prescriptions
   * GET /api/appointments/timeline/medical
   */
  getMedicalTimeline = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const validatedQuery = req.validatedQuery as TimelineQuery;
      const query = {
        page: validatedQuery.page,
        limit: validatedQuery.limit,
        type: validatedQuery.type,
        dateFrom: validatedQuery.dateFrom,
        dateTo: validatedQuery.dateTo,
      };
      const timeline = await this.appointmentService.getMedicalTimeline(req.user!.id, query);
      res.json(buildSuccessResponse(timeline));
    } catch (error) {
      next(error);
    }
  };

  // ==================== DOCTOR PORTAL ENDPOINTS ====================

  /**
   * Get doctor appointments with filters (Doctor Portal)
   * GET /api/appointments/doctor
   */
  getDoctorAppointments = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const validatedQuery = req.validatedQuery as DoctorAppointmentFilters;
      const { page, limit, ...filters } = validatedQuery;

      const result = await this.appointmentService.getDoctorAppointments(req.user!.id, {
        page: page || 1,
        limit: limit || 20,
        ...filters,
      });
      res.json(
        buildSuccessResponse(buildPaginatedResponse(result.data, validatedQuery, result.meta.total))
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get single appointment detail for doctor
   * GET /api/appointments/doctor/:id
   */
  getDoctorAppointmentDetail = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const appointment = await this.appointmentService.getDoctorAppointmentDetail(
        req.params.id,
        req.user!.id
      );
      res.json(buildSuccessResponse(appointment));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get doctor dashboard statistics (Doctor Portal)
   * GET /api/appointments/stats/doctor-dashboard
   */
  getDoctorDashboardStats = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const stats = await this.appointmentService.getDoctorDashboardStats(req.user!.id);
      res.json(buildSuccessResponse(stats));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get doctor volume analytics (Doctor Portal)
   * GET /api/appointments/stats/doctor/volume
   */
  getDoctorVolumeStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const days = req.query.days ? parseInt(req.query.days as string, 10) : 7;
      const stats = await this.appointmentService.getDoctorVolumeStats(req.user!.id, days);
      res.json(buildSuccessResponse(stats));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get doctor slot utilization analytics (Doctor Portal)
   * GET /api/appointments/stats/doctor/utilization
   */
  getDoctorUtilizationStats = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const stats = await this.appointmentService.getDoctorUtilizationStats(req.user!.id);
      res.json(buildSuccessResponse(stats));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get doctor revenue analytics (Doctor Portal)
   * GET /api/appointments/stats/doctor/revenue
   */
  getDoctorRevenueStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const stats = await this.appointmentService.getDoctorRevenueStats(req.user!.id);
      res.json(buildSuccessResponse(stats));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Cancel appointment as doctor (with refund)
   * PATCH /api/appointments/doctor/:id/cancel
   */
  cancelAppointmentAsDoctor = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validatedData = req.validatedData as DoctorCancelAppointmentInput;
      const appointment = await this.appointmentService.cancelAppointmentAsDoctor(
        req.params.id,
        req.user!.id,
        validatedData
      );
      res.json(buildSuccessResponse(appointment));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Reschedule appointment as doctor
   * PATCH /api/appointments/doctor/:id/reschedule
   */
  rescheduleAppointmentAsDoctor = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validatedData = req.validatedData as DoctorRescheduleAppointmentInput;
      const appointment = await this.appointmentService.rescheduleAppointmentAsDoctor(
        req.params.id,
        req.user!.id,
        validatedData.newSlotId
      );
      res.json(buildSuccessResponse(appointment));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Check in patient (doctor/staff)
   * PATCH /api/appointments/doctor/:id/check-in
   */
  checkInPatient = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const validatedData = req.validatedData as DoctorCheckInInput;
      const appointment = await this.appointmentService.checkInPatient(
        req.params.id,
        req.user!.id,
        validatedData.notes
      );
      res.json(buildSuccessResponse(appointment));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Complete appointment as doctor
   * PATCH /api/appointments/doctor/:id/complete
   */
  completeAppointmentAsDoctor = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validatedData = req.validatedData as DoctorCompleteAppointmentInput;
      const appointment = await this.appointmentService.completeAppointmentAsDoctor(
        req.params.id,
        req.user!.id,
        validatedData
      );
      res.json(buildSuccessResponse(appointment));
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
