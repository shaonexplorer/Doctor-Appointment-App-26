/**
 * Shared constants for the Doctor Appointment App
 * Single source of truth for enums, config values, and static data
 */

// User roles
export enum UserType {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT',
}

export const USER_TYPE_LABELS: Record<UserType, string> = {
  [UserType.ADMIN]: 'Administrator',
  [UserType.STAFF]: 'Staff',
  [UserType.DOCTOR]: 'Doctor',
  [UserType.PATIENT]: 'Patient',
};

export const USER_TYPE_HIERARCHY: UserType[] = [
  UserType.ADMIN,
  UserType.STAFF,
  UserType.DOCTOR,
  UserType.PATIENT,
];

// Slot status
export enum SlotStatus {
  AVAILABLE = 'AVAILABLE',
  BOOKED = 'BOOKED',
  CANCELLED = 'CANCELLED',
}

export const SLOT_STATUS_LABELS: Record<SlotStatus, string> = {
  [SlotStatus.AVAILABLE]: 'Available',
  [SlotStatus.BOOKED]: 'Booked',
  [SlotStatus.CANCELLED]: 'Cancelled',
};

export const SLOT_STATUS_COLORS: Record<SlotStatus, string> = {
  [SlotStatus.AVAILABLE]: 'bg-emerald-100 text-emerald-800',
  [SlotStatus.BOOKED]: 'bg-cobalt-100 text-cobalt-800',
  [SlotStatus.CANCELLED]: 'bg-red-100 text-red-800',
};

// Appointment status
export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  [AppointmentStatus.SCHEDULED]: 'Scheduled',
  [AppointmentStatus.COMPLETED]: 'Completed',
  [AppointmentStatus.CANCELLED]: 'Cancelled',
  [AppointmentStatus.NO_SHOW]: 'No Show',
};

export const APPOINTMENT_STATUS_COLORS: Record<AppointmentStatus, string> = {
  [AppointmentStatus.SCHEDULED]: 'bg-cobalt-100 text-cobalt-800',
  [AppointmentStatus.COMPLETED]: 'bg-emerald-100 text-emerald-800',
  [AppointmentStatus.CANCELLED]: 'bg-red-100 text-red-800',
  [AppointmentStatus.NO_SHOW]: 'bg-amber-100 text-amber-800',
};

// Payment status
export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'Pending',
  [PaymentStatus.PAID]: 'Paid',
  [PaymentStatus.REFUNDED]: 'Refunded',
};

// Gender
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}

export const GENDER_LABELS: Record<Gender, string> = {
  [Gender.MALE]: 'Male',
  [Gender.FEMALE]: 'Female',
  [Gender.OTHER]: 'Other',
  [Gender.PREFER_NOT_TO_SAY]: 'Prefer not to say',
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// Rate limiting
export const RATE_LIMITS = {
  AUTH_LOGIN: { windowMs: 60 * 1000, maxRequests: 5 }, // 5 req/min
  AUTH_REGISTER: { windowMs: 60 * 60 * 1000, maxRequests: 3 }, // 3 req/hour
  AUTH_FORGOT_PASSWORD: { windowMs: 60 * 60 * 1000, maxRequests: 3 }, // 3 req/hour
  API_DEFAULT: { windowMs: 60 * 1000, maxRequests: 100 }, // 100 req/min
} as const;

// JWT
export const JWT = {
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d',
  ISSUER: 'doctor-appointment-app',
  AUDIENCE: 'doctor-appointment-app',
} as const;

// Cookie
export const COOKIE = {
  ACCESS_TOKEN_NAME: 'access_token',
  REFRESH_TOKEN_NAME: 'refresh_token',
  OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
} as const;

// Database
export const DATABASE = {
  CONNECTION_LIMIT: 10,
  POOL_TIMEOUT: 30000,
} as const;

// Validation
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 100,
  PHONE_MAX_LENGTH: 20,
  ADDRESS_MAX_LENGTH: 500,
  BIO_MAX_LENGTH: 2000,
  NOTES_MAX_LENGTH: 5000,
} as const;

// Time slots
export const TIME_SLOT = {
  DEFAULT_DURATION_MINUTES: 30,
  MIN_DURATION_MINUTES: 15,
  MAX_DURATION_MINUTES: 120,
  SLOT_INTERVAL_MINUTES: 15,
} as const;

// File uploads
export const UPLOAD = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_MIME_TYPES: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
  PRESCRIPTION_PDF_PREFIX: 'prescriptions/',
} as const;

// API
export const API = {
  VERSION: 'v1',
  PREFIX: '/api',
  HEALTH_CHECK: '/health',
} as const;

// Frontend routes
export const FRONTEND_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  DASHBOARD: '/dashboard',
  DOCTOR_DASHBOARD: '/dashboard/doctor',
  PATIENT_DASHBOARD: '/dashboard/patient',
  ADMIN_DASHBOARD: '/dashboard/admin',
  STAFF_DASHBOARD: '/dashboard/staff',
  APPOINTMENTS: '/appointments',
  DOCTORS: '/doctors',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

// Doctor specialties (common list for validation)
export const DOCTOR_SPECIALTIES = [
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'General Practice',
  'Gynecology',
  'Neurology',
  'Oncology',
  'Ophthalmology',
  'Orthopedics',
  'Otolaryngology (ENT)',
  'Pediatrics',
  'Psychiatry',
  'Pulmonology',
  'Radiology',
  'Urology',
  'Other',
] as const;

// Consultation types
export enum ConsultationType {
  IN_PERSON = 'IN_PERSON',
  VIDEO = 'VIDEO',
  PHONE = 'PHONE',
}

export const CONSULTATION_TYPE_LABELS: Record<ConsultationType, string> = {
  [ConsultationType.IN_PERSON]: 'In Person',
  [ConsultationType.VIDEO]: 'Video Call',
  [ConsultationType.PHONE]: 'Phone Call',
};
