/**
 * Users Module Validators
 * Validation schemas for users module
 */

import type { ZodTypeAny } from 'zod';
import type { Response, NextFunction } from 'express';
import {
  UpdateProfileSchema,
  PaginationParamsSchema,
  DoctorProfileUpdateSchema,
} from '@doctor-appointment-app/shared';
import type {
  UpdateProfileInput,
  PaginationParams,
  DoctorProfileUpdateInput,
} from '@doctor-appointment-app/shared';
import type { AuthenticatedRequest } from '../../../shared/middleware/auth';

// Re-export shared schemas
export { UpdateProfileSchema, PaginationParamsSchema, DoctorProfileUpdateSchema };

export type { UpdateProfileInput, PaginationParams, DoctorProfileUpdateInput };

// Module-specific validation helpers
export const userValidators = {
  updateProfile: UpdateProfileSchema,
  pagination: PaginationParamsSchema,
  doctorProfileUpdate: DoctorProfileUpdateSchema,
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
export const validateUpdateProfile = createValidationMiddleware(UpdateProfileSchema);
export const validatePagination = createQueryValidationMiddleware(PaginationParamsSchema);
export const validateDoctorProfileUpdate = createValidationMiddleware(DoctorProfileUpdateSchema);
