/**
 * Schedules Module Validators
 * Validation schemas for schedules/slots module
 */

import type { ZodTypeAny } from 'zod';
import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../../../shared/middleware/auth';
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
import { z } from 'zod';
import { SlotStatus } from '@prisma/client';

// Re-export shared schemas
export { SlotCreateSchema, BulkSlotCreateSchema, SlotUpdateSchema };

export type { SlotCreateInput, BulkSlotCreateInput, SlotUpdateInput };

// Bulk slot update schema
export const BulkSlotUpdateSchema = z
  .object({
    slotIds: z
      .array(z.string().cuid({ message: 'Invalid slot ID' }))
      .min(1, { message: 'At least one slot ID required' }),
    status: z.nativeEnum(SlotStatus).optional(),
    startTime: z.string().datetime({ offset: true }).optional(),
    endTime: z.string().datetime({ offset: true }).optional(),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return new Date(data.startTime) < new Date(data.endTime);
      }
      return true;
    },
    {
      message: 'Start time must be before end time',
      path: ['endTime'],
    }
  );

export type BulkSlotUpdateInput = z.infer<typeof BulkSlotUpdateSchema>;

// Module-specific validation helpers
export const scheduleValidators = {
  createSlot: SlotCreateSchema,
  createBulkSlots: BulkSlotCreateSchema,
  updateSlot: SlotUpdateSchema,
  updateBulkSlots: BulkSlotUpdateSchema,
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

// Typed validation middlewares
export const validateCreateSlot = createValidationMiddleware(SlotCreateSchema);
export const validateCreateBulkSlots = createValidationMiddleware(BulkSlotCreateSchema);
export const validateUpdateSlot = createValidationMiddleware(SlotUpdateSchema);
export const validateUpdateBulkSlots = createValidationMiddleware(BulkSlotUpdateSchema);
