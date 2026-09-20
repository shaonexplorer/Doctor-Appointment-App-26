/**
 * Modules Index
 * Exports all feature modules
 */

// Auth module exports
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
} from './auth/types';

export {
  RegisterSchema,
  LoginSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  VerifyEmailSchema,
  ChangePasswordSchema,
  createValidationMiddleware as createAuthValidationMiddleware,
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateVerifyEmail,
  validateChangePassword,
} from './auth/validators';

export { AuthService, createAuthService } from './auth/services/authService';
export { AuthController, createAuthController } from './auth/controllers/authController';
export { createAuthRoutes } from './auth/routes/authRoutes';

// Users module exports
export type {
  UserProfile,
  UserListItem,
  UserStats,
  UpdateProfileInput,
  PaginationParams as UsersPaginationParams,
} from './users/types';

export {
  UpdateProfileSchema,
  PaginationParamsSchema as UsersPaginationParamsSchema,
  createValidationMiddleware as createUserValidationMiddleware,
  createQueryValidationMiddleware as createUserQueryValidationMiddleware,
  validateUpdateProfile as validateUserUpdateProfile,
  validatePagination as validateUsersPagination,
} from './users/validators';

export { UserService, createUserService } from './users/services/userService';
export { UserController, createUserController } from './users/controllers/userController';
export { createUserRoutes } from './users/routes/userRoutes';

// Doctors module exports
export type {
  DoctorProfile,
  DoctorSearchResult,
  DoctorSchedule,
  DoctorSearchFilters,
  DoctorProfileCreateInput,
  DoctorProfileUpdateInput,
} from './doctors/types';

export {
  DoctorSearchFiltersSchema,
  DoctorProfileCreateSchema,
  DoctorProfileUpdateSchema,
  createValidationMiddleware as createDoctorValidationMiddleware,
  createQueryValidationMiddleware as createDoctorQueryValidationMiddleware,
  validateDoctorSearch,
  validateCreateProfile,
  validateUpdateProfile as validateDoctorUpdateProfile,
} from './doctors/validators';

export { DoctorService, createDoctorService } from './doctors/services/doctorService';
export { DoctorController, createDoctorController } from './doctors/controllers/doctorController';
export { createDoctorRoutes } from './doctors/routes/doctorRoutes';

// Schedules module exports
export type {
  ScheduleSlot,
  BulkSlotResult,
  SlotCreateInput,
  BulkSlotCreateInput,
  SlotUpdateInput,
  SlotStatus,
} from './schedules/types';

export {
  SlotCreateSchema,
  BulkSlotCreateSchema,
  SlotUpdateSchema,
  createValidationMiddleware as createScheduleValidationMiddleware,
  validateCreateSlot,
  validateCreateBulkSlots,
  validateUpdateSlot,
} from './schedules/validators';

export { ScheduleService, createScheduleService } from './schedules/services/scheduleService';
export {
  ScheduleController,
  createScheduleController,
} from './schedules/controllers/scheduleController';
export { createScheduleRoutes } from './schedules/routes/scheduleRoutes';

// Appointments module exports
export type {
  Appointment,
  DoctorStats,
  PatientStats,
  AppointmentCreateInput,
  AppointmentUpdateInput,
  AppointmentFilters,
  AppointmentStatus,
  PaymentStatus,
  ConsultationType,
} from './appointments/types';

export {
  AppointmentCreateSchema,
  AppointmentUpdateSchema,
  AppointmentFiltersSchema,
  createValidationMiddleware as createAppointmentValidationMiddleware,
  createQueryValidationMiddleware as createAppointmentQueryValidationMiddleware,
  validateCreateAppointment,
  validateUpdateAppointment,
  validateAppointmentFilters,
} from './appointments/validators';

export {
  AppointmentService,
  createAppointmentService,
} from './appointments/services/appointmentService';
export {
  AppointmentController,
  createAppointmentController,
} from './appointments/controllers/appointmentController';
export { createAppointmentRoutes } from './appointments/routes/appointmentRoutes';

// Prescriptions module exports
export type {
  Prescription,
  PrescriptionCreateInput,
  PrescriptionUpdateInput,
} from './prescriptions/types';

export {
  PrescriptionCreateSchema,
  PrescriptionUpdateSchema,
  PaginationParamsSchema as PrescriptionsPaginationParamsSchema,
  createValidationMiddleware as createPrescriptionValidationMiddleware,
  createQueryValidationMiddleware as createPrescriptionQueryValidationMiddleware,
  validateCreatePrescription,
  validateUpdatePrescription,
  validatePagination as validatePrescriptionsPagination,
} from './prescriptions/validators';

export {
  PrescriptionService,
  createPrescriptionService,
} from './prescriptions/services/prescriptionService';
export {
  PrescriptionController,
  createPrescriptionController,
} from './prescriptions/controllers/prescriptionController';
export { createPrescriptionRoutes } from './prescriptions/routes/prescriptionRoutes';

// Module factory for creating all modules with dependency injection
import type { Repositories } from '../repositories';
import type { PrismaClient } from '@prisma/client';
import { createAuthModule } from './auth';
import { createUsersModule } from './users';
import { createDoctorsModule } from './doctors';
import { createSchedulesModule } from './schedules';
import { createAppointmentsModule } from './appointments';
import { createPrescriptionsModule } from './prescriptions';

export interface AllModules {
  auth: ReturnType<typeof createAuthModule>;
  users: ReturnType<typeof createUsersModule>;
  doctors: ReturnType<typeof createDoctorsModule>;
  schedules: ReturnType<typeof createSchedulesModule>;
  appointments: ReturnType<typeof createAppointmentsModule>;
  prescriptions: ReturnType<typeof createPrescriptionsModule>;
}

export function createAllModules(repositories: Repositories, prisma: PrismaClient): AllModules {
  return {
    auth: createAuthModule(repositories.user),
    users: createUsersModule(repositories.user, prisma),
    doctors: createDoctorsModule(repositories.doctor),
    schedules: createSchedulesModule(repositories.schedule, prisma),
    appointments: createAppointmentsModule(repositories.appointment, repositories.schedule, prisma),
    prescriptions: createPrescriptionsModule(
      repositories.prescription,
      repositories.appointment,
      prisma
    ),
  };
}
