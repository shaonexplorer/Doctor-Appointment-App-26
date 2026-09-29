/**
 * Auth Module
 * Self-contained authentication module with controllers, services, routes, validators, and types
 */

// Types
export type {
  AuthTokens,
  SessionUser,
  AuthResult,
  BetterAuthSignUpResult,
  BetterAuthSignInResult,
  BetterAuthSessionResult,
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyEmailInput,
  ChangePasswordInput,
} from './types';

// Validators - only export schemas and middleware, not types (to avoid duplicates)
export {
  RegisterSchema,
  LoginSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  VerifyEmailSchema,
  ChangePasswordSchema,
  createValidationMiddleware,
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateVerifyEmail,
  validateChangePassword,
} from './validators';

// Service
export { AuthService, createAuthService } from './services/authService';

// Controller
export { AuthController, createAuthController } from './controllers/authController';

// Routes
export { createAuthRoutes } from './routes/authRoutes';

// Module factory for dependency injection
import type { UserRepository } from '../../../repositories';
import { AuthService } from './services/authService';
import { AuthController } from './controllers/authController';
import { createAuthRoutes } from './routes/authRoutes';

export interface AuthModule {
  service: AuthService;
  controller: AuthController;
  routes: ReturnType<typeof createAuthRoutes>;
}

export function createAuthModule(userRepository: UserRepository): AuthModule {
  const service = new AuthService(userRepository);
  const controller = new AuthController(service);
  const routes = createAuthRoutes(controller);

  return {
    service,
    controller,
    routes,
  };
}
