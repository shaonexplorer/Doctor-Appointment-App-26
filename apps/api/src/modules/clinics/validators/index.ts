/**
 * Clinics Module Validators
 * Validation schemas for clinic management
 */

import type { ZodTypeAny } from 'zod';
import type { Response, NextFunction } from 'express';
import { z } from 'zod';
import { ClinicStatus } from '@prisma/client';
import { PaginationParamsSchema } from '@doctor-appointment-app/shared';
import type { PaginationParams } from '@doctor-appointment-app/shared';
import type { AuthenticatedRequest } from '../../../shared/middleware/auth';

// Clinic create schema
export const ClinicCreateSchema = z.object({
  name: z.string().min(1, { message: 'Clinic name is required' }).max(100, { message: 'Clinic name is too long' }).trim(),
  address: z.string().max(500, { message: 'Address is too long' }).optional().nullable(),
  phone: z.string().max(20, { message: 'Phone number is too long' }).optional().nullable(),
  email: z.string().email({ message: 'Invalid email address' }).optional().nullable(),
  status: z.nativeEnum(ClinicStatus).optional(),
});

// Clinic update schema
export const ClinicUpdateSchema = ClinicCreateSchema.partial();

// Clinic filters schema (query params)
export const ClinicFiltersSchema = PaginationParamsSchema.extend({
  search: z.string().optional(),
  status: z.nativeEnum(ClinicStatus).optional(),
});

// Re-export shared schemas
export { PaginationParamsSchema };

export type { PaginationParams, ClinicCreateInput, ClinicUpdateInput, ClinicFilters };

// Module-specific validation helpers
export const clinicValidators = {
  create: ClinicCreateSchema,
  update: ClinicUpdateSchema,
  filters: ClinicFiltersSchema,
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
export const validateClinicCreate = createValidationMiddleware(ClinicCreateSchema);
export const validateClinicUpdate = createValidationMiddleware(ClinicUpdateSchema);
export const validateClinicFilters = createQueryValidationMiddleware(ClinicFiltersSchema);
