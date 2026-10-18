/**
 * Clinic Controller
 * Handles clinic HTTP requests
 */

import type { Response, NextFunction } from 'express';
import type { ClinicService } from '../services/clinicService';
import { requireRole } from '../../../shared/middleware/auth';
import { UserType } from '@doctor-appointment-app/shared';
import { buildSuccessResponse, buildPaginatedResponse } from '@doctor-appointment-app/shared';
import type { AuthenticatedRequest } from '../../../shared/middleware/auth';
import type { ClinicCreateInput, ClinicUpdateInput, ClinicFilters } from '../validators';

export class ClinicController {
  constructor(private clinicService: ClinicService) {}

  /**
   * Get clinic by ID (Admin/Staff only)
   * GET /api/clinics/:id
   */
  getClinic = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const clinic = await this.clinicService.getClinic(req.params.id);
      res.json(buildSuccessResponse(clinic));
    } catch (error) {
      next(error);
    }
  };

  /**
   * List clinics with pagination (Admin/Staff only)
   * GET /api/clinics
   */
  listClinics = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const validatedQuery = req.validatedQuery as ClinicFilters;

      const result = await this.clinicService.listClinics(validatedQuery);
      res.json(
        buildSuccessResponse(
          buildPaginatedResponse(result.data, validatedQuery, result.meta.total)
        )
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create clinic (Admin only)
   * POST /api/clinics
   */
  createClinic = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const validatedData = req.validatedData as ClinicCreateInput;

      const clinic = await this.clinicService.createClinic(validatedData);
      res.status(201).json(buildSuccessResponse(clinic));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update clinic (Admin only)
   * PATCH /api/clinics/:id
   */
  updateClinic = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const validatedData = req.validatedData as ClinicUpdateInput;

      const clinic = await this.clinicService.updateClinic(req.params.id, validatedData);
      res.json(buildSuccessResponse(clinic));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete clinic (Admin only)
   * DELETE /api/clinics/:id
   */
  deleteClinic = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const result = await this.clinicService.deleteClinic(req.params.id);
      res.json(buildSuccessResponse(result));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get clinic stats (Admin/Staff only)
   * GET /api/clinics/stats
   */
  getClinicStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const stats = await this.clinicService.getClinicStats();
      res.json(buildSuccessResponse(stats));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get middleware for role-based access (Admin/Staff)
   */
  getRequireRoleMiddleware = () => requireRole(UserType.ADMIN, UserType.STAFF);

  /**
   * Get middleware for admin-only access
   */
  getRequireAdminMiddleware = () => requireRole(UserType.ADMIN);
}

// Factory function for dependency injection
export function createClinicController(clinicService: ClinicService): ClinicController {
  return new ClinicController(clinicService);
}
