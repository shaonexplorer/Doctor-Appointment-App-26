/**
 * Global Error Handler Middleware
 */

import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import type { ApiError } from '@doctor-appointment-app/shared';

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error('Error:', err);

  // Zod validation errors
  if (err instanceof ZodError) {
    const details: Record<string, unknown> = {};
    err.errors.forEach((e) => {
      const path = e.path.join('.');
      details[path] = e.message;
    });

    return res.status(400).json({
      success: false,
      data: null,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details,
      } as ApiError,
      meta: null,
    });
  }

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    let code = 'DATABASE_ERROR';
    let message = 'Database operation failed';
    let statusCode = 500;

    switch (err.code) {
      case 'P2002': // Unique constraint violation
        code = 'CONFLICT';
        message = 'A record with this value already exists';
        statusCode = 409;
        break;
      case 'P2025': // Record not found
        code = 'NOT_FOUND';
        message = 'Record not found';
        statusCode = 404;
        break;
      case 'P2003': // Foreign key constraint violation
        code = 'CONFLICT';
        message = 'Referenced record does not exist';
        statusCode = 409;
        break;
    }

    return res.status(statusCode).json({
      success: false,
      data: null,
      error: {
        code,
        message,
        details: { prismaCode: err.code },
      } as ApiError,
      meta: null,
    });
  }

  // Custom app errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      data: null,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      } as ApiError,
      meta: null,
    });
  }

  // Default error
  return res.status(500).json({
    success: false,
    data: null,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message,
      details: null,
    } as ApiError,
    meta: null,
  });
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({
    success: false,
    data: null,
    error: {
      code: 'NOT_FOUND',
      message: 'Resource not found',
      details: null,
    } as ApiError,
    meta: null,
  });
}
