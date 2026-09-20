/**
 * Shared Utilities
 * Common utility functions used across modules
 */

import type { Request, Response, NextFunction } from 'express';
import { buildSuccessResponse, buildErrorResponse } from '@doctor-appointment-app/shared';

/**
 * Standard success response builder
 */
export function successResponse<T>(data: T, meta?: Record<string, unknown> | null) {
  return buildSuccessResponse(data, meta);
}

/**
 * Standard error response builder
 */
export function errorResponse(code: string, message: string, details?: Record<string, unknown>) {
  return buildErrorResponse(code, message, details);
}

/**
 * Async handler wrapper for Express routes
 * Automatically catches errors and passes to next()
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    void fn(req, res, next).catch(next);
  };
}

/**
 * Pagination helper
 */
export function paginate<T>(data: T[], page: number, limit: number, total: number) {
  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Validate ID format (CUID)
 */
export function isValidCuid(id: string): boolean {
  return /^c[a-z0-9]{24}$/.test(id);
}

/**
 * Sanitize object for logging (remove sensitive fields)
 */
export function sanitizeForLogging(
  obj: Record<string, unknown>,
  sensitiveFields: string[] = ['password', 'token', 'secret', 'authorization']
): Record<string, unknown> {
  const sanitized: Record<string, unknown> = { ...obj };
  for (const field of sensitiveFields) {
    if (Object.prototype.hasOwnProperty.call(sanitized, field)) {
      sanitized[field] = '[REDACTED]';
    }
  }
  return sanitized;
}
