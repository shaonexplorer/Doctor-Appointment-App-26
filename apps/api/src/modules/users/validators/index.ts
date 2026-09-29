/**
 * Users Module Validators
 * Validation schemas for users module
 */

import type { ZodTypeAny } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import { UpdateProfileSchema, PaginationParamsSchema } from '@doctor-appointment-app/shared';
import type { UpdateProfileInput, PaginationParams } from '@doctor-appointment-app/shared';

// Re-export shared schemas
export { UpdateProfileSchema, PaginationParamsSchema };

export type { UpdateProfileInput, PaginationParams };

// Module-specific validation helpers
export const userValidators = {
  updateProfile: UpdateProfileSchema,
  pagination: PaginationParamsSchema,
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
export const validateUpdateProfile = createValidationMiddleware(UpdateProfileSchema);
export const validatePagination = createQueryValidationMiddleware(PaginationParamsSchema);
