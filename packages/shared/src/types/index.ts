/**
 * Shared TypeScript types for the Doctor Appointment App
 * Prisma model types and custom types not covered by Zod schemas
 */

import type {
  UserType,
  SlotStatus,
  AppointmentStatus,
  PaymentStatus,
  Gender,
  ConsultationType,
} from '../constants';

// Base types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// User types
export interface User extends BaseEntity {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  userType: UserType;
  emailVerified: boolean;
}

export interface UserProfile extends Omit<User, 'passwordHash'> {
  doctorProfile: DoctorProfile | null;
  patientProfile: PatientProfile | null;
}

// Doctor Profile
export interface DoctorProfile extends BaseEntity {
  userId: string;
  user: User;
  specialty: string;
  designation: string;
  licenseNo: string;
  bio: string | null;
  fee: number; // Decimal as number
  schedules: Schedule[];
}

// Patient Profile
export interface PatientProfile extends BaseEntity {
  userId: string;
  user: User;
  dob: Date | null;
  gender: Gender | null;
  address: string | null;
  emergencyContact: string | null;
  appointments: Appointment[];
}

// Schedule/Slot
export interface Schedule extends BaseEntity {
  doctorId: string;
  doctor: DoctorProfile;
  startTime: Date;
  endTime: Date;
  status: SlotStatus;
  appointment: Appointment | null;
}

// Appointment
export interface Appointment extends BaseEntity {
  patientId: string;
  patient: User;
  doctorId: string;
  doctor: User;
  slotId: string;
  slot: Schedule;
  status: AppointmentStatus;
  symptoms: string | null;
  notes: string | null;
  paymentStatus: PaymentStatus;
  prescriptions: Prescription[];
  consultationType: ConsultationType;
}

// Prescription
export interface Prescription extends BaseEntity {
  appointmentId: string;
  appointment: Appointment;
  doctorId: string;
  patientId: string;
  diagnosis: string;
  medications: Medication[];
  tests: string | null;
  notes: string | null;
  pdfUrl: string | null;
}

// Medication (nested in Prescription)
export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string | null;
}

// Session (from BetterAuth)
export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  token: string;
  ipAddress?: string;
  userAgent?: string;
}

// Role permissions
export interface Permission {
  resource: string;
  action: string;
  conditions?: Record<string, unknown>;
}

export type RolePermissions = Record<UserType, Permission[]>;

// Audit log
export interface AuditLogEntry {
  id: string;
  userId: string | null;
  action: string;
  resource: string;
  resourceId: string | null;
  oldData: Record<string, unknown> | null;
  newData: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
}

// Dashboard analytics
export interface PatientDashboardStats {
  upcomingAppointments: number;
  totalAppointments: number;
  totalExpenses: number;
  prescriptionCompliance: number;
  appointmentsBySpecialty: Array<{ specialty: string; count: number }>;
  monthlyExpenses: Array<{ month: string; amount: number }>;
}

export interface DoctorDashboardStats {
  todayAppointments: number;
  weeklyAppointments: number;
  slotUtilization: number;
  totalRevenue: number;
  revenueByConsultationType: Array<{ type: ConsultationType; amount: number }>;
  dailyVolume: Array<{ date: string; count: number }>;
}

// Webhook events
export interface WebhookEvent<T = unknown> {
  id: string;
  type: string;
  data: T;
  createdAt: Date;
}
