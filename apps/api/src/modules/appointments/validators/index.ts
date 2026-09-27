/**
 * Appointments Module Validators
 * Validation schemas for appointments module
 */

import { z } from 'zod';
import type { ZodTypeAny } from 'zod';
import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../../../shared/middleware/auth';
import {
  AppointmentCreateSchema,
  AppointmentUpdateSchema,
  AppointmentFiltersSchema,
  PaginationParamsSchema,
} from '@doctor-appointment-app/shared';
import type {
  AppointmentCreateInput,
  AppointmentUpdateInput,
  AppointmentFilters,
} from '@doctor-appointment-app/shared';

// Re-export shared schemas
export { AppointmentCreateSchema, AppointmentUpdateSchema, AppointmentFiltersSchema };

export type { AppointmentCreateInput, AppointmentUpdateInput, AppointmentFilters };

// Timeline query params (for timeline endpoints)
export const TimelineQuerySchema = PaginationParamsSchema.extend({
  type: z.enum(['all', 'appointments', 'prescriptions']).optional(),
  dateFrom: z.string().datetime({ offset: true }).optional(),
  dateTo: z.string().datetime({ offset: true }).optional(),
});

// Dashboard stats query params
export const DashboardStatsQuerySchema = z.object({
  includeMonthlyExpenses: z.coerce.boolean().default(true),
  includeSpecialtyBreakdown: z.coerce.boolean().default(true),
});

// Type exports
export type TimelineQuery = z.infer<typeof TimelineQuerySchema>;
export type DashboardStatsQuery = z.infer<typeof DashboardStatsQuerySchema>;

// Module-specific validation helpers
export const appointmentValidators = {
  create: AppointmentCreateSchema,
  update: AppointmentUpdateSchema,
  filters: AppointmentFiltersSchema,
  timelineQuery: TimelineQuerySchema,
  dashboardStatsQuery: DashboardStatsQuerySchema,
} as const;

// Validation middleware factory
export function createValidationMiddleware<T extends ZodTypeAny>(schema: T) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const parseResult = schema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: parseResult.error.flatten().fieldErrors,
        },
        meta: null,
      });
    }
    req.validatedData = parseResult.data;
    next();
  };
}

// Query validation middleware factory
export function createQueryValidationMiddleware<T extends ZodTypeAny>(schema: T) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const parseResult = schema.safeParse(req.query);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid query parameters',
          details: parseResult.error.flatten().fieldErrors,
        },
        meta: null,
      });
    }
    req.validatedQuery = parseResult.data;
    next();
  };
}

// Typed validation middlewares
export const validateCreateAppointment = createValidationMiddleware(AppointmentCreateSchema);
export const validateUpdateAppointment = createValidationMiddleware(AppointmentUpdateSchema);
export const validateAppointmentFilters = createQueryValidationMiddleware(AppointmentFiltersSchema);
export const validateTimelineQuery = createQueryValidationMiddleware(TimelineQuerySchema);
export const validateDashboardStatsQuery = createQueryValidationMiddleware(DashboardStatsQuerySchema);
