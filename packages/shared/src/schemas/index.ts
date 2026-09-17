/**
 * Shared Zod schemas for the Doctor Appointment App
 * Single source of truth for API contract validation
 * Types are inferred from these schemas
 */

import { z } from 'zod';
import {
  UserType,
  SlotStatus,
  AppointmentStatus,
  PaymentStatus,
  Gender,
  ConsultationType,
  VALIDATION,
} from '../constants';

// Re-export Zod for convenience
export { z };

// Base schemas
export const IdSchema = z.string().cuid();
export const DateTimeSchema = z
  .string()
  .datetime({ offset: true })
  .transform((val) => new Date(val));
export const DateSchema = z
  .string()
  .date()
  .transform((val) => new Date(val));

// Pagination
export const PaginationParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export function PaginatedResponseSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    data: z.array(itemSchema),
    meta: z.object({
      page: z.number().int().positive(),
      limit: z.number().int().positive(),
      total: z.number().int().nonnegative(),
      totalPages: z.number().int().nonnegative(),
    }),
  });
}

// User schemas
export const UserBaseSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }).toLowerCase(),
  firstName: z
    .string()
    .min(VALIDATION.NAME_MIN_LENGTH, { message: 'First name is required' })
    .max(VALIDATION.NAME_MAX_LENGTH, { message: 'First name is too long' })
    .trim(),
  lastName: z
    .string()
    .min(VALIDATION.NAME_MIN_LENGTH, { message: 'Last name is required' })
    .max(VALIDATION.NAME_MAX_LENGTH, { message: 'Last name is too long' })
    .trim(),
  phone: z
    .string()
    .max(VALIDATION.PHONE_MAX_LENGTH, { message: 'Phone number is too long' })
    .optional()
    .nullable(),
  userType: z.nativeEnum(UserType),
});

export const RegisterSchema = UserBaseSchema.extend({
  password: z
    .string()
    .min(VALIDATION.PASSWORD_MIN_LENGTH, {
      message: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`,
    })
    .max(VALIDATION.PASSWORD_MAX_LENGTH, { message: 'Password is too long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' }),
  // Doctor-specific fields
  specialty: z.string().optional(),
  designation: z.string().optional(),
  licenseNo: z.string().optional(),
  bio: z
    .string()
    .max(VALIDATION.BIO_MAX_LENGTH, { message: 'Bio is too long' })
    .optional()
    .nullable(),
  fee: z.number().positive().optional(),
  // Patient-specific fields
  dob: z.string().date().optional().nullable(),
  gender: z.nativeEnum(Gender).optional().nullable(),
  address: z
    .string()
    .max(VALIDATION.ADDRESS_MAX_LENGTH, { message: 'Address is too long' })
    .optional()
    .nullable(),
  emergencyContact: z
    .string()
    .max(VALIDATION.PHONE_MAX_LENGTH, { message: 'Emergency contact is too long' })
    .optional()
    .nullable(),
}).refine(
  (data) => {
    if (data.userType === UserType.DOCTOR) {
      return data.specialty && data.designation && data.licenseNo && data.fee !== undefined;
    }
    return true;
  },
  {
    message: 'Doctor registration requires specialty, designation, license number, and fee',
    path: ['specialty'],
  }
);

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }).toLowerCase(),
  password: z.string().min(1, { message: 'Password is required' }),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }).toLowerCase(),
});

export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1, { message: 'Reset token is required' }),
    password: z
      .string()
      .min(VALIDATION.PASSWORD_MIN_LENGTH, {
        message: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`,
      })
      .max(VALIDATION.PASSWORD_MAX_LENGTH, { message: 'Password is too long' })
      .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
      .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const VerifyEmailSchema = z.object({
  token: z.string().min(1, { message: 'Verification token is required' }),
});

export const UpdateProfileSchema = z.object({
  firstName: z
    .string()
    .min(VALIDATION.NAME_MIN_LENGTH, { message: 'First name is required' })
    .max(VALIDATION.NAME_MAX_LENGTH, { message: 'First name is too long' })
    .trim()
    .optional(),
  lastName: z
    .string()
    .min(VALIDATION.NAME_MIN_LENGTH, { message: 'Last name is required' })
    .max(VALIDATION.NAME_MAX_LENGTH, { message: 'Last name is too long' })
    .trim()
    .optional(),
  phone: z
    .string()
    .max(VALIDATION.PHONE_MAX_LENGTH, { message: 'Phone number is too long' })
    .optional()
    .nullable(),
  // Patient fields
  dob: z.string().date().optional().nullable(),
  gender: z.nativeEnum(Gender).optional().nullable(),
  address: z
    .string()
    .max(VALIDATION.ADDRESS_MAX_LENGTH, { message: 'Address is too long' })
    .optional()
    .nullable(),
  emergencyContact: z
    .string()
    .max(VALIDATION.PHONE_MAX_LENGTH, { message: 'Emergency contact is too long' })
    .optional()
    .nullable(),
  // Doctor fields
  specialty: z.string().optional(),
  designation: z.string().optional(),
  licenseNo: z.string().optional(),
  bio: z
    .string()
    .max(VALIDATION.BIO_MAX_LENGTH, { message: 'Bio is too long' })
    .optional()
    .nullable(),
  fee: z.number().positive().optional(),
});

// Doctor Profile schemas
export const DoctorProfileCreateSchema = z.object({
  specialty: z.string().min(1, { message: 'Specialty is required' }),
  designation: z.string().min(1, { message: 'Designation is required' }),
  licenseNo: z.string().min(1, { message: 'License number is required' }),
  bio: z
    .string()
    .max(VALIDATION.BIO_MAX_LENGTH, { message: 'Bio is too long' })
    .optional()
    .nullable(),
  fee: z.number().positive({ message: 'Fee must be positive' }),
});

export const DoctorProfileUpdateSchema = DoctorProfileCreateSchema.partial();

export const DoctorSearchFiltersSchema = z.object({
  specialty: z.string().optional(),
  search: z.string().optional(),
  minFee: z.coerce.number().positive().optional(),
  maxFee: z.coerce.number().positive().optional(),
  availableFrom: z.string().datetime({ offset: true }).optional(),
  availableTo: z.string().datetime({ offset: true }).optional(),
  consultationType: z.nativeEnum(ConsultationType).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Schedule/Slot schemas
export const SlotCreateSchema = z
  .object({
    doctorId: z.string().cuid({ message: 'Invalid doctor ID' }),
    startTime: z.string().datetime({ offset: true }, { message: 'Invalid start time format' }),
    endTime: z.string().datetime({ offset: true }, { message: 'Invalid end time format' }),
    status: z.nativeEnum(SlotStatus).default(SlotStatus.AVAILABLE),
  })
  .refine((data) => new Date(data.startTime) < new Date(data.endTime), {
    message: 'Start time must be before end time',
    path: ['endTime'],
  });

export const BulkSlotCreateSchema = z
  .object({
    doctorId: z.string().cuid({ message: 'Invalid doctor ID' }),
    startDate: z.string().date({ message: 'Invalid start date format' }),
    endDate: z.string().date({ message: 'Invalid end date format' }),
    startTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Invalid start time format (HH:MM)' }),
    endTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Invalid end time format (HH:MM)' }),
    slotDuration: z.number().int().positive().default(30),
    daysOfWeek: z
      .array(z.number().int().min(0).max(6))
      .min(1, { message: 'At least one day of week required' }),
  })
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: 'Start date must be before or equal to end date',
    path: ['endDate'],
  });

export const SlotUpdateSchema = z
  .object({
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

// Appointment schemas
export const AppointmentCreateSchema = z.object({
  slotId: z.string().cuid({ message: 'Invalid slot ID' }),
  symptoms: z
    .string()
    .max(VALIDATION.NOTES_MAX_LENGTH, { message: 'Symptoms are too long' })
    .optional()
    .nullable(),
  notes: z
    .string()
    .max(VALIDATION.NOTES_MAX_LENGTH, { message: 'Notes are too long' })
    .optional()
    .nullable(),
  consultationType: z.nativeEnum(ConsultationType).default(ConsultationType.IN_PERSON),
});

export const AppointmentUpdateSchema = z.object({
  status: z.nativeEnum(AppointmentStatus).optional(),
  symptoms: z
    .string()
    .max(VALIDATION.NOTES_MAX_LENGTH, { message: 'Symptoms are too long' })
    .optional()
    .nullable(),
  notes: z
    .string()
    .max(VALIDATION.NOTES_MAX_LENGTH, { message: 'Notes are too long' })
    .optional()
    .nullable(),
  paymentStatus: z.nativeEnum(PaymentStatus).optional(),
  consultationType: z.nativeEnum(ConsultationType).optional(),
});

export const AppointmentFiltersSchema = z.object({
  status: z.array(z.nativeEnum(AppointmentStatus)).optional(),
  dateFrom: z.string().datetime({ offset: true }).optional(),
  dateTo: z.string().datetime({ offset: true }).optional(),
  doctorId: z.string().cuid().optional(),
  patientId: z.string().cuid().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Prescription schemas
export const MedicationSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Medication name is required' })
    .max(200, { message: 'Name is too long' }),
  dosage: z
    .string()
    .min(1, { message: 'Dosage is required' })
    .max(100, { message: 'Dosage is too long' }),
  frequency: z
    .string()
    .min(1, { message: 'Frequency is required' })
    .max(100, { message: 'Frequency is too long' }),
  duration: z
    .string()
    .min(1, { message: 'Duration is required' })
    .max(100, { message: 'Duration is too long' }),
  instructions: z.string().max(500, { message: 'Instructions are too long' }).optional().nullable(),
});

export const PrescriptionCreateSchema = z.object({
  appointmentId: z.string().cuid({ message: 'Invalid appointment ID' }),
  diagnosis: z
    .string()
    .min(1, { message: 'Diagnosis is required' })
    .max(2000, { message: 'Diagnosis is too long' }),
  medications: z.array(MedicationSchema).min(1, { message: 'At least one medication is required' }),
  tests: z
    .string()
    .max(VALIDATION.NOTES_MAX_LENGTH, { message: 'Tests are too long' })
    .optional()
    .nullable(),
  notes: z
    .string()
    .max(VALIDATION.NOTES_MAX_LENGTH, { message: 'Notes are too long' })
    .optional()
    .nullable(),
});

export const PrescriptionUpdateSchema = z.object({
  diagnosis: z
    .string()
    .min(1, { message: 'Diagnosis is required' })
    .max(2000, { message: 'Diagnosis is too long' })
    .optional(),
  medications: z
    .array(MedicationSchema)
    .min(1, { message: 'At least one medication is required' })
    .optional(),
  tests: z
    .string()
    .max(VALIDATION.NOTES_MAX_LENGTH, { message: 'Tests are too long' })
    .optional()
    .nullable(),
  notes: z
    .string()
    .max(VALIDATION.NOTES_MAX_LENGTH, { message: 'Notes are too long' })
    .optional()
    .nullable(),
  pdfUrl: z.string().url({ message: 'Invalid PDF URL' }).optional().nullable(),
});

// API Response schemas
export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.unknown()).nullable(),
});

export const ApiMetaSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  total: z.number().int().nonnegative().optional(),
  totalPages: z.number().int().nonnegative().optional(),
});

export function ApiResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    success: z.boolean(),
    data: dataSchema.nullable(),
    error: ApiErrorSchema.nullable(),
    meta: ApiMetaSchema.nullable(),
  });
}

// Auth tokens
export const AuthTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

// JWT Payload (for verification)
export const JWTPayloadSchema = z.object({
  sub: z.string(),
  email: z.string().email(),
  userType: z.nativeEnum(UserType),
  iat: z.number(),
  exp: z.number(),
  iss: z.string(),
  aud: z.string(),
});

// Change password
export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: 'Current password is required' }),
    newPassword: z
      .string()
      .min(VALIDATION.PASSWORD_MIN_LENGTH, {
        message: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`,
      })
      .max(VALIDATION.PASSWORD_MAX_LENGTH, { message: 'Password is too long' })
      .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
      .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Type exports (inferred from schemas)
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

export type DoctorProfileCreateInput = z.infer<typeof DoctorProfileCreateSchema>;
export type DoctorProfileUpdateInput = z.infer<typeof DoctorProfileUpdateSchema>;
export type DoctorSearchFilters = z.infer<typeof DoctorSearchFiltersSchema>;

export type SlotCreateInput = z.infer<typeof SlotCreateSchema>;
export type BulkSlotCreateInput = z.infer<typeof BulkSlotCreateSchema>;
export type SlotUpdateInput = z.infer<typeof SlotUpdateSchema>;

export type AppointmentCreateInput = z.infer<typeof AppointmentCreateSchema>;
export type AppointmentUpdateInput = z.infer<typeof AppointmentUpdateSchema>;
export type AppointmentFilters = z.infer<typeof AppointmentFiltersSchema>;

export type MedicationInput = z.infer<typeof MedicationSchema>;
export type PrescriptionCreateInput = z.infer<typeof PrescriptionCreateSchema>;
export type PrescriptionUpdateInput = z.infer<typeof PrescriptionUpdateSchema>;

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type PaginationParams = z.infer<typeof PaginationParamsSchema>;
export type JWTPayload = z.infer<typeof JWTPayloadSchema>;
export type AuthTokens = z.infer<typeof AuthTokensSchema>;
export type ApiError = z.infer<typeof ApiErrorSchema>;
export type ApiMeta = z.infer<typeof ApiMetaSchema>;
