/**
 * Patients Module Validators
 * Validation schemas for patient-specific endpoints
 */

import { z } from 'zod';
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

// Type exports
export type TimelineQuery = z.infer<typeof TimelineQuerySchema>;
export type DashboardStatsQuery = z.infer<typeof DashboardStatsQuerySchema>;

// Module-specific validation helpers
export const patientValidators = {
  timelineQuery: TimelineQuerySchema,
  dashboardStatsQuery: DashboardStatsQuerySchema,
} as const;

// Validation middleware factory
export function createValidationMiddleware<T extends z.ZodTypeAny>(schema: T) {
  return (req: any, res: any, next: any) => {
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