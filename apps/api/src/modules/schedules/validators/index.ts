/**
 * Schedules Module Validators
 * Validation schemas for schedules/slots module
 */

import type { ZodTypeAny } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import {
  SlotCreateSchema,
  BulkSlotCreateSchema,
  SlotUpdateSchema,
} from '@doctor-appointment-app/shared';
import type {
  SlotCreateInput,
  BulkSlotCreateInput,
  SlotUpdateInput,
} from '@doctor-appointment-app/shared';

// Re-export shared schemas
export { SlotCreateSchema, BulkSlotCreateSchema, SlotUpdateSchema };

export type { SlotCreateInput, BulkSlotCreateInput, SlotUpdateInput };

// Module-specific validation helpers
export const scheduleValidators = {
  createSlot: SlotCreateSchema,
  createBulkSlots: BulkSlotCreateSchema,
  updateSlot: SlotUpdateSchema,
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

// Typed validation middlewares
export const validateCreateSlot = createValidationMiddleware(SlotCreateSchema);
export const validateCreateBulkSlots = createValidationMiddleware(BulkSlotCreateSchema);
export const validateUpdateSlot = createValidationMiddleware(SlotUpdateSchema);
