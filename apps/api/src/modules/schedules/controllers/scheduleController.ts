/**
 * Schedule Controller
 * Handles schedule/slot HTTP requests
 */

import type { Response, NextFunction } from 'express';
import type { ScheduleService } from '../services/scheduleService';
import { requireRole } from '../../../shared/middleware/auth';
import { UserType } from '@doctor-appointment-app/shared';
import { buildSuccessResponse } from '@doctor-appointment-app/shared';
import type { AuthenticatedRequest } from '../../../shared/middleware/auth';

export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  /**
   * Create a single slot (Doctor only)
   * POST /api/schedules
   */
  createSlot = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // Validation is handled by middleware
      const validatedData = req.validatedData;

      const slot = await this.scheduleService.createSlot(req.user!.id, validatedData);
      res.status(201).json(buildSuccessResponse(slot));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create bulk slots (Doctor only)
   * POST /api/schedules/bulk
   */
  createBulkSlots = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // Validation is handled by middleware
      const validatedData = req.validatedData;

      const result = await this.scheduleService.createBulkSlots(req.user!.id, validatedData);
      res.status(201).json(buildSuccessResponse(result));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get available slots for a doctor (public)
   * GET /api/schedules/doctor/:doctorId/available
   */
  getAvailableSlots = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate } = req.query;

      const slots = await this.scheduleService.getAvailableSlots(
        req.params.doctorId,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );

      res.json(buildSuccessResponse(slots));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all slots for a doctor (Doctor only)
   * GET /api/schedules/doctor/:doctorId
   */
  getDoctorSlots = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate } = req.query;

      const slots = await this.scheduleService.getDoctorSlots(
        req.params.doctorId,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );

      res.json(buildSuccessResponse(slots));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update slot (Doctor only)
   * PATCH /api/schedules/:id
   */
  updateSlot = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // Validation is handled by middleware
      const validatedData = req.validatedData;

      const slot = await this.scheduleService.updateSlot(
        req.params.id,
        req.user!.id,
        validatedData
      );
      res.json(buildSuccessResponse(slot));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete slot (Doctor only)
   * DELETE /api/schedules/:id
   */
  deleteSlot = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const result = await this.scheduleService.deleteSlot(req.params.id, req.user!.id);
      res.json(buildSuccessResponse(result));
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
export function createScheduleController(scheduleService: ScheduleService): ScheduleController {
  return new ScheduleController(scheduleService);
}
