/**
 * Appointments Module Validators
 * Validation schemas for appointments module
 */

import type { ZodTypeAny } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import {
  AppointmentCreateSchema,
  AppointmentUpdateSchema,
  AppointmentFiltersSchema,
} from '@doctor-appointment-app/shared';
import type {
  AppointmentCreateInput,
  AppointmentUpdateInput,
  AppointmentFilters,
} from '@doctor-appointment-app/shared';

// Re-export shared schemas
export { AppointmentCreateSchema, AppointmentUpdateSchema, AppointmentFiltersSchema };

export type { AppointmentCreateInput, AppointmentUpdateInput, AppointmentFilters };

// Module-specific validation helpers
export const appointmentValidators = {
  create: AppointmentCreateSchema,
  update: AppointmentUpdateSchema,
  filters: AppointmentFiltersSchema,
} as const;

// Validation middleware factory
export function createValidationMiddleware<T extends ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
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
  return (req: Request, res: Response, next: NextFunction) => {
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
