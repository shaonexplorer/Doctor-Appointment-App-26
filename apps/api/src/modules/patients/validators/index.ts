/**
 * Patients Module Validators
 * Validation schemas for patient-specific endpoints
 */

import { z } from 'zod';
import type { ZodTypeAny } from 'zod';
import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../../../shared/middleware/auth';
import { PaginationParamsSchema } from '@doctor-appointment-app/shared';

// Timeline query params
export const TimelineQuerySchema = PaginationParamsSchema.extend({
  type: z.enum(['all', 'appointments', 'prescriptions']).optional(),
  dateFrom: z.string().datetime({ offset: true }).optional(),
  dateTo: z.string().datetime({ offset: true }).optional(),
});

export const DashboardStatsQuerySchema = z.object({
  includeMonthlyExpenses: z.coerce.boolean().default(true),
  includeSpecialtyBreakdown: z.coerce.boolean().default(true),
});

// Doctor's patient list query params
export const DoctorPatientListQuerySchema = PaginationParamsSchema.extend({
  search: z.string().optional(), // Search by patient name, email
  condition: z.string().optional(), // Filter by medical condition
  status: z.enum(['all', 'active', 'inactive']).optional(), // Patient status
  sortBy: z.enum(['lastVisit', 'nextAppointment', 'name', 'totalAppointments']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Type exports
export type TimelineQuery = z.infer<typeof TimelineQuerySchema>;
export type DashboardStatsQuery = z.infer<typeof DashboardStatsQuerySchema>;
export type DoctorPatientListQuery = z.infer<typeof DoctorPatientListQuerySchema>;

// Module-specific validation helpers
export const patientValidators = {
  timelineQuery: TimelineQuerySchema,
  dashboardStatsQuery: DashboardStatsQuerySchema,
  doctorPatientListQuery: DoctorPatientListQuerySchema,
} as const;

// Validation middleware factory
export function createValidationMiddleware<T extends ZodTypeAny>(schema: T) {
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
export const validateTimelineQuery = createValidationMiddleware(TimelineQuerySchema);
export const validateDashboardStatsQuery = createValidationMiddleware(DashboardStatsQuerySchema);
export const validateDoctorPatientListQuery = createValidationMiddleware(
  DoctorPatientListQuerySchema
);
