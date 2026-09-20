/**
 * Doctor Controller
 * Handles doctor HTTP requests
 */

import type { Response, NextFunction } from 'express';
import type { DoctorService } from '../services/doctorService';
import { requireRole } from '../../../shared/middleware/auth';
import { UserType } from '@doctor-appointment-app/shared';
import { buildSuccessResponse, buildPaginatedResponse } from '@doctor-appointment-app/shared';
import type { AuthenticatedRequest } from '../../../shared/middleware/auth';

export class DoctorController {
  constructor(private doctorService: DoctorService) {}

  /**
   * Search doctors (public)
   * GET /api/doctors
   */
  searchDoctors = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // Validation is handled by middleware
      const validatedQuery = req.validatedQuery;

      const result = await this.doctorService.searchDoctors(validatedQuery);
      res.json(
        buildSuccessResponse(buildPaginatedResponse(result.data, validatedQuery, result.meta.total))
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get doctor by ID (public)
   * GET /api/doctors/:id
   */
  getDoctorById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const doctor = await this.doctorService.getDoctorById(req.params.id);
      res.json(buildSuccessResponse(doctor));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create doctor profile (Doctor only)
   * POST /api/doctors/profile
   */
  createProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // Validation is handled by middleware
      const validatedData = req.validatedData;

      const profile = await this.doctorService.createProfile(req.user!.id, validatedData);
      res.status(201).json(buildSuccessResponse(profile));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get own doctor profile (Doctor only)
   * GET /api/doctors/profile/me
   */
  getMyProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const profile = await this.doctorService.getMyProfile(req.user!.id);
      res.json(buildSuccessResponse(profile));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update own doctor profile (Doctor only)
   * PATCH /api/doctors/profile/me
   */
  updateMyProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // Validation is handled by middleware
      const validatedData = req.validatedData;

      const profile = await this.doctorService.updateProfile(req.user!.id, validatedData);
      res.json(buildSuccessResponse(profile));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get doctor schedule (for booking)
   * GET /api/doctors/:id/schedule
   */
  getDoctorSchedule = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate } = req.query;

      const schedule = await this.doctorService.getSchedule(
        req.params.id,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );

      res.json(buildSuccessResponse(schedule));
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
export function createDoctorController(doctorService: DoctorService): DoctorController {
  return new DoctorController(doctorService);
}
