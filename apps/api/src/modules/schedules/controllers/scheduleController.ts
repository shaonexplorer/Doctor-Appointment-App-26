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
import type {
  SlotCreateInput,
  BulkSlotCreateInput,
  SlotUpdateInput,
  BulkSlotUpdateInput,
} from '../validators';

export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  /**
   * Create a single slot (Doctor only)
   * POST /api/schedules
   */
  createSlot = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // Validation is handled by middleware
      const validatedData = req.validatedData as SlotCreateInput;

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
      const validatedData = req.validatedData as BulkSlotCreateInput;

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
   * Get available slots for a doctor with date range query params (public)
   * GET /api/schedules/availability?doctorId=&from=&to=
   */
  getAvailability = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { doctorId, from, to } = req.query;

      if (!doctorId) {
        return res.status(400).json({
          success: false,
          data: null,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'doctorId query parameter is required',
            details: null,
          },
          meta: null,
        });
      }

      const slots = await this.scheduleService.getAvailableSlots(
        doctorId as string,
        from ? new Date(from as string) : undefined,
        to ? new Date(to as string) : undefined
      );

      res.json(buildSuccessResponse(slots));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get slot by ID (public)
   * GET /api/schedules/:id
   */
  getSlotById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const slot = await this.scheduleService.getSlotById(req.params.id);
      if (!slot) {
        return res.status(404).json({
          success: false,
          data: null,
          error: {
            code: 'NOT_FOUND',
            message: 'Slot not found',
            details: null,
          },
          meta: null,
        });
      }
      res.json(buildSuccessResponse(slot));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all slots for a doctor (Doctor only)
   * GET /api/schedules/doctor/:doctorId
   * Note: doctorId is expected to be a User ID (from appointment response)
   */
  getDoctorSlots = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate } = req.query;
      const userId = req.params.doctorId;

      // Use service method that looks up DoctorProfile ID from User ID
      const slots = await this.scheduleService.getDoctorSlotsByUserId(
        userId,
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
      const validatedData = req.validatedData as SlotUpdateInput;

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
   * Bulk update slots (Doctor only)
   * PATCH /api/schedules/doctor/bulk
   */
  bulkUpdateSlots = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // Validation is handled by middleware
      const validatedData = req.validatedData as BulkSlotUpdateInput;

      const result = await this.scheduleService.bulkUpdateSlots(req.user!.id, validatedData);
      res.json(buildSuccessResponse(result));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get weekly schedule for authenticated doctor (Doctor only)
   * GET /api/schedules/doctor
   */
  getWeeklySchedule = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { weekStart } = req.query;

      if (!weekStart) {
        return res.status(400).json({
          success: false,
          data: null,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'weekStart query parameter is required',
            details: null,
          },
          meta: null,
        });
      }

      const slots = await this.scheduleService.getWeeklySchedule(
        req.user!.id,
        new Date(weekStart as string)
      );
      res.json(buildSuccessResponse(slots));
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
