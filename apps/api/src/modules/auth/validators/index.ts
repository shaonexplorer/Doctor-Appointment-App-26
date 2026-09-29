/**
 * Auth Module Validators
 * Validation schemas for authentication module
 * Re-exports and extends shared schemas with module-specific validations
 */

import type { ZodTypeAny } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import {
  RegisterSchema,
  LoginSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  VerifyEmailSchema,
  ChangePasswordSchema,
} from '@doctor-appointment-app/shared';
import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyEmailInput,
  ChangePasswordInput,
} from '@doctor-appointment-app/shared';

// Re-export shared schemas as the canonical validation
export {
  RegisterSchema,
  LoginSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  VerifyEmailSchema,
  ChangePasswordSchema,
};

// Re-export inferred types
export type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyEmailInput,
  ChangePasswordInput,
};

// Module-specific validation helpers
export const authValidators = {
  register: RegisterSchema,
  login: LoginSchema,
  forgotPassword: ForgotPasswordSchema,
  resetPassword: ResetPasswordSchema,
  verifyEmail: VerifyEmailSchema,
  changePassword: ChangePasswordSchema,
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

// Typed validation middlewares for each endpoint
export const validateRegister = createValidationMiddleware(RegisterSchema);
export const validateLogin = createValidationMiddleware(LoginSchema);
export const validateForgotPassword = createValidationMiddleware(ForgotPasswordSchema);
export const validateResetPassword = createValidationMiddleware(ResetPasswordSchema);
export const validateVerifyEmail = createValidationMiddleware(VerifyEmailSchema);
export const validateChangePassword = createValidationMiddleware(ChangePasswordSchema);
